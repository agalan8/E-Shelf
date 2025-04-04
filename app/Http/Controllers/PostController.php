<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Photo;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     use AuthorizesRequests;
    public function index()
    {
        $posts = Post::orderBy('created_at')->with('user', 'photo', 'tags')->get();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'tags' => Tag::all(),
        ]);
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
    public function update(UpdatePostRequest $request, $id)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'localizacion' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        // Buscar el post que se quiere actualizar
        $post = Post::findOrFail($id);
        $post->titulo = $request->titulo;
        $post->descripcion = $request->descripcion;
        $post->photo->localizacion = $request->localizacion;

        // Actualizar la imagen si se sube una nueva
        if ($request->hasFile('imagen')) {
            $path = "posts_images/{$post->id}_" . Auth::user()->id . ".jpg";
            Storage::put($path, file_get_contents($request->file('imagen')));

            // Actualizamos la foto asociada al post
            $post->photo()->update([
                'localizacion' => $request->localizacion,
                'url' => $path,
            ]);
        }

        // Actualizar las etiquetas
        $tags = $request->input('tags');
        if ($tags != null) {
            // Primero eliminar las etiquetas anteriores
            $post->tags()->detach();

            // Luego asociamos las nuevas etiquetas
            foreach ($tags as $tag) {
                $post->tags()->attach(Tag::findOrFail($tag));
            }
        }

        $post->save();
        $post->photo->save();


        DB::commit();

        return redirect()->route('mis-posts');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();
    }
}
