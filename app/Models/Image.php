<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    /** @use HasFactory<\Database\Factories\ImageFactory> */
    use HasFactory;

    protected $fillable = [
        'path_original',
        'path_medium',
        'path_small',
        'imageable_id',
        'imageable_type',
        'type',
        'localizacion',
        'latitud',
        'longitud',
        'fecha_hora',
        'marca',
        'modelo',
        'exposicion',
        'diafragma',
        'iso',
        'flash',
        'longitud_focal',

    ];

    public function imageable()
    {
        return $this->morphTo();
    }
}
