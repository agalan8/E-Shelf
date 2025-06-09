<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlbumRequest;
use App\Http\Requests\UpdateAlbumRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Album;
use App\Models\Image;
use App\Models\Post;
use App\Models\RegularPost;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image as ImageIntervention;


class AlbumController extends Controller
{

    use AuthorizesRequests;
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
    public function store(StoreAlbumRequest $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descrpcion' => 'string|max:255',
            'portada' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480',
        ]);

        $user = Auth::user();

        $album = Album::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'user_id' => $user->id,
        ]);

        if ($request->hasFile('portada')) {

            $imagen = $request->file('portada');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/albums/{$album->id}/original/{$album->id}.{$extension}";
            $path_medium = "public/albums/{$album->id}/medium/{$album->id}.{$extension}";
            $path_small = "public/albums/{$album->id}/small/{$album->id}.{$extension}";

            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();


            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');


            $image = new Image([
                'path_original' => $path_aws . $path_original,
                'path_medium' => $path_aws . $path_medium,
                'type' => 'cover',
            ]);

            $image->imageable()->associate($album)->save();

        }

        if ($request->has('selectedPosts')) {
            foreach ($request->selectedPosts as $postId) {

                if (!$album->posts->contains($postId)) {
                    $album->posts()->attach($postId);
                }
            }
        }

        $album->save();

        return redirect()->route('mis-albums');

    }

    /**
     * Display the specified resource.
     */
    public function show(Album $album)
    {
        $userId = Auth::user()->id;

        if ($album->user_id !== $userId) {
            return redirect()->back();
        }

        $user = User::findOrFail($userId);
        $posts = RegularPost::doesntHave('shopPost')->whereHas('post', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with(['image', 'tags','post', 'post.user', 'likedBy'])
            ->get();

        $album = tap(Album::with([
            'user',
            'coverImage',
            'posts.comments.user',
            'posts.image',
            'posts.post.user',
            'posts.tags',
            'posts.communities',
            'posts.likedBy'
        ])->findOrFail($album->id), function ($album) {
            $album->posts->each(function ($post) {
                $post->getTotalLikes = $post->getTotalLikes();
                $post->isLikedByUser = $post->isLikedByUser();
                $post->isSharedByUser = Auth::check() ? $post->isSharedByUser() : false;
                $post->getTotalShares = $post->getTotalShares();
            });
        });

        return Inertia::render('Albums/Show', [
            'album' => $album,
            'userPosts' => $posts,
            'tags' => Tag::all(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Album $album)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAlbumRequest $request, Album $album)
    {

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'string|max:255',
            'portada' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480',
        ]);

        $album->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
        ]);

        if ($request->hasFile('portada')) {

            $imagen = $request->file('portada');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/albums/{$album->id}/original/{$album->id}.{$extension}";
            $path_medium = "public/albums/{$album->id}/medium/{$album->id}.{$extension}";
            $path_small = "public/albums/{$album->id}/small/{$album->id}.{$extension}";

            if($album->coverImage){

                $paths = [
                    ltrim(parse_url($album->coverImage->path_original, PHP_URL_PATH), '/'),
                    ltrim(parse_url($album->coverImage->path_medium, PHP_URL_PATH), '/'),
                ];
                Storage::disk('s3')->delete($paths);
            }



            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();

            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');


            if($album->coverImage){
                $album->coverImage()->update([
                    'path_original' => $path_aws . $path_original,
                    'path_medium' =>$path_aws . $path_medium,
                ]);
            } else {

                $image = new Image([
                    'path_original' => $path_aws . $path_original,
                    'path_medium' => $path_aws . $path_medium,
                    'type' => 'cover',
                ]);

                $image->imageable()->associate($album)->save();

            }

        }

        $album->save();

        return redirect()->to(url()->previous());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Album $album)
    {

        $this->authorize('delete', $album);
        $album->delete();
    }

    public function eliminarPortada(Album $album)
{
    if ($album->coverImage) {

        $paths = [
            ltrim(parse_url($album->coverImage->path_original, PHP_URL_PATH), '/'),
            ltrim(parse_url($album->coverImage->path_medium, PHP_URL_PATH), '/'),
        ];
        Storage::disk('s3')->delete($paths);

        $album->coverImage->delete();
    }
}
}
