<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First check if we need to rename the old tables (if first migration didn't run)
        if (Schema::hasTable('quotes') && !Schema::hasTable('calculations')) {
            // First migration didn't run - rename tables first
            Schema::rename('quote_templates', 'calculation_templates');
            Schema::rename('quote_lines', 'calculation_lines');
            Schema::rename('quotes', 'calculations');

            Schema::table('calculations', function (Blueprint $table) {
                $table->renameColumn('quote_number', 'calculation_number');
            });

            Schema::table('calculation_lines', function (Blueprint $table) {
                $table->renameColumn('quote_id', 'calculation_id');
            });
        }

        // Always drop the quotes table first if it exists (handles PostgreSQL properly)
        Schema::dropIfExists('quotes');

        // Create the new simplified quotes table
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('quote_number')->unique();
            $table->foreignId('calculation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->string('description')->default('Werkzaamheden conform calculatie');
            $table->text('notes')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
