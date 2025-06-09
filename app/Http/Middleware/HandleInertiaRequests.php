<?php

namespace App\Http\Middleware;

use App\Models\Community;
use App\Models\RegularPost;
use App\Models\Social;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Carbon\Carbon;

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

            $communities = $user->communityMemberships()
                ->where('community_role_id', '!=', 4)
                ->with('community')
                ->get()
                ->pluck('community')
                ->filter();
        }

        $newCommentId = session('newCommentId');

        Carbon::setLocale('es');

        // Cargar notificaciones no leídas (limitadas a 10)
        $notifications = [];
        if ($request->user()) {
            $notifications = $request->user()->unreadNotifications()
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->data['type'] ?? 'other',
                        'created_at' => $notification->created_at->diffForHumans(),
                        'follower' => isset($notification->data['follower_id'])
                            ? User::with('profileImage')->find($notification->data['follower_id'])
                            : null,
                        'sharer' => isset($notification->data['sharer_id'])
                            ? User::with('profileImage')->find($notification->data['sharer_id'])
                            : null,
                        'liker' => isset($notification->data['liker_id'])
                            ? User::with('profileImage')->find($notification->data['liker_id'])
                            : null,
                        'mentioner' => isset($notification->data['mentioner_id'])
                            ? User::with('profileImage')->find($notification->data['mentioner_id'])
                            : null,
                        'requester' => isset($notification->data['requester_id'])
                            ? User::with('profileImage')->find($notification->data['requester_id'])
                            : null,
                        'post' => isset($notification->data['post_id'])
                            ? RegularPost::with('image', 'tags', 'communities', 'post', 'post.user', 'post.user.profileImage', 'post.user.backgroundImage', 'comments', 'comments.user', 'comments.user.profileImage', 'comments.user.backgroundImage', 'comments.replies', 'comments.replies.user', 'comments.replies.user.profileImage', 'comments.replies.user.backgroundImage')->find($notification->data['post_id'])
                            : null,
                        'community' => isset($notification->data['community_id'])
                            ? Community::with('profileImage')->find($notification->data['community_id'])
                            : null,
                    ];
                });
        }

        $unreadNotificationCount = $request->user()
            ? $request->user()->unreadNotifications->count()
            : 0;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()
                    ? $request->user()->load(
                        'following',
                        'profileImage',
                        'backgroundImage',
                        'communityMemberships',
                        'shop',
                        'lineasCarrito',
                        'lineasCarrito.shopPost',
                        'lineasCarrito.shopPost.regularPost',
                        'lineasCarrito.shopPost.regularPost.image',
                        'lineasCarrito.shopPost.post.user'
                    )
                    : null,
                'communities' => $communities ?? null,
            ],
            'userEdit' => $user ?? null,
            'socials' => Social::all(),
            'users' => User::all(),
            'newCommentId' => $newCommentId,
            'notifications' => $notifications,
            'unreadNotificationCount' => $unreadNotificationCount,
        ];
    }
}
