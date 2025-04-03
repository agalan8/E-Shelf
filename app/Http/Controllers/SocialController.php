<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSocialRequest;
use App\Http\Requests\UpdateSocialRequest;
use App\Models\Social;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SocialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Socials/Index', [
            'socials' => Social::all(),
        ]);
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
    public function store(StoreSocialRequest $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        Social::create([
            'nombre' => $request->nombre,
        ]);

        return Redirect::route('socials.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Social $social)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Social $social)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSocialRequest $request, Social $social)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $social->update([
            'nombre' => $request->nombre,
        ]);

        return Redirect::route('socials.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Social $social)
    {
        $social->delete();
    }
}
