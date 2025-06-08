<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Models\RegularPost;
use App\Models\User;
use App\Notifications\MentionedInComment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommentController extends Controller
{

    /**
     * Display a listing of the resource.
     */



    public function index()
    {
        //
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
    public function store(StoreCommentRequest $request)
    {
        $request->validate([
            'contenido' => 'required|string|max:1000',
            'commentable_id' => 'required|integer',
            'commentable_type' => 'required|string|in:App\Models\RegularPost,App\Models\Comment',
        ]);

        if ($request->commentable_type === RegularPost::class) {
            $request->validate([
                'commentable_id' => 'exists:regular_posts,id',
            ]);
        } elseif ($request->commentable_type === Comment::class) {
            $request->validate([
                'commentable_id' => 'exists:comments,id',
            ]);
        }

        $user = User::findOrFail(Auth::id());

        $comment = new Comment([
            'contenido' => $request->contenido,
            'user_id' => $user->id,
        ]);

        if ($request->commentable_type === RegularPost::class) {

            $post = RegularPost::findOrFail($request->commentable_id);
            $comment->commentable()->associate($post);

        } else if ($request->commentable_type === Comment::class) {

            $parentComment = Comment::findOrFail($request->commentable_id);
            $post = RegularPost::findOrFail($parentComment->commentable_id);
            $comment->commentable()->associate($parentComment);
        }

        $comment->save();

        preg_match_all('/@(\w+)/', $request->contenido, $matches);

        if (isset($matches[1])) {
            foreach ($matches[1] as $username) {
                $user = User::where('name', $username)->first();
                if ($user) {
                    $comment->mentionedUsers()->attach($user->id);
                    $user->notify(new MentionedInComment($post, $comment->user));
                }
            }
        }

        $comment->save();

        session(['newCommentId' => $comment->id]);

        return back();

    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        //
    }
}
