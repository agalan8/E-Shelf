<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\post;

class RegularPost extends Model
{
    /** @use HasFactory<\Database\Factories\RegularPostFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'titulo',
        'descripcion',
    ];

    public function post(){
        return $this->morphOne(Post::class, 'posteable');
    }

    public function sharedPosts()
    {
        return $this->hasMany(SharedPost::class);
    }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'RegularPost');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function albums(){
        return $this->belongsToMany(Album::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function likedBy()
    {
        return $this->belongsToMany(User::class, 'likes');
    }

    public function isLikedByUser()
    {
        $user = User::findOrFail(Auth::id());
        return $this->likedBy()->where('user_id', $user->id)->exists();
    }


    public function getTotalLikes(){
        return $this->likedBy()->count();
    }

public function isSharedByUser()
{
    $user = Auth::user();

    if (!$user) {
        return false;
    }

    return $this->sharedPosts()
        ->whereHas('post', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->exists();
}


public function getTotalShares()
{
    return $this->sharedPosts()->count();
}


protected static function booted()
{
    static::deleting(function ($RegularPost) {
        if (! $RegularPost->isForceDeleting()) {
            // 🔁 Eliminar todos los SharedPosts relacionados
            $RegularPost->sharedPosts()->delete();

            // Eliminar imagen asociada si existe
            if ($RegularPost->image) {
                $image = $RegularPost->image;

                $paths = [
                    ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                    ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
                ];

                // Elimina las imágenes asociadas al RegularPost desde S3
                Storage::disk('s3')->delete($paths);

                // Eliminar la imagen de la base de datos
                $image->delete();
            }

            // Eliminar la relación con el modelo Post
            $RegularPost->post()->delete();

            // Desvincular tags y álbumes
            $RegularPost->tags()->detach();
            $RegularPost->albums()->detach();
        }
    });
}




}
