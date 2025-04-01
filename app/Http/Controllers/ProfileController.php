<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $request->user(),
            'socials' => $request->user()->socials,

        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {

        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        $user = $request->user(); // Obtiene el usuario autenticado

        $socials = [
            'instagram' => $request->input('instagram'),
            'twitter'   => $request->input('twitter'),
            'facebook'  => $request->input('facebook'),
        ];

        foreach ($socials as $nombre => $perfil) {
            $existingSocial = $user->socials()->where('nombre', $nombre)->first();

            if ($perfil === null) {
                // Si el campo está vacío y existe una relación, eliminarla
                if ($existingSocial) {
                    $existingSocial->delete();
                }
            } else {
                // Si hay una relación existente, actualizar si la perfil es diferente
                if ($existingSocial) {
                    if ($existingSocial->perfil !== $perfil) {
                        $existingSocial->update(['perfil' => $perfil]);
                    }
                } else {
                    // Si no existe relación, crear una nueva
                    $user->socials()->create([
                        'nombre' => $nombre,
                        'perfil'  => $perfil,
                    ]);
                }
            }
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
