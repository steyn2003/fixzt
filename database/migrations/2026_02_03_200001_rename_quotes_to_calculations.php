<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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

    public function down(): void
    {
        Schema::table('calculation_lines', function (Blueprint $table) {
            $table->renameColumn('calculation_id', 'quote_id');
        });

        Schema::table('calculations', function (Blueprint $table) {
            $table->renameColumn('calculation_number', 'quote_number');
        });

        Schema::rename('calculations', 'quotes');
        Schema::rename('calculation_lines', 'quote_lines');
        Schema::rename('calculation_templates', 'quote_templates');
    }
};
