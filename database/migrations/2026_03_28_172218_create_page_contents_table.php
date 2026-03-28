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
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page'); // welcome, about, services
            $table->string('section'); // hero, stats, features, etc.
            $table->string('key'); // title, description, image, etc.
            $table->string('type')->default('text'); // text, textarea, image
            $table->text('value')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['page', 'section', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};
