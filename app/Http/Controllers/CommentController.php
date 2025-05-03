<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            'commentable_type' => 'required|string|in:App\Models\Post,App\Models\Comment', // Solo post o comment
        ]);

                // Validación condicional del commentable_id según el tipo de comentario
        if ($request->commentable_type === Post::class) {
            // Si es un Post, aseguramos que commentable_id esté en la tabla posts
            $request->validate([
                'commentable_id' => 'exists:posts,id',
            ]);
        } elseif ($request->commentable_type === Comment::class) {
            // Si es un comentario, aseguramos que commentable_id esté en la tabla comments
            $request->validate([
                'commentable_id' => 'exists:comments,id',
            ]);
        }

        $user = User::findOrFail(Auth::id());

            // Crear el comentario
        $comment = new Comment([
            'contenido' => $request->contenido,
            'user_id' => $user->id,
        ]);

        // Asociar el comentario al modelo correspondiente (Post o Comentario)
        if ($request->commentable_type === Post::class) {

            $post = Post::findOrFail($request->commentable_id);
            $comment->commentable()->associate($post);

        } else if ($request->commentable_type === Comment::class) {

            $parentComment = Comment::findOrFail($request->commentable_id);
            $comment->commentable()->associate($parentComment);
        }

        // Guardar el comentario
        $comment->save();

            // Buscar menciones en el contenido
        preg_match_all('/@(\w+)/', $request->contenido, $matches);

        // Si hay menciones
        if (isset($matches[1])) {
            foreach ($matches[1] as $username) {
                // Buscar al usuario mencionado
                $user = User::where('name', $username)->first();
                if ($user) {
                    // Guardar la mención en la tabla pivote
                    $comment->mentionedUsers()->attach($user->id);
                }
            }
        }

        // Guardar el comentario
        $comment->save();



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
