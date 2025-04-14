<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Social;
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
    public function edit(Request $request): RedirectResponse
    {

        // return Inertia::render('Profile/Edit', [
        //     'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        //     'status' => session('status'),
        //     'user' => $request->user()->load('socials'),
        //     'socials' => Social::all(),
        // ]);

        return redirect()->back();
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

        $user = $request->user();

        // Recorrer todas las redes sociales disponibles
        foreach (Social::all() as $social) {

            $perfil = $request->input(strtolower($social->nombre));

            $existingSocial = $user->socials()->where('social_id', $social->id)->first();

            if ($perfil === null || trim($perfil) === '') {
                // Si el campo está vacío y existe una relación, eliminarla
                if ($existingSocial) {
                    $user->socials()->detach($social->id);
                }
            } else {
                // Si hay una relación existente, actualizar si el perfil es diferente
                if ($existingSocial) {
                    if ($existingSocial->pivot->perfil !== $perfil) {
                        $user->socials()->updateExistingPivot($social->id, ['perfil' => $perfil]);
                    }
                } else {
                    // Si no existe relación, crear una nueva
                    $user->socials()->attach($social->id, ['perfil' => $perfil]);
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
