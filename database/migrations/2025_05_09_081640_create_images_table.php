<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('images', function (Blueprint $table) {
        $table->id();
        $table->string('path_original')->nullable();
        $table->string('path_medium')->nullable();
        $table->string('path_small')->nullable();
        $table->morphs('imageable');
        $table->string('type');
        $table->string('localizacion')->nullable();
        $table->decimal('latitud', 10, 7)->nullable();
        $table->decimal('longitud', 10, 7)->nullable();
        $table->string('fecha_hora')->nullable();
        $table->string('marca')->nullable();
        $table->string('modelo')->nullable();
        $table->string('exposicion')->nullable();
        $table->string('diafragma')->nullable();
        $table->integer('iso')->nullable();
        $table->boolean('flash')->nullable();
        $table->string('longitud_focal')->nullable();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
