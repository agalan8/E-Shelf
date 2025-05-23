<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineaCarrito extends Model
{
    /** @use HasFactory<\Database\Factories\LineaCarritoFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_post_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shopPost()
    {
        return $this->belongsTo(ShopPost::class);
    }
}
