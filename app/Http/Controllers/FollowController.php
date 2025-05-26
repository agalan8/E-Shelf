<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\UserFollowed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// app/Http/Controllers/FollowController.php
class FollowController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['followed_user_id' => 'required|exists:users,id']);

        $user = User::findOrFail(Auth::id());

        if ($user->id === $request->followed_user_id) {
            abort(400, "No puedes seguirte a ti mismo.");
        }

        $user->following()->syncWithoutDetaching([$request->followed_user_id]);

        $userToFollow = User::findOrFail($request->followed_user_id);
        $userToFollow->notify(new UserFollowed($user));

        return back();
    }

    public function destroy($id)
    {
        $user = User::findOrFail(Auth::id());
        $user->following()->detach($id);

        return back();
    }
}
