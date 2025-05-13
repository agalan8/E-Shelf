<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'titulo',
        'descripcion',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'post');
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

    protected static function booted()
{
    static::deleting(function ($post) {
        if (! $post->isForceDeleting()) {
            // Verifica si el post tiene una imagen asociada antes de intentar eliminarla
            if ($post->image) {
                $image = $post->image;

                $paths = [
                    ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                    ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
                ];

                // Elimina las imágenes asociadas al post desde S3
                Storage::disk('s3')->delete($paths);

                // Eliminar la imagen de la base de datos
                $image->delete();
            }

            // Desvincula los tags y álbumes del post
            $post->tags()->detach();
            $post->albums()->detach();
        }
    });
}



}
