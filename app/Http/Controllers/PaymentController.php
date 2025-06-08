<?php

namespace App\Http\Controllers;

use App\Mail\OrderDigitalDownload;
use App\Models\Order;
use App\Models\OrderLine;
use App\Models\User;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {

        $user = User::findOrFail(Auth::user()->id);

        if (!$user) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        $lineasCarrito = $user->lineasCarrito()->with('shopPost')->get();

        if ($lineasCarrito->isEmpty()) {
            return back();
        }

        session(['lineas_carrito_pagadas' => $lineasCarrito->pluck('id')->toArray()]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $line_items = [];

        foreach ($lineasCarrito as $linea) {
            $precioCentimos = (int) round($linea->shopPost->precio * 100);

            $line_items[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $linea->shopPost->regularPost->titulo ?? 'Producto',
                        'images' => [$linea->shopPost->regularPost->image->path_small ?? ''],
                    ],
                    'unit_amount' => $precioCentimos,
                ],
                'quantity' => 1,
            ];
        }

        try {
            $checkout_session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $line_items,
                'mode' => 'payment',
                'success_url' => route('payment.success'),
                'cancel_url' => route('payment.cancel'),
            ]);


            return redirect($checkout_session->url, 303);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function success(Request $request)
    {

        $user = User::findOrFail(Auth::user()->id);
        $ids = session('lineas_carrito_pagadas', []);

        $lineas = $user->lineasCarrito()->whereIn('id', $ids)->get();

        if (count($lineas) !== count($ids)) {
            abort(403, 'Validación de carrito fallida.');
        }

        DB::beginTransaction();

        $order = Order::create(
            [
                'user_id' => $user->id,
                'total' => $lineas->sum(function ($linea) {
                    return $linea->shopPost->precio;
                }),
            ]
            );

        foreach ($lineas as $linea) {

            OrderLine::create([
                'order_id' => $order->id,
                'shop_post_id' => $linea->shopPost->id,
                'titulo' => $linea->shopPost->regularPost->titulo ?? 'Producto',
                'path_small' => $linea->shopPost->regularPost->image->path_small ?? '',
                'path_image' => $linea->shopPost->regularPost->image->path_original ?? '',
                'precio' => $linea->shopPost->precio,
            ]);
        }

        $lineas->each->delete();

        Mail::to($order->user->email)->queue(new OrderDigitalDownload($order));

        DB::commit();

        session()->forget('lineas_carrito_pagadas');


        return redirect()->route('orders.index');
    }

    public function cancel()
    {
        $user = User::findOrFail(Auth::user()->id);

        session()->forget('lineas_carrito_pagadas');
        return redirect()->route('shops.show', $user->shop->id);
    }
}
