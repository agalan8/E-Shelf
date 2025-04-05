<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlbumRequest;
use App\Http\Requests\UpdateAlbumRequest;
use App\Models\Album;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AlbumController extends Controller
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

            // $extension = $request->file('profile_image')->getClientOriginalExtension();
            $path = "albums_images/{$album->id}_{$user->id}.jpg";
            Storage::put($path, file_get_contents($request->file('portada')));
            $album->portada = $path;

        }

        $album->save();

        return redirect()->route('mis-albums');

    }

    /**
     * Display the specified resource.
     */
    public function show(Album $album)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Album $album)
    {
        //
    }
}
