<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedPost extends Model
{
    /** @use HasFactory<\Database\Factories\SharedPostFactory> */
    use HasFactory;

    protected $fillable = [
        'regular_post_id',
    ];

    public function regularPost()
    {
        return $this->belongsTo(RegularPost::class);
    }

    public function post(){
        return $this->morphOne(Post::class, 'posteable');
    }
}
