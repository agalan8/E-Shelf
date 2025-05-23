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
                'success_url' => url('/payment/success') . '?session_id={CHECKOUT_SESSION_ID}',
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
        $user->lineasCarrito()->delete(); // Eliminar el carrito después de la compra
        return redirect()->route('shops.show', $user->shop->id); // O vista simple con mensaje
    }

    public function cancel()
    {
        $user = User::findOrFail(Auth::user()->id);
        return redirect()->route('shops.show', $user->shop->id); // O vista simple con mensaje
    }
}
