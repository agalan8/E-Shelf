<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'biografia',
        'is_admin',
        'password',
        'profile_image',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function socials()
    {
        return $this->belongsToMany(Social::class)->withPivot('perfil');
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function albums()
    {
        return $this->hasMany(Album::class);
    }

    // Usuarios que este usuario sigue
    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'user_id', 'followed_user_id');
    }

    // Usuarios que siguen a este usuario
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'followed_user_id', 'user_id');
    }

    public function getTotalFollowers(){
        return $this->followers()->count();
    }

    public function getTotalFollowing(){
        return $this->following()->count();
    }

    public function mentionedComments()
    {
        return $this->belongsToMany(Comment::class, 'comment_mentions', 'user_id', 'comment_id');
    }

    public function likedPosts()
    {
        return $this->belongsToMany(Post::class, 'likes');
    }


    protected static function booted()
{
    static::deleting(function ($user) {
        if (! $user->isForceDeleting()) {

            $user->posts->each(function ($post) {
                $post->delete();
            });

            $user->albums->each(function ($album) {
                $album->delete();
            });

            $user->socials()->detach();
        }
    });
}







}
