<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    /** @use HasFactory<\Database\Factories\TagFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];

    public function posts()
    {
        return $this->belongsToMany(RegularPost::class);
    }

    protected static function booted()
    {
        static::deleting(function ($tag) {
            $tag->posts()->detach();
        });
    }
}
