<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Para soft deletes
use Illuminate\Support\Facades\DB;

class Community extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'nombre',
        'descripcion',
        'visibilidad',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function members()
    // {
    //     return $this->belongsToMany(User::class);
    // }

    // public function getTotalMembers()
    // {
    //     return $this->members()->count();
    // }

    public function memberships()
    {
        return $this->hasMany(CommunityMembership::class);
    }

    public function getTotalMembers()
    {
        return $this->memberships()
            ->whereHas('communityRole', function ($query) {
                $query->where('name', '!=', 'pending');
            })
            ->count();
    }


 public function posts()
{
    return $this->belongsToMany(RegularPost::class)
        ->whereDoesntHave('shopPost');
}


    public function getTotalPosts()
    {
        return $this->posts()->count();
    }

    public function profileImage()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'profile');
    }

    public function backgroundImage()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'background');
    }

    protected static function booted()
{
    static::deleting(function ($community) {
        if (! $community->isForceDeleting()) {
            if ($community->profileImage) {
                $community->profileImage->delete();
            }
            if ($community->backgroundImage) {
                $community->backgroundImage->delete();
            }

            $community->posts()->detach();

            $community->memberships()->delete();

            DB::table('notifications')
                    ->where(function ($query) use ($community) {
                        $query->whereRaw("(data::json->>'community_id')::int = ?", [$community->id]);
                    })
                    ->delete();
        }
    });
}

}
