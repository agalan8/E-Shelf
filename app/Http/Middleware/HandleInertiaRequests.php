<?php

namespace App\Http\Middleware;

use App\Models\Social;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        if (Auth::check()) {
            $user = User::find(Auth::user()->id);
            if ($user) {
                $user->load('socials', 'profileImage', 'backgroundImage');
            }
        }

        $newCommentId = session('newCommentId');

        // Cargar notificaciones no leídas (limitadas a 10)
        $notifications = [];
        if ($request->user()) {
            $notifications = $request->user()->unreadNotifications()
                ->take(10)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->data['type'] ?? 'other',
                        'data' => $notification->data,
                        'created_at' => $notification->created_at->diffForHumans(),
                    ];
                });
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()
                    ? $request->user()->load(
                        'following',
                        'profileImage',
                        'backgroundImage',
                        'communities',
                        'shop',
                        'lineasCarrito',
                        'lineasCarrito.shopPost',
                        'lineasCarrito.shopPost.regularPost',
                        'lineasCarrito.shopPost.regularPost.image',
                        'lineasCarrito.shopPost.post.user'
                    )
                    : null,
            ],
            'userEdit' => $user ?? null,
            'socials' => Social::all(),
            'users' => User::all(),
            'newCommentId' => $newCommentId,
            'notifications' => $notifications,  // Aquí pasamos las notificaciones a Inertia
        ];
    }
}
