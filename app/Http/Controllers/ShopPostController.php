<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShopPostRequest;
use App\Http\Requests\UpdateShopPostRequest;
use App\Models\Post;
use App\Models\ShopPost;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class ShopPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
        use AuthorizesRequests;

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShopPostRequest $request)
    {
        $user = User::findOrFail(Auth::user()->id);
        $shop = $user->shop; // Asumiendo que el usuario autenticado tiene una tienda asociada

        $request->validate([
            'posts' => ['required', 'array', 'min:1'],
            'posts.*.id' => ['required', 'integer', 'exists:regular_posts,id'],
            'posts.*.precio' => [
                'required',
                'regex:/^\d{1,10}(\.\d{1,2})?$/'
            ],
        ]);

        foreach ($request->posts as $postData) {

            $ShopPost = ShopPost::create([
                'shop_id' => $shop->id,
                'regular_post_id' => $postData['id'],
                'precio' => $postData['precio'],
            ]);

            $post = new Post([
                'user_id' => Auth::user()->id,
            ]);

            $post->posteable()->associate($ShopPost);
            $post->save();
        }

        return back();
    }



    /**
     * Display the specified resource.
     */
    public function show(ShopPost $shopPost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ShopPost $shopPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShopPostRequest $request, ShopPost $shopPost)
    {
        $request->validate([
            'precio' => [
                'required',
                'regex:/^\d{1,10}(\.\d{1,2})?$/'
            ],
        ]);

        $shopPost->update([
            'precio' => $request->precio,
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShopPost $shopPost)
    {
        $this->authorize('delete', $shopPost);
        $shopPost->delete();
    }
}
