<?php

namespace App\Http\Middleware;

use App\Models\Social;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if (Auth::check()) {
            $user = User::find(Auth::user()->id);
            if ($user) {
                $user->load('socials');
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
            'user' => $request->user() ? $request->user()->load('following') : null,  // Verificamos si hay un usuario autenticado
            ],
            'userEdit' => $user ?? null,
            'socials' => Social::all(),
            'users' => User::all(),
        ];
    }
}
