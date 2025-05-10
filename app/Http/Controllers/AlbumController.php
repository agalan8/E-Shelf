<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlbumRequest;
use App\Http\Requests\UpdateAlbumRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Album;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
            'portada' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        $album = Album::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'user_id' => $user->id,
        ]);

        if ($request->hasFile('portada')) {

            $path = $request->file('portada')->storePublicly('public/albums/portadas');

            $album->portada = "{$path}";

        }

        if ($request->has('selectedPosts')) {
            foreach ($request->selectedPosts as $postId) {
                // Verificar si la relación ya existe, si no, agregarla
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
        $user = User::findOrFail($userId);
        $posts = Post::where('user_id', $userId)->with('image', 'tags', 'user')->get();
        return Inertia::render('Albums/Show', [
            'album' => $album->with('posts', 'user', 'posts.image', 'posts.user', 'posts.tags')->find($album->id),
            'userPosts' => $posts,
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
            'portada' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $album->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
        ]);

        if ($request->hasFile('portada')) {

            $path = parse_url($album->portada, PHP_URL_PATH); // /public/profile_images/123.jpg
            $path = ltrim($path, '/'); // public/profile_images/123.jpg

            // Eliminar del bucket S3
            Storage::disk('s3')->delete($path);

            $path = $request->file('portada')->storePublicly('public/albums/portadas');

            $album->portada = "{$path}";
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
}
