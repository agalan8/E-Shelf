<?php

namespace App\Http\Controllers;

use App\Models\User;
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
        // $request->user()->unreadNotifications->markAsRead();



        $user = User::findOrFail(Auth::user()->id);
        $count = $user->unreadNotifications->count();
        if ($count > 10){
            $count = 10;
        }
        for ($i = 0; $i < $count; $i++) {
            $id = $user->unreadNotifications[$i]->id;
            $notification = DatabaseNotification::find($id);
            $notification->update(['read_at' => now()]);
            $notification->save();
        }







// Asegúrate de que $id no sea null
        return back();
    }
}
