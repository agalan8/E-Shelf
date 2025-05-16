<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegularPostController;
use App\Http\Controllers\SharedPostController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\Album;
use App\Models\Image;
use App\Models\Post;
use App\Models\RegularPost;
use App\Models\SharedPost;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image as ImageIntervention;


Route::get('/', function () {

    $openAuthModal = false;

    $openAuthModal = Session::get('openAuthModal');

    Session::forget('openAuthModal');

    if(Auth::check()){
        return Inertia::render('Explorar', [
            'posts' => RegularPost::with('image', 'post', 'post.user', 'tags', 'post.user.profileImage', 'post.user.backgroundImage', 'comments', 'comments.user', 'comments.user.profileImage', 'comments.user.backgroundImage', 'comments.replies', 'comments.replies.user', 'comments.replies.user.profileImage', 'comments.replies.user.backgroundImage')->orderBy('created_at', 'desc')->get(),
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


    return Inertia::render('Explorar', [
        'posts' => RegularPost::with('image', 'tags','post', 'post.user', 'post.user.profileImage', 'post.user.backgroundImage', 'comments', 'comments.user', 'comments.user.profileImage', 'comments.user.backgroundImage', 'comments.replies', 'comments.replies.user', 'comments.replies.user.profileImage', 'comments.replies.user.backgroundImage')->orderBy('created_at', 'desc')->get()->map(function ($post) {
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

Route::delete('/shared-posts/by-regular', function (Request $request) {
    $request->validate([
        'regular_post_id' => 'required|exists:regular_posts,id',
    ]);

    $sharedPost = SharedPost::where('regular_post_id', $request->input('regular_post_id'))
        ->whereHas('post', function ($query) {
            $query->where('user_id', Auth::id());
        })
        ->first();

    if (!$sharedPost) {
        return response()->json(['message' => 'No shared post found.'], 404);
    }

    $sharedPost->post()->delete();
    $sharedPost->delete();

})->middleware('auth')->name('shared-posts.destroyByPostId');

// Route::resource('posts', PostController::class)->middleware('auth');
Route::resource('regular-posts', RegularPostController::class)->middleware('auth');
Route::resource('shared-posts', SharedPostController::class)->middleware('auth');
Route::resource('albums', AlbumController::class)->middleware('auth');
Route::delete('/albums/{album}/eliminar-portada', [AlbumController::class, 'eliminarPortada'])
    ->name('albums.eliminar-portada');
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



// Route::get('/mis-posts', function () {

//     $userId = Auth::user()->id;
//     $user = User::findOrFail($userId);

//     return Inertia::render('Posts/MisPosts', [


//         'posts' => $user->posts()->with('image', 'tags', 'user', 'user.profileImage', 'user.backgroundImage', 'comments', 'comments.user', 'comments.user.profileImage', 'comments.user.backgroundImage', 'comments.replies', 'comments.replies.user', 'comments.replies.user.profileImage', 'comments.replies.user.backgroundImage')->orderBy('created_at', 'desc')
//         ->get()->map(function ($post) {
//             $post->getTotalLikes = $post->getTotalLikes();
//             $post->isLikedByUser = $post->isLikedByUser();
//             return $post;
//         }),
//         'tags' => Tag::all(),
//     ]);
// })->middleware('auth')->name('mis-posts');

Route::get('/posts-seguidos', function () {

    $user = User::findOrFail(Auth::id());

    // IDs de usuarios seguidos + el propio
    $userIds = $user->following()->pluck('followed_user_id')->push($user->id);

    // RegularPosts de usuarios seguidos o propios
    $regularPosts = RegularPost::whereHas('post', function ($query) use ($userIds) {
            $query->whereIn('user_id', $userIds);
        })
        ->with([
            'image',
            'post.user.profileImage',
            'post.user.backgroundImage',
            'tags',
            'comments.user.profileImage',
            'comments.user.backgroundImage',
            'comments.replies.user.profileImage',
            'comments.replies.user.backgroundImage',
            'likedBy'
        ])
        ->get();

    // SharedPosts de usuarios seguidos o propios
    $sharedPosts = SharedPost::whereHas('post', function ($query) use ($userIds) {
            $query->whereIn('user_id', $userIds);
        })
        ->with([
            'regularPost.image',
            'regularPost.post.user.profileImage',
            'regularPost.post.user.backgroundImage',
            'regularPost.tags',
            'regularPost.comments.user.profileImage',
            'regularPost.comments.user.backgroundImage',
            'regularPost.comments.replies.user.profileImage',
            'regularPost.comments.replies.user.backgroundImage',
            'regularPost.likedBy',
            'post.user.profileImage', // quien hizo el share
        ])
        ->get();

    // Mapear ambos tipos al mismo formato base
    $allPosts = collect();

    foreach ($regularPosts as $post) {
        $post->getTotalLikes = $post->getTotalLikes();
        $post->isLikedByUser = $post->isLikedByUser();
        $post->isSharedByUser = $post->isSharedByUser();
        $post->getTotalShares = $post->getTotalShares();
        $post->post_type = 'regular';
        $post->shared_by = null; // No aplica
        $allPosts->push($post);
    }

    foreach ($sharedPosts as $sharedPost) {
        $original = $sharedPost->regularPost;
        $original->getTotalLikes = $original->getTotalLikes();
        $original->isLikedByUser = $original->isLikedByUser();
        $original->isSharedByUser = $original->isSharedByUser();
        $original->getTotalShares = $original->getTotalShares();
        $original->post_type = 'shared';
        $original->shared_by = $sharedPost->post->user; // quien lo compartió
        $original->shared_at = $sharedPost->post->created_at;
        $allPosts->push($original);
    }

    // Ordenar todos los posts por fecha de creación (propia o compartida)
    $sortedPosts = $allPosts->sortByDesc(function ($post) {
        return $post->shared_at ?? $post->post->created_at;
    })->values();

    return Inertia::render('Posts/PostsSeguidos', [
        'posts' => $sortedPosts,
        'tags' => Tag::all(),
    ]);
})->middleware('auth')->name('posts-seguidos');



Route::get('/mis-albums', function () {

    $userId = Auth::user()->id;
    $user = User::findOrFail($userId);

    return Inertia::render('Albums/MisAlbums', [
        'user' => $user,
        'albums' => $user->albums()->with('posts', 'user', 'user.profileImage', 'user.backgroundImage', 'coverImage', 'posts.image')->orderBy('created_at', 'desc')->get(),
        'posts' => $user->posts()->with('posteable','posteable.image', 'posteable.tags', 'user')->get(),
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

        $imagen = $request->file('profile_image');
        $extension = $imagen->getClientOriginalExtension();
        $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
        $path_original = "public/users/{$user->id}/profile_image/original/{$user->id}.{$extension}";
        $path_medium = "public/users/{$user->id}/profile_image/medium/{$user->id}.{$extension}";
        $path_small = "public/users/{$user->id}/profile_image/small/{$user->id}.{$extension}";

        if($user->profileImage){
            $paths = [
                ltrim(parse_url($user->profileImage->path_small, PHP_URL_PATH), '/'),
            ];

            Storage::disk('s3')->delete($paths);

            $user->profileImage()->delete();
        }


        $smallImage = ImageIntervention::read($imagen)->scale( height: 350)->encode();

        Storage::disk('s3')->put($path_small, $smallImage, 'public');

        if($user->profileImage){
            // Actualizamos la foto asociada al post
            $user->profileImage()->update([
                'path_small' => $path_aws . $path_small,
            ]);
        } else {

            $image = new Image([
                'path_small' => $path_aws . $path_small,
                'type' => 'profile',

            ]);

            $image->imageable()->associate($user)->save();

        }

    }

    if ($request->hasFile('background_image')) {

        $imagen = $request->file('background_image');
        $extension = $imagen->getClientOriginalExtension();
        $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
        $path_original = "public/users/{$user->id}/background_image/original/{$user->id}.{$extension}";
        $path_medium = "public/users/{$user->id}/background_image/medium/{$user->id}.{$extension}";
        $path_small = "public/users/{$user->id}/background_image/small/{$user->id}.{$extension}";

        if($user->backgroundImage){
            $paths = [
                ltrim(parse_url($user->backgroundImage->path_original, PHP_URL_PATH), '/'),
                ltrim(parse_url($user->backgroundImage->path_medium, PHP_URL_PATH), '/'),
            ];

            Storage::disk('s3')->delete($paths);

            $user->backgroundImage()->delete();
        }


        $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
        $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();

        Storage::disk('s3')->put($path_original, $imagen, 'public');
        Storage::disk('s3')->put($path_medium, $mediumImage, 'public');

        if($user->backgrounImage){
            // Actualizamos la foto asociada al post
            $user->backgroundImage()->update([
                'path_original' => $path_aws . $path_original,
                'path_medium' => $path_aws . $path_medium,

            ]);
        } else {

            $image = new Image([
                'path_original' => $path_aws . $path_original,
                'path_medium' => $path_aws . $path_medium,
                'type' => 'background',

            ]);

            $image->imageable()->associate($user)->save();

        }

    }

    $user->save();

    return redirect()->back()->with('message', 'Imágenes actualizadas exitosamente');
})->name('images.update');


Route::delete('/images/destroy/{user}/{imageType}', function (User $user, $imageType) {


    // Verificar el tipo de imagen a eliminar (profile_image o background_image)
    if ($imageType === 'profile_image' && $user->profileImage) {

        $path = parse_url($user->profileImage->path_small, PHP_URL_PATH); // /public/profile_images/123.jpg
        $path = ltrim($path, '/'); // public/profile_images/123.jpg

        // Eliminar del bucket S3
        Storage::disk('s3')->delete($path);
        $user->profileImage->delete();
    }

    if ($imageType === 'background_image' && $user->backgroundImage) {

        $paths = [
            ltrim(parse_url($user->backgroundImage->path_original, PHP_URL_PATH), '/'),
            ltrim(parse_url($user->backgroundImage->path_medium, PHP_URL_PATH), '/'),
        ];

        // Eliminar del bucket S3
        Storage::disk('s3')->delete($paths);

        $user->backgroundImage()->delete();
    }

    // Guardar los cambios en el usuario (vaciar la ruta de la imagen)
    $user->save();

    // Redirigir con un mensaje de éxito
    return redirect()->back()->with('message', 'La imagen ha sido eliminada correctamente');
})->name('images.destroy');


Route::post('/like', function (Request $request) {

    $user = User::findOrFail(Auth::id());
    $post = RegularPost::findOrFail($request->post_id);

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
        $results = User::where('name', 'like', "%{$query}%")->with('profileImage', 'backgroundImage')->get();
    } else {
        $results = [];
    }

    return inertia('BusquedaResultados', [
        'results' => $results,
        'filter' => $filter,
    ]);
})->name('buscar');

require __DIR__.'/auth.php';
