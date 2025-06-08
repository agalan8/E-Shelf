<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LineaCarrito;
use Illuminate\Support\Facades\Auth;

class LineaCarritoController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $lineas = LineaCarrito::with('shopPost.regular_post.image', 'shopPost.post.user')
            ->where('user_id', $user->id)
            ->get();

        return back();
    }

    public function add(Request $request)
    {
        $user = Auth::user();

        $exists = LineaCarrito::where('user_id', $user->id)
            ->where('shop_post_id', $request->shop_post_id)
            ->exists();

        if (!$exists) {
            LineaCarrito::create([
                'user_id' => $user->id,
                'shop_post_id' => $request->shop_post_id,
            ]);
            return back();
        }

        return back();
    }

    public function remove(Request $request)
    {
        $user = Auth::user();

        $linea = LineaCarrito::where('user_id', $user->id)
            ->where('shop_post_id', $request->shop_post_id)
            ->first();

        if ($linea) {
            $linea->delete();
            return back();
        }

        return back();
    }
}
