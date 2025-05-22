<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegularPostRequest;
use App\Http\Requests\UpdateRegularPostRequest;
use App\Models\Community;
use App\Models\Image;
use App\Models\Post;
use App\Models\RegularPost;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image as ImageIntervention;


class RegularPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use AuthorizesRequests;
    public function index()
    {
        $posts = RegularPost::orderBy('created_at')->with('post.user', 'image', 'tags', 'communities')->get();

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
            'communities' => Auth::user()->communities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRegularPostRequest $request)
    {

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'localizacion' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        $RegularPost = RegularPost::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
        ]);

        $post = new Post([
            'user_id' => Auth::user()->id,
        ]);

        $post->posteable()->associate($RegularPost);
        $post->save();

        if ($request->hasFile('imagen')) {

            $imagen = $request->file('imagen');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/posts/{$RegularPost->id}/original/{$RegularPost->id}.{$extension}";
            $path_medium = "public/posts/{$RegularPost->id}/medium/{$RegularPost->id}.{$extension}";
            $path_small = "public/posts/{$RegularPost->id}/small/{$RegularPost->id}.{$extension}";

            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();
            $small_Image = ImageIntervention::read($imagen)->scale( height: 450)->encode();


            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');
            Storage::disk('s3')->put($path_small, $small_Image, 'public');


            $image = new Image([
                'path_original' => $path_aws . $path_original,
                'path_medium' => $path_aws . $path_medium,
                'path_small' => $path_aws . $path_small,
                'type' => 'RegularPost',
                'localizacion' => $request->localizacion,

            ]);

            $image->imageable()->associate($RegularPost)->save();
        }

        $tags = $request->input('tags');

        if($tags != null) {
            foreach ($tags as $tag) {
                $RegularPost->tags()->attach(Tag::findOrFail($tag));
            }
        }

        $communities = $request->input('communities');

        if($communities != null) {
            foreach ($communities as $community) {
                $RegularPost->communities()->attach(Community::findOrFail($community));
            }
        }

        DB::commit();

        $user = User::findOrFail(Auth::id());

        return redirect()->route('users.show', $user );
    }

    /**
     * Display the specified resource.
     */
    public function show(RegularPost $regularPost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RegularPost $regularPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegularPostRequest $request, $id)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'localizacion' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        // Buscar el post que se quiere actualizar
        $RegularPost = RegularPost::findOrFail($id);
        $RegularPost->titulo = $request->titulo;
        $RegularPost->descripcion = $request->descripcion;
        $RegularPost->image->localizacion = $request->localizacion;

        // Actualizar la imagen si se sube una nueva
        if ($request->hasFile('imagen')) {

            $imagen = $request->file('imagen');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/posts/{$RegularPost->id}/original/{$RegularPost->id}.{$extension}";
            $path_medium = "public/posts/{$RegularPost->id}/medium/{$RegularPost->id}.{$extension}";
            $path_small = "public/posts/{$RegularPost->id}/small/{$RegularPost->id}.{$extension}";

            $paths = [
                ltrim(parse_url($RegularPost->image->path_original, PHP_URL_PATH), '/'),
                ltrim(parse_url($RegularPost->image->path_medium, PHP_URL_PATH), '/'),
                ltrim(parse_url($RegularPost->image->path_small, PHP_URL_PATH), '/'),
            ];

            // Eliminar del bucket S3
            Storage::disk('s3')->delete($paths);

            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();
            $small_Image = ImageIntervention::read($imagen)->scale( height: 450)->encode();



            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');
            Storage::disk('s3')->put($path_small, $small_Image, 'public');

            // Actualizamos la foto asociada al post
            $RegularPost->image()->update([
                'path_original' => $path_aws . $path_original,
                'path_medium' =>$path_aws . $path_medium,
                'path_small' => $path_aws . $path_small,
            ]);
        }

        // Actualizar las etiquetas
        $tags = $request->input('tags');

        $RegularPost->tags()->detach();

        if($tags != null) {
            foreach ($tags as $tag) {
                $RegularPost->tags()->attach(Tag::findOrFail($tag));
            }
        }

        $RegularPost->communities()->detach();

        $communities = $request->input('communities');

        if($communities != null) {
            foreach ($communities as $community) {
                $RegularPost->communities()->attach(Community::findOrFail($community));
            }
        }


        $RegularPost->save();
        $RegularPost->image->save();


        DB::commit();

        return redirect()->to(url()->previous());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RegularPost $regularPost)
    {
        $this->authorize('delete', $regularPost);
        $regularPost->delete();
    }
}
