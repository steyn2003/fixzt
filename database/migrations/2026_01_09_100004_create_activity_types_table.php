<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('default_hourly_rate', 8, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed default activity types
        DB::table('activity_types')->insert([
            ['name' => 'Elektra', 'default_hourly_rate' => 55.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sanitair', 'default_hourly_rate' => 55.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Schilderwerk', 'default_hourly_rate' => 50.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Timmerwerkzaamheden', 'default_hourly_rate' => 55.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Inspectie', 'default_hourly_rate' => 45.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Transport', 'default_hourly_rate' => 40.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Algemeen onderhoud', 'default_hourly_rate' => 50.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Overig', 'default_hourly_rate' => 50.00, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_types');
    }
};
