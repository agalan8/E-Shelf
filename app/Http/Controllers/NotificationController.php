<?php

namespace App\Http\Controllers;

use App\Models\RegularPost;
use App\Models\User;
use App\Notifications\PostLiked;
use App\Notifications\PostShared;
use Illuminate\Container\Attributes\Database;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Notifications', [
            'notifications' => $request->user()->notifications,
            'unreadCount' => $request->user()->unreadNotifications->count(),
        ]);
    }

    public function markAllAsRead(Request $request)
    {
$request->user()->unreadNotifications()
    ->whereIn('type', [PostLiked::class, PostShared::class])
    ->update(['read_at' => now()]);

        return back();
    }

    public function loadMore(Request $request)
{
    $user = $request->user();

    $notifications = $user->unreadNotifications()
        ->orderBy('created_at', 'desc')
        ->skip($request->input('offset', 0))
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
                'post' => isset($notification->data['post_id'])
                    ? RegularPost::with('image', 'post.user.profileImage')->find($notification->data['post_id'])
                    : null,
            ];
        });

    return response()->json($notifications);
}

public function destroy($id)
{
    $notification = DatabaseNotification::findOrFail($id);
    $notification->delete();

    return redirect()->back();
}

}
