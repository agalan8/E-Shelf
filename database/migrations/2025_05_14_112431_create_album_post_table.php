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
        Schema::create('album_regular_post', function (Blueprint $table) {
            $table->foreignId('album_id')->constrained();
            $table->foreignId('regular_post_id')->constrained();
            $table->primary(['album_id', 'regular_post_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('album_regular_post');
    }
};
