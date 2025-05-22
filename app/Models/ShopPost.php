<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopPost extends Model
{
    /** @use HasFactory<\Database\Factories\ShopPostFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'shop_id',
        'regular_post_id',
        'precio',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function regularPost()
    {
        return $this->belongsTo(RegularPost::class);
    }
}
