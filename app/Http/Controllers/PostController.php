<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Photo;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
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
        return Inertia::render('Posts/Create', [
            'tags' => Tag::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'localizacion' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        $post = Post::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'user_id' => Auth::user()->id,
        ]);

        $user = Auth::user();

        if ($request->hasFile('imagen')) {

            // $extension = $request->file('profile_image')->getClientOriginalExtension();
            $path = "posts_images/{$post->id}_{$user->id}.jpg";
            Storage::put($path, file_get_contents($request->file('imagen')));

            Photo::create([
                'localizacion' => $request->localizacion,
                'url' => $path,
                'post_id' => $post->id,
            ]);

        }

        $tags = $request->input('tags');

        if($tags != null) {
            foreach ($tags as $tag) {
                $post->tags()->attach(Tag::findOrFail($tag));
            }
        }

        DB::commit();

        return redirect()->route('mis-posts');

    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
