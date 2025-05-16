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
        Schema::create('regular_post_tag', function (Blueprint $table) {
            $table->foreignId('regular_post_id')->constrained();
            $table->foreignId('tag_id')->constrained();
            $table->primary(['regular_post_id', 'tag_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regular_post_tag');
    }
};
