<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

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

    public function profileImage()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'profile');
    }


    public function backgroundImage()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'background');
    }

    public function socials()
    {
        return $this->belongsToMany(Social::class)->withPivot('perfil');
    }

    public function posts()
    {
        return $this->hasMany(Post::class)->where('posteable_type', RegularPost::class);

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
        return $this->belongsToMany(RegularPost::class, 'likes');
    }

    public function ownedCommunnities()
    {
        return $this->hasMany(Community::class);
    }

    public function communities()
    {
        return $this->belongsToMany(Community::class);
    }

    protected static function booted()
    {
        static::deleting(function ($user) {
            if (! $user->isForceDeleting()) {
                // Eliminar imágenes asociadas al perfil
                if ($user->profileImage) {
                    $user->profileImage->delete(); // Eliminar imagen del perfil
                }

                if ($user->backgroundImage) {
                    $user->backgroundImage->delete(); // Eliminar imagen de fondo
                }

                // Eliminar publicaciones
                $user->posts->each(function ($post) {
                    if ($post->image) {
                        $post->image->each(function ($image) {
                            // Asegúrate de eliminar cada imagen asociada a la publicación desde el disco S3
                            $paths = [
                                ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                                ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
                            ];
                            Storage::disk('s3')->delete($paths);
                            $image->delete();
                        });
                    }
                    $post->delete();
                });

                // Eliminar álbumes
                $user->albums->each(function ($album) {
                    if ($album->coverImage) {
                        // Eliminar imagen de portada del álbum desde S3
                        $image = $album->coverImage;
                        $paths = [
                            ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                            ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
                        ];
                        Storage::disk('s3')->delete($paths);
                        $image->delete();
                    }
                    $album->delete();
                });

                // Desvincular redes sociales
                $user->socials()->detach();
            }
        });
    }








}
