<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LineaCarritoController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderLineController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegularPostController;
use App\Http\Controllers\SharedPostController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ShopPostController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\Album;
use App\Models\Community;
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
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Notifications\PostLiked;

Route::get('/', function () {

    $openAuthModal = false;

    $openAuthModal = Session::get('openAuthModal');

    Session::forget('openAuthModal');

    if(Auth::check()){
        return Inertia::render('Explorar', [
    'posts' => RegularPost::with(
        'image',
        'post',
        'post.user',
        'tags',
        'communities',
        'post.user.profileImage',
        'post.user.backgroundImage',
        'comments',
        'comments.user',
        'comments.user.profileImage',
        'comments.user.backgroundImage',
        'comments.replies',
        'comments.replies.user',
        'comments.replies.user.profileImage',
        'comments.replies.user.backgroundImage'
    )
    ->doesntHave('shopPost') // Aquí se filtran los que NO tienen shopPost relacionado
    ->orderBy('created_at', 'desc')
    ->get(),
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
        'posts' => RegularPost::with('image', 'tags', 'communities','post', 'post.user', 'post.user.profileImage', 'post.user.backgroundImage', 'comments', 'comments.user', 'comments.user.profileImage', 'comments.user.backgroundImage', 'comments.replies', 'comments.replies.user', 'comments.replies.user.profileImage', 'comments.replies.user.backgroundImage')->doesntHave('shopPost')->orderBy('created_at', 'desc')->get()->map(function ($post) {
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

Route::delete('albums/posts', function (Request $request) {

    $request->validate([
        'album_id' => 'required|exists:albums,id',
        'regular_post_id' => 'required|exists:regular_posts,id',
    ]);

    $album = Album::findOrFail($request->album_id);
    $regularPost = RegularPost::findOrFail($request->regular_post_id);


    // Eliminar el post (esto ejecuta el "booted" y elimina lo relacionado)

    // Eliminar la relación entre album y post (por si queda)
    $album->posts()->detach($regularPost->id);

    return back();
})->middleware('auth')->name('albums.posts.destroy');

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
        return back();
    }

    $sharedPost->post()->delete();
    $sharedPost->delete();

    return back();

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
Route::resource('communities', CommunityController::class)->middleware('auth');
Route::delete('/communities/{community}/images/{imageType}', [CommunityController::class, 'destroyImage'])
->name('communities.images.destroy');
Route::post('/communities/{community}/join', [CommunityController::class, 'join'])->name('communities.join');
Route::post('/communities/{community}/leave', [CommunityController::class, 'leave'])->name('communities.leave');
Route::resource('shops', ShopController::class)->middleware('auth');
Route::resource('shop-posts', ShopPostController::class)->middleware('auth');
Route::resource('orders', OrderController::class)->middleware('auth');
Route::middleware(['auth'])->group(function () {
    Route::get('/order-lines/{orderLineId}/download-image', [OrderLineController::class, 'downloadImage'])
        ->name('order-lines.download-image');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read', [NotificationController::class, 'markAllAsRead'])->name('notifications.read');
});







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
    ->doesntHave('shopPost') // Excluir los que tienen relación con ShopPost
    ->with([
        'image',
        'post.user.profileImage',
        'post.user.backgroundImage',
        'tags',
        'communities',
        'comments.user.profileImage',
        'comments.user.backgroundImage',
        'comments.replies.user.profileImage',
        'comments.replies.user.backgroundImage',
        'likedBy'
    ])
    ->get();


$sharedPosts = SharedPost::whereHas('post', function ($query) use ($userIds) {
        $query->whereIn('user_id', $userIds);
    })
    ->whereHas('regularPost') // Asegurarse de que tiene un RegularPost
    ->whereDoesntHave('regularPost.shopPost') // Excluir si su RegularPost tiene ShopPost
    ->with([
        'regularPost.image',
        'regularPost.post.user.profileImage',
        'regularPost.post.user.backgroundImage',
        'regularPost.tags',
        'regularPost.communities',
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
        'posts' => $user->posts()->with('posteable','posteable.image', 'posteable.tags', 'posteable.communities', 'user')->get(),
    ]);
})->middleware('auth')->name('mis-albums');

Route::get('mis-comunidades', function(){

    $userId = Auth::user()->id;
    $user = User::findOrFail($userId);

    return Inertia::render('Communities/MisComunidades', [
        'user' => $user,
        'communities' => $user->communities()
            ->with('user', 'profileImage', 'backgroundImage', 'members')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($community) {
                $community->getTotalMembers = $community->getTotalMembers(); // Asumiendo que estos son métodos personalizados
                $community->getTotalPosts = $community->getTotalPosts();
                return $community;
    }),

    ]);


})->middleware('auth')->name('mis-comunidades');

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

        if($user->backgroundImage){
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
        // Notificar al usuario que ha dado like, enviando el post ya cargado con relaciones
        $post->post->user->notify(new PostLiked($post, $user));
    }

    return back();
})->name('like')->middleware('auth');

Route::get('/buscar', function (Request $request) {
    $query = $request->query('q');
    $filter = $request->query('filter');


    if ($filter === 'Usuarios') {
        $results = User::where('name', 'ilike', "%{$query}%")
            ->with('profileImage', 'backgroundImage')
            ->get();
    } elseif ($filter === 'Publicaciones') {
        $posts = RegularPost::where('titulo', 'ilike', "%{$query}%")
    ->doesntHave('shopPost') // Excluir los que tienen relación con ShopPost
    ->with([
        'post.user.profileImage',
        'tags',
        'image',
        'communities',
        'comments',
        'comments.user',
        'comments.replies',
        'comments.replies.user'
    ])
    ->get();


        // Añadir propiedades calculadas a cada post
        $results = $posts->map(function ($post) {
            $post->getTotalLikes = $post->getTotalLikes();
            $post->isLikedByUser = $post->isLikedByUser();
            $post->isSharedByUser = $post->isSharedByUser();
            $post->getTotalShares = $post->getTotalShares();
            $post->post_type = 'regular';
            return $post;
        });
    } elseif ($filter === 'Comunidades'){

        $comunidades = Community::where('nombre', 'ilike', "%{$query}%")
            ->with('profileImage', 'backgroundImage', 'members')
            ->get();

        $results = $comunidades->map(function ($community) {
            $community->getTotalMembers = $community->getTotalMembers();
            $community->getTotalPosts = $community->getTotalPosts();
            return $community;
        });
    }
    else {
        $results = collect();
    }

    return inertia('BusquedaResultados', [
        'results' => $results,
        'filter' => $filter,
    ]);
})->name('buscar');

Route::middleware(['auth'])->group(function () {
    Route::get('/carrito', [LineaCarritoController::class, 'index'])->name('linea-carrito.index');

    Route::post('/carrito/add', [LineaCarritoController::class, 'add'])->name('linea-carrito.add');

    Route::post('/carrito/remove', [LineaCarritoController::class, 'remove'])->name('linea-carrito.remove');
});

Route::middleware(['auth'])->group(function () {
    Route::match(['get', 'post'], 'payment/create-checkout-session', [PaymentController::class, 'createCheckoutSession'])->name('payment.createCheckoutSession');
    Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');
});

require __DIR__.'/auth.php';
