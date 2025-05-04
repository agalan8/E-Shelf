<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

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

    public function photo(){
        return $this->hasOne(Photo::class);
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

                $post->photo->each(function ($photo) {
                    $photo->delete();
                });

                $post->tags()->detach();
                $post->albums()->detach();
            }
        });
    }


}
