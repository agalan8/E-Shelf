<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\Album;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {

    $openAuthModal = false;

    $openAuthModal = Session::get('openAuthModal');

    Session::forget('openAuthModal');

    if(Auth::check()){
        return Inertia::render('Explorar', [
            'posts' => Post::with('photo', 'tags', 'user', 'comments', 'comments.user')->inRandomOrder()->get(),
        ]);
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
        'phpVersion' => PHP_VERSION,
        'openAuthModal' => $openAuthModal
    ]);
});

Route::get('/explorar', function () {


    // $user = User::findOrFail(Auth::id());
    // dd(Post::with('photo', 'tags', 'user', 'comments')->inRandomOrder()->get());

    return Inertia::render('Explorar', [
        'posts' => Post::with('photo', 'tags', 'user', 'comments', 'comments.user', 'comments.replies', 'comments.replies.user')->inRandomOrder()->get()->map(function ($post) {
            $post->getTotalLikes = $post->getTotalLikes();
            $post->isLikedByUser = Auth::check() ? $post->isLikedByUser() : false; // Verificar si el usuario ha dado like
            return $post;
        }),
        'tags' => Tag::all(),
    ]);
})->name('explorar');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('posts', PostController::class)->middleware('auth');
Route::resource('albums', AlbumController::class)->middleware('auth');
Route::resource('users', UserController::class)->middleware(AdminMiddleware::class)->except('show');
Route::resource('users', UserController::class)->only('show');
Route::resource('tags', TagController::class)->middleware(AdminMiddleware::class);
Route::resource('socials', SocialController::class)->middleware(AdminMiddleware::class);
Route::middleware(['auth'])->group(function () {
    Route::post('/follow', [FollowController::class, 'store'])->name('follow');
    Route::delete('/unfollow/{id}', [FollowController::class, 'destroy'])->name('unfollow');
});
Route::resource('comments', CommentController::class)->middleware('auth');
// Ruta para obtener las respuestas de un comentario
Route::get('comments/{comment}/replies', [CommentController::class, 'loadReplies'])->middleware('auth');



Route::get('/mis-posts', function () {

    $userId = Auth::user()->id;
    $user = User::findOrFail($userId);

    // dd($user->posts()->with('photo', 'tags', 'user', 'comments')->get());
    return Inertia::render('Posts/MisPosts', [


        'posts' => $user->posts()->with('photo', 'tags', 'user', 'comments', 'comments.user', 'comments.replies', 'comments.replies.user')->get()->map(function ($post) {
            $post->getTotalLikes = $post->getTotalLikes();
            $post->isLikedByUser = $post->isLikedByUser();
            return $post;
        }),
        'tags' => Tag::all(),
    ]);
})->middleware('auth')->name('mis-posts');

Route::get('/posts-seguidos', function () {
    $user = User::findOrFail(Auth::id());

    // Obtener IDs de usuarios seguidos
    $followingIds = $user->following()->pluck('followed_user_id');

    // Obtener posts de esos usuarios, ordenados por los más recientes
    $posts = Post::with('photo', 'tags', 'user', 'comments', 'comments.user', 'comments.replies', 'comments.replies.user')
        ->whereIn('user_id', $followingIds)
        ->orderBy('created_at', 'desc')
        ->get()->map(function ($post) {
            $post->getTotalLikes = $post->getTotalLikes();
            $post->isLikedByUser = $post->isLikedByUser();
            return $post;
        });

    return Inertia::render('Posts/PostsSeguidos', [
        'posts' => $posts,
        'tags' => Tag::all(),
    ]);
})->middleware('auth')->name('posts-seguidos');

Route::get('/mis-albums', function () {

    $userId = Auth::user()->id;
    $user = User::findOrFail($userId);

    return Inertia::render('Albums/MisAlbums', [
        'albums' => $user->albums()->with('posts', 'user', 'posts.photo')->orderBy('created_at', 'desc')->get(),
        'posts' => $user->posts()->with('photo', 'tags', 'user')->get(),
    ]);
})->middleware('auth')->name('mis-albums');

Route::post('albums/{album}/posts', function (Request $request, Album $album) {

    // Obtener los IDs de los posts seleccionados
    $postIds = $request->input('posts', []);

    // Verificar que el álbum existe
    $album = Album::findOrFail($album->id);

    // Añadir la relación entre el álbum y los posts seleccionados, sin duplicar
    foreach ($postIds as $postId) {
        // Verificar si el post ya está relacionado con el álbum
        $album->posts()->syncWithoutDetaching([$postId]);
    }

    // Devolver una respuesta con un mensaje de éxito
    return redirect()->route('albums.show', $album->id);
})->name('albums.posts.store')->middleware('auth');

Route::delete('albums/{album}/posts/{post}', function (Album $album, Post $post) {
    // Verificar que el álbum existe
    $album = Album::findOrFail($album->id);

    // Eliminar la relación entre el álbum y el post
    $album->posts()->detach($post->id);

    // Devolver una respuesta con un mensaje de éxito
    return redirect()->route('albums.show', $album->id);
})->name('albums.posts.destroy')->middleware('auth');

Route::post('/images/update', function (Request $request) {
    $request->validate([
        'user' => 'required|array',
        'user.id' => 'required|exists:users,id',
        'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $user = User::findOrFail($request->input('user.id'));

    // Subir imagen de perfil
    if ($request->hasFile('profile_image')) {

        if ($user->profile_image) {
            $path = parse_url($user->profile_image, PHP_URL_PATH); // /public/profile_images/123.jpg
            $path = ltrim($path, '/'); // public/profile_images/123.jpg

            // Eliminar del bucket S3
            Storage::disk('s3')->delete($path);
        }

        $path = $request->file('profile_image')->storePublicly('public/users/profile_images');
        $user->profile_image = "{$path}";
    }

    // Subir imagen de portada
    if ($request->hasFile('background_image')) {
        if ($user->background_image) {
            $path = parse_url($user->backgroun_image, PHP_URL_PATH); // /public/profile_images/123.jpg
            $path = ltrim($path, '/'); // public/profile_images/123.jpg

            // Eliminar del bucket S3
            Storage::disk('s3')->delete($path);
        }

        $path = $request->file('background_image')->storePublicly('public/users/background_images');
        $user->background_image = "{$path}";
    }

    $user->save();

    return redirect()->back()->with('message', 'Imágenes actualizadas exitosamente');
})->name('images.update');


Route::delete('/images/destroy/{user}/{imageType}', function (User $user, $imageType) {
    // Verificar el tipo de imagen a eliminar (profile_image o background_image)
    if ($imageType === 'profile_image' && $user->profile_image) {

        $path = parse_url($user->profile_image, PHP_URL_PATH); // /public/profile_images/123.jpg
        $path = ltrim($path, '/'); // public/profile_images/123.jpg

        // Eliminar del bucket S3
        Storage::disk('s3')->delete($path);
        $user->profile_image = null;
    }

    if ($imageType === 'background_image' && $user->background_image) {

        $path = parse_url($user->background_image, PHP_URL_PATH); // /public/profile_images/123.jpg
        $path = ltrim($path, '/'); // public/profile_images/123.jpg

        // Eliminar del bucket S3
        Storage::disk('s3')->delete($path);

        $user->background_image = null;
    }

    // Guardar los cambios en el usuario (vaciar la ruta de la imagen)
    $user->save();

    // Redirigir con un mensaje de éxito
    return redirect()->back()->with('message', 'La imagen ha sido eliminada correctamente');
})->name('images.destroy');


Route::post('/like', function (Request $request) {

    $user = User::findOrFail(Auth::id());
    $post = Post::findOrFail($request->post_id);

    if ($post->isLikedByUser()) {
        $post->likedBy()->detach($user->id);
    } else {
        $post->likedBy()->attach($user->id);
    }

    return back();
})->name('like')->middleware('auth');


Route::get('/buscar', function (Request $request) {
    $query = $request->query('q');
    $filter = $request->query('filter');


    if ($filter === 'Usuarios') {
        $results = User::where('name', 'like', "%{$query}%")->get();
    } else {
        $results = [];
    }

    return inertia('BusquedaResultados', [
        'results' => $results,
        'filter' => $filter,
    ]);
})->name('buscar');

require __DIR__.'/auth.php';
