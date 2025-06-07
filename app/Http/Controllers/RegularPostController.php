<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegularPostRequest;
use App\Http\Requests\UpdateRegularPostRequest;
use App\Models\Community;
use App\Models\Image;
use App\Models\Post;
use App\Models\RegularPost;
use App\Models\ShopPost;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
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
        $user = User::findOrFail(Auth::id());

        $communities = $user->communityMemberships()
            ->where('community_role_id', '!=', 4) // aplica el filtro aquí
            ->with('community') // carga la relación community
            ->get()
            ->pluck('community') // extrae las comunidades
            ->filter(); // elimina posibles null por seguridad

        return Inertia::render('Posts/Create', [
            'tags' => Tag::all(),
            'communities' => $communities,
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
                'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:20480',
                'localizacion' => 'nullable|string|max:255',
                'latitud' => 'nullable|numeric|between:-90,90',
                'longitud' => 'nullable|numeric|between:-180,180',
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

    // Ruta temporal (necesaria para exif_read_data)
    $path = $imagen->getRealPath();

    // Obtener EXIF (solo funciona con JPEG y TIFF)
    $exif = @exif_read_data($path);

    // Función para convertir valores tipo "850/10" a float
    $evalFraction = fn($val) => is_string($val) && strpos($val, '/') !== false
        ? (float)eval('return ' . $val . ';')
        : (float)$val;

    $fechaHora = $exif['DateTimeOriginal'] ?? null;
    $marca = $exif['Make'] ?? null;
    $modelo = $exif['Model'] ?? null;
    $exposicion = $exif['ExposureTime'] ?? null;
    $diafragma = isset($exif['FNumber']) ? $evalFraction($exif['FNumber']) : null;
    $iso = isset($exif['ISOSpeedRatings']) ? (int)$exif['ISOSpeedRatings'] : null;

    // Flash: bit 0 indica si flash fue disparado (1 = sí, 0 = no)
    $flash = isset($exif['Flash']) ? (($exif['Flash'] & 1) === 1) : null;

    $longitudFocal = isset($exif['FocalLength']) ? $evalFraction($exif['FocalLength']) . ' mm' : null;

    $extension = $imagen->getClientOriginalExtension();
    $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
    $path_original = "public/posts/{$RegularPost->id}/original/{$RegularPost->id}.{$extension}";
    $path_medium = "public/posts/{$RegularPost->id}/medium/{$RegularPost->id}.{$extension}";
    $path_small = "public/posts/{$RegularPost->id}/small/{$RegularPost->id}.{$extension}";

    $mediumImage = ImageIntervention::read($imagen)->scale(height: 600)->encode();
    $small_Image = ImageIntervention::read($imagen)->scale(height: 450)->encode();
    $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);

    Storage::disk('s3')->put($path_original, $imagen, 'public');
    Storage::disk('s3')->put($path_medium, $mediumImage, 'public');
    Storage::disk('s3')->put($path_small, $small_Image, 'public');

    $image = new Image([
        'path_original' => $path_aws . $path_original,
        'path_medium' => $path_aws . $path_medium,
        'path_small' => $path_aws . $path_small,
        'type' => 'RegularPost',
        'localizacion' => $request->localizacion,
        'latitud' => $request->latitud,
        'longitud' => $request->longitud,
        // Aquí los metadatos
        'fecha_hora' => $fechaHora,
        'marca' => $marca,
        'modelo' => $modelo,
        'exposicion' => $exposicion,
        'diafragma' => $diafragma,
        'iso' => $iso,
        'flash' => $flash,
        'longitud_focal' => $longitudFocal,
    ]);

    $image->imageable()->associate($RegularPost)->save();
}


        $tags = $request->input('tags');

        if ($tags != null) {
            foreach ($tags as $tag) {
                $RegularPost->tags()->attach(Tag::findOrFail($tag));
            }
        }

        $communities = $request->input('communities');

        if ($communities != null) {
            foreach ($communities as $community) {
                $RegularPost->communities()->attach(Community::findOrFail($community));
            }
        }

        if ($request->has('add_to_store')) {

            $user = User::findOrFail(Auth::user()->id);

            $request->validate([
                'precio' => [
                    'required',
                    'regex:/^\d{1,10}(\.\d{2})?$/'
                ],
            ]);


            $ShopPost = ShopPost::create([
                'shop_id' => $user->shop->id,
                'regular_post_id' => $RegularPost->id,
                'precio' => $request->precio,
            ]);

            $post = new Post([
                'user_id' => Auth::user()->id,
            ]);

            $post->posteable()->associate($ShopPost);
            $post->save();
        }

        DB::commit();

        $user = User::findOrFail(Auth::id());

        if ($request->has('add_to_store')) {
            return redirect()->route('shops.show', $user->shop->id);
        }

        return redirect()->route('users.show', $user);
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
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480',
            'localizacion' => 'nullable|string|max:255',
            'latitud' => 'nullable|numeric|between:-90,90',
            'longitud' => 'nullable|numeric|between:-180,180',
        ]);

        DB::beginTransaction();

        // Buscar el post que se quiere actualizar
        $RegularPost = RegularPost::findOrFail($id);
        $RegularPost->titulo = $request->titulo;
        $RegularPost->descripcion = $request->descripcion;
        $RegularPost->image->localizacion = $request->localizacion;
        $RegularPost->image->latitud = $request->latitud;
        $RegularPost->image->longitud = $request->longitud;

        // Actualizar la imagen si se sube una nueva
        if ($request->hasFile('imagen')) {

            $imagen = $request->file('imagen');

                // Ruta temporal (necesaria para exif_read_data)
            $path = $imagen->getRealPath();

            // Obtener EXIF (solo funciona con JPEG y TIFF)
            $exif = @exif_read_data($path);

            // Función para convertir valores tipo "850/10" a float
            $evalFraction = fn($val) => is_string($val) && strpos($val, '/') !== false
                ? (float)eval('return ' . $val . ';')
                : (float)$val;

            $fechaHora = $exif['DateTimeOriginal'] ?? null;
            $marca = $exif['Make'] ?? null;
            $modelo = $exif['Model'] ?? null;
            $exposicion = $exif['ExposureTime'] ?? null;
            $diafragma = isset($exif['FNumber']) ? $evalFraction($exif['FNumber']) : null;
            $iso = isset($exif['ISOSpeedRatings']) ? (int)$exif['ISOSpeedRatings'] : null;

            // Flash: bit 0 indica si flash fue disparado (1 = sí, 0 = no)
            $flash = isset($exif['Flash']) ? (($exif['Flash'] & 1) === 1) : null;

            $longitudFocal = isset($exif['FocalLength']) ? $evalFraction($exif['FocalLength']) . ' mm' : null;

            $RegularPost->image->fecha_hora = $fechaHora;
            $RegularPost->image->marca = $marca;
            $RegularPost->image->modelo = $modelo;
            $RegularPost->image->exposicion = $exposicion;
            $RegularPost->image->diafragma = $diafragma;
            $RegularPost->image->iso = $iso;
            $RegularPost->image->flash = $flash;
            $RegularPost->image->longitud_focal = $longitudFocal;

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

            $mediumImage = ImageIntervention::read($imagen)->scale(height: 600)->encode();
            $small_Image = ImageIntervention::read($imagen)->scale(height: 450)->encode();
            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);



            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');
            Storage::disk('s3')->put($path_small, $small_Image, 'public');





            // Actualizamos la foto asociada al post
            $RegularPost->image()->update([
                'path_original' => $path_aws . $path_original,
                'path_medium' => $path_aws . $path_medium,
                'path_small' => $path_aws . $path_small,
            ]);
        }

        // Actualizar las etiquetas
        $tags = $request->input('tags');

        $RegularPost->tags()->detach();

        if ($tags != null) {
            foreach ($tags as $tag) {
                $RegularPost->tags()->attach(Tag::findOrFail($tag));
            }
        }

        $RegularPost->communities()->detach();

        $communities = $request->input('communities');

        if ($communities != null) {
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
