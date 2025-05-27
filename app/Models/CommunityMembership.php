<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityMembership extends Model
{
    /** @use HasFactory<\Database\Factories\CommunityMembershipFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'community_id',
        'community_role_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function communityRole()
    {
        return $this->belongsTo(CommunityRole::class);
    }
}
