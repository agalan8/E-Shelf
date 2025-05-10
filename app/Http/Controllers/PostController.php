<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Image;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image as ImageIntervention;
class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     use AuthorizesRequests;
    public function index()
    {
        $posts = Post::orderBy('created_at')->with('user', 'image', 'tags')->get();

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

        if ($request->hasFile('imagen')) {

            $imagen = $request->file('imagen');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/posts/{$post->id}/original/{$post->id}.{$extension}";
            $path_medium = "public/posts/{$post->id}/medium/{$post->id}.{$extension}";
            $path_small = "public/posts/{$post->id}/small/{$post->id}.{$extension}";

            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();


            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');


            $image = new Image([
                'path_original' => $path_aws . $path_original,
                'path_medium' => $path_aws . $path_medium,
                'type' => 'post',
                'localizacion' => $request->localizacion,

            ]);

            $image->imageable()->associate($post)->save();
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
        $post->image->localizacion = $request->localizacion;

        // Actualizar la imagen si se sube una nueva
        if ($request->hasFile('imagen')) {

            $imagen = $request->file('imagen');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/posts/{$post->id}/original/{$post->id}.{$extension}";
            $path_medium = "public/posts/{$post->id}/medium/{$post->id}.{$extension}";
            $path_small = "public/posts/{$post->id}/small/{$post->id}.{$extension}";


            // Eliminar del bucket S3
            Storage::disk('s3')->delete([$path_original, $path_medium]);

            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();

            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');

            // Actualizamos la foto asociada al post
            $post->image()->update([
                'path_original' => $path_aws . $path_original,
                'path_medium' =>$path_aws . $path_medium,
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
        $post->image->save();


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
