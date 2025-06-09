<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderLine extends Model
{
    /** @use HasFactory<\Database\Factories\OrderLineFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'order_id',
        'shop_post_id',
        'titulo',
        'path_small',
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
