<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Social extends Model
{
    /** @use HasFactory<\Database\Factories\SocialFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre',
        'perfil',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
