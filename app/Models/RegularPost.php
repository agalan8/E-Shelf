<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function post()
    {
        return $this->morphOne(Post::class, 'posteable');
    }

    public function sharedPosts()
    {
        return $this->hasMany(SharedPost::class);
    }

    public function shopPost()
    {
        return $this->hasOne(ShopPost::class);
    }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'RegularPost');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function albums()
    {
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


    public function getTotalLikes()
    {
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

    public function communities()
    {
        return $this->belongsToMany(Community::class);
    }


    protected static function booted()
    {
        static::deleting(function ($RegularPost) {
            if (! $RegularPost->isForceDeleting()) {
                $RegularPost->sharedPosts()->delete();

                $RegularPost->shopPost?->lineasCarrito()->delete();

                $RegularPost->shopPost()?->delete();

                if ($RegularPost->image) {
                    $image = $RegularPost->image;

                    $paths = [
                        ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                        ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
                        ltrim(parse_url($image->path_small, PHP_URL_PATH), '/'),
                    ];

                    // Elimina las imágenes asociadas al RegularPost desde S3
                    Storage::disk('s3')->delete($paths);

                    // Eliminar la imagen de la base de datos
                    $image->delete();
                }

                // Eliminar la relación con el modelo Post
                $RegularPost->post()->delete();

                // Desvincular tags, comunidades y álbumes
                $RegularPost->tags()->detach();
                $RegularPost->communities()->detach();
                $RegularPost->albums()->detach();

                // $allRelatedNotifications = DatabaseNotification::where('type', 'App\Notifications\PostLiked')->get();

                // foreach ($allRelatedNotifications as $notification) {
                //     $data = $notification->data;

                //     if (isset($data['post']['id']) && $data['post']['id'] == $RegularPost->id) {
                //         $notification->delete();
                //     }
                // }

                DB::table('notifications')
                ->whereIn('type', ['App\Notifications\PostLiked', 'App\Notifications\PostShared'])
                ->whereRaw("(data::json->>'post_id')::int = ?", [$RegularPost->id])
                ->delete();



            }
        });
    }
}
