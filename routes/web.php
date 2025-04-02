<?php

use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/images/update', function (Request $request) {
    $request->validate([
        'user' => 'required|array',
        'user.id' => 'required|exists:users,id',
        'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Obtener el usuario desde la request
    $user = User::findOrFail($request->input('user.id'));

    // Subir imagen de perfil con el nombre basado en la ID del usuario
    if ($request->hasFile('profile_image')) {
        if ($user->profile_image) {
            Storage::delete($user->profile_image);
        }
        // $extension = $request->file('profile_image')->getClientOriginalExtension();
        $profilePath = "profile_images/{$user->id}.jpg";
        Storage::put($profilePath, file_get_contents($request->file('profile_image')));
        $user->profile_image = $profilePath;
        //prueba
    }

    // Subir imagen de portada con el nombre basado en la ID del usuario
    if ($request->hasFile('background_image')) {
        if ($user->background_image) {
            Storage::delete($user->background_image);
        }
        // $extension = $request->file('background_image')->getClientOriginalExtension();
        $backgroundPath = "background_images/{$user->id}.jpg";
        Storage::put($backgroundPath, file_get_contents($request->file('background_image')));
        $user->background_image = $backgroundPath;
    }

    $user->save();

    return redirect()->back()->with('message', 'Imágenes actualizadas exitosamente');
})->name('images.update');

require __DIR__.'/auth.php';
