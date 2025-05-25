<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderLine extends Model
{
    /** @use HasFactory<\Database\Factories\OrderLineFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'shop_post_id',
        'titulo',
        'path_image',
        'precio',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function shopPost()
    {
        return $this->belongsTo(ShopPost::class);
    }
}
