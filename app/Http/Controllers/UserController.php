<?php

namespace App\Http\Controllers;

use App\Models\RegularPost;
use App\Models\Shop;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'is_admin', 'created_at')->with('profileImage', 'backgroundImage')->orderBy('name')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
            'is_admin' => 'required|in:true,false',
        ]);

        // if($request->input('is_admin') == 'true') {
        //     $is_admin = true;
        // } else {
        //     $is_admin = false;
        // }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'is_admin' => $request->is_admin,
            'password' => Hash::make($request->password),
        ]);

        Shop::create([
            'user_id' => $user->id,
        ]);

        return Redirect::route('users.index');
    }


    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {

        return Inertia::render('Users/Show', [
            'user' => $user->load('profileImage', 'backgroundImage', 'shop', 'followers.profileImage', 'followers.backgroundImage', 'following.profileImage', 'following.backgroundImage', 'socials'),
            'totalFollowers' => $user->getTotalFollowers(),
            'totalFollowing' => $user->getTotalFollowing(),
            'posts' => $user->posts()->with('posteable.image','posteable.tags','posteable.communities', 'posteable', 'user', 'user.profileImage', 'user.backgroundImage', 'posteable.post', 'posteable.post.user', 'posteable.post.user.profileImage', 'posteable.post.user.backgroundImage', 'posteable.comments', 'posteable.comments.user', 'posteable.comments.user.profileImage', 'posteable.comments.user.backgroundImage', 'posteable.comments.replies', 'posteable.comments.replies.user', 'posteable.comments.replies.user.profileImage', 'posteable.comments.replies.user.backgroundImage')->orderBy('created_at', 'desc')
            ->get()->map(function ($post) {
            $post->getTotalLikes = $post->posteable->getTotalLikes();
            $post->isLikedByUser = $post->posteable->isLikedByUser();
            $post->getTotalShares = $post->posteable->getTotalShares();
            $post->isSharedByUser = $post->posteable->isSharedByUser();
            return $post;
        }),
        'tags' => Tag::all(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        if($user->is_admin) {
            $user->is_admin = false;
        } else {
            $user->is_admin = true;
        }
        $user->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
    }
}
