<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSharedPostRequest;
use App\Http\Requests\UpdateSharedPostRequest;
use App\Models\Post;
use App\Models\SharedPost;
use Illuminate\Support\Facades\Auth;

class SharedPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
    public function store(StoreSharedPostRequest $request)
    {
        $request->validate([
            'post_id' => 'required|exists:regular_posts,id',
        ]);

        $sharedPost = SharedPost::create([
            'regular_post_id' => $request->input('post_id'),
        ]);

        $post = new Post([
            'user_id' => Auth::user()->id,
        ]);

        $post->posteable()->associate($sharedPost);
        $post->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(SharedPost $sharedPost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SharedPost $sharedPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSharedPostRequest $request, SharedPost $sharedPost)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SharedPost $sharedPost)
    {
        dd();

        $sharedPost->post->delete();
        $sharedPost->delete();
    }
}
