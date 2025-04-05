<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    /** @use HasFactory<\Database\Factories\AlbumFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'portada',
        'user_id',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function posts(){
        return $this->belongsToMany(Post::class);
    }


}
