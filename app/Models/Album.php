<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Album extends Model
{
    /** @use HasFactory<\Database\Factories\AlbumFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'descripcion',
        'user_id',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function coverImage()
    {
        return $this->morphOne(Image::class, 'imageable')->where('type', 'cover');
    }

    public function posts(){
        return $this->belongsToMany(RegularPost::class);
    }

    protected static function booted()
{
    static::deleting(function ($album) {
        if (! $album->isForceDeleting()) {
            $album->posts()->detach();
        }

        // Verifica si el álbum tiene una imagen asociada
        if ($album->coverImage) {
            $image = $album->coverImage;

            // Asumiendo que `path_original` es el campo que almacena la ruta de la imagen original
            $paths = [
                ltrim(parse_url($image->path_original, PHP_URL_PATH), '/'),
                ltrim(parse_url($image->path_medium, PHP_URL_PATH), '/'),
            ];

            // Eliminar la imagen asociada al álbum desde S3
            Storage::disk('s3')->delete($paths);

            // Eliminar la imagen de la base de datos
            $image->delete();
        }
    });
}



}
