<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityRole extends Model
{
    /** @use HasFactory<\Database\Factories\CommunityRoleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'label',
    ];

    public function communityMemberships()
    {
        return $this->hasMany(CommunityMembership::class);
    }
}
