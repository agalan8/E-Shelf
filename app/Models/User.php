<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;


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
        return $this->hasMany(Post::class)
            ->where('posteable_type', RegularPost::class)
            ->whereHasMorph('posteable', [RegularPost::class], function ($query) {
                $query->doesntHave('shopPost');
            });
    }


    public function albums()
    {
        return $this->hasMany(Album::class);
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'user_id', 'followed_user_id');
    }

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

    // public function ownedCommunities()
    // {
    //     return $this->hasMany(Community::class);
    // }

    // public function communities()
    // {
    //     return $this->belongsToMany(Community::class);
    // }

    public function ownedCommunities()
    {
        return $this->hasMany(Community::class);
    }

    public function communities(){
            return $this->communityMemberships()
            ->whereHas('communityRole', function ($query) {
                $query->where('name', '!=', 'pending');
            })
            ->with('community')
            ->get()
            ->pluck('community');
    }

    public function communityMemberships()
    {
        return $this->hasMany(CommunityMembership::class);
    }

    public function shop(){
        return $this->hasOne(Shop::class);
    }

    public function lineasCarrito()
    {
        return $this->hasMany(LineaCarrito::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    protected static function booted()
    {
        static::deleting(function ($user) {
            if (! $user->isForceDeleting()) {
                $user->profileImage?->delete();
                $user->backgroundImage?->delete();

                \App\Models\Image::where('imageable_id', $user->id)
                    ->where('imageable_type', self::class)
                    ->get()
                    ->each(function ($image) {
                        // $paths = [
                        //     ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                        //     ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
                        //     ltrim(parse_url($image->path_small, PHP_URL_PATH), '/'),
                        // ];
                        // Storage::disk('s3')->delete($paths);
                        $image->delete();
                    });

                $user->hasMany(\App\Models\Post::class)->with('posteable')->get()->each(function ($post) {
                    if ($post->posteable) {
                        $post->posteable->delete();
                    }
                    $post->delete();
                });

                $user->albums->each(function ($album) {
                    if ($album->coverImage) {
                        $image = $album->coverImage;
                        // $paths = [
                        //     ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                        //     ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
                        // ];
                        // Storage::disk('s3')->delete($paths);
                        $image->delete();
                    }
                    $album->delete();
                });

                $user->socials()->detach();

                $user->ownedCommunities()->each(function ($community) {
                    $community->delete();
                });

                $user->communityMemberships()->delete();

                if ($user->shop) {
                    $user->shop->delete();
                }

                $user->lineasCarrito()->delete();

                $user->orders()->delete();

                DB::table('notifications')
                    ->where(function ($query) use ($user) {
                        $query->whereRaw("(data::json->>'liker_id')::int = ?", [$user->id])
                            ->orWhereRaw("(data::json->>'sharer_id')::int = ?", [$user->id])
                            ->orWhereRaw("(data::json->>'follower_id')::int = ?", [$user->id])
                            ->orWhereRaw("(data::json->>'mentioner_id')::int = ?", [$user->id])
                            ->orWhereRaw("(data::json->>'requester_id')::int = ?", [$user->id]);
                    })
                    ->delete();
            }
        });
    }








}
