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
        Schema::create('social_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained();
            $table->foreignId('social_id')->constrained();
            $table->string('perfil');
            $table->primary(['user_id', 'social_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_user');
    }
};
