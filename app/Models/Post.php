<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

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


}
