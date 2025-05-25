<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Auth;
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


        Stripe::setApiKey(env('STRIPE_SECRET'));

        $line_items = [];

        foreach ($lineasCarrito as $linea) {
            $precioCentimos = (int) round($linea->shopPost->precio * 100);

            // Aquí usaremos un objeto con price_data para enviar precio dinámico
            $line_items[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $linea->shopPost->regularPost->titulo ?? 'Producto',
                        'images' => [$linea->shopPost->regularPost->image->path_small ?? ''], // URL imagen si tienes
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

    // Opcional: rutas para éxito y cancelación
    public function success(Request $request)
    {

        $user = User::findOrFail(Auth::user()->id);
        // ✅ Recuperar las líneas desde la sesión del servidor
        $ids = session('lineas_carrito_pagadas', []);

        // Obtener solo las líneas que realmente están en el carrito y son del usuario
        $lineas = $user->lineasCarrito()->whereIn('id', $ids)->get();

        if (count($lineas) !== count($ids)) {
            abort(403, 'Validación de carrito fallida.');
        }

        // 💥 Aquí podrías crear el pedido (Order) o similar antes de borrar

        // Eliminar solo las líneas válidas que se pagaron
        $lineas->each->delete();

        session()->forget('lineas_carrito_pagadas');


        return redirect()->route('shops.show', $user->shop->id); // O vista simple con mensaje
    }

    public function cancel()
    {
        $user = User::findOrFail(Auth::user()->id);

        session()->forget('lineas_carrito_pagadas');
        return redirect()->route('shops.show', $user->shop->id); // O vista simple con mensaje
    }
}
