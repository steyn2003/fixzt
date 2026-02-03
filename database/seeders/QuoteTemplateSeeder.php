<?php

namespace Database\Seeders;

use App\Models\QuoteTemplate;
use Illuminate\Database\Seeder;

class QuoteTemplateSeeder extends Seeder
{
    public function run(): void
    {
        QuoteTemplate::create([
            'name' => 'Standaard',
            'description' => 'Standaard offerte template',
            'is_default' => true,
        ]);

        QuoteTemplate::create([
            'name' => 'Onderhoud',
            'description' => 'Template voor onderhoudswerk',
            'is_default' => false,
        ]);

        QuoteTemplate::create([
            'name' => 'Renovatie',
            'description' => 'Template voor renovatieprojecten',
            'is_default' => false,
        ]);
    }
}
