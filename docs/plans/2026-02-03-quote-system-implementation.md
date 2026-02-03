# Quote System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a quote markup system that extracts line items from supplier invoices (PDF/Excel), applies markup percentages, generates quote PDFs, and converts quotes to projects.

**Architecture:** Laravel backend with Neuron AI agent for extraction, React/Inertia frontend following existing patterns. PDF generation via DomPDF, file parsing via smalot/pdfparser and PhpSpreadsheet.

**Tech Stack:** Laravel 12, React, Inertia.js, Neuron AI (Claude), DomPDF, PhpSpreadsheet

---

## Task 1: Install Dependencies

**Files:**
- Modify: `composer.json`

**Step 1: Install PHP packages**

Run:
```bash
composer require neuron-ai/neuron-ai barryvdh/laravel-dompdf smalot/pdfparser phpoffice/phpspreadsheet
```

**Step 2: Publish DomPDF config**

Run:
```bash
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

**Step 3: Commit**

```bash
git add composer.json composer.lock config/dompdf.php
git commit -m "feat: install quote system dependencies"
```

---

## Task 2: Create QuoteTemplate Migration and Model

**Files:**
- Create: `database/migrations/2026_02_03_000001_create_quote_templates_table.php`
- Create: `app/Models/QuoteTemplate.php`

**Step 1: Create migration**

Run:
```bash
php artisan make:migration create_quote_templates_table
```

Edit the migration file:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('content')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_templates');
    }
};
```

**Step 2: Create model**

Create `app/Models/QuoteTemplate.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'content',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class, 'template_id');
    }
}
```

**Step 3: Run migration**

Run:
```bash
php artisan migrate
```

**Step 4: Commit**

```bash
git add database/migrations/*quote_templates* app/Models/QuoteTemplate.php
git commit -m "feat: add QuoteTemplate model and migration"
```

---

## Task 3: Create Quote Migration and Model

**Files:**
- Create: `database/migrations/2026_02_03_000002_create_quotes_table.php`
- Create: `app/Models/Quote.php`

**Step 1: Create migration**

Run:
```bash
php artisan make:migration create_quotes_table
```

Edit the migration file:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('quote_number')->unique();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('template_id')->constrained('quote_templates');
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();
            $table->text('customer_address')->nullable();
            $table->decimal('markup_percentage', 5, 2)->default(0);
            $table->text('notes')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamp('converted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
```

**Step 2: Create model**

Create `app/Models/Quote.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    protected $fillable = [
        'quote_number',
        'client_id',
        'location_id',
        'project_id',
        'template_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'markup_percentage',
        'notes',
        'valid_until',
        'converted_at',
    ];

    protected $casts = [
        'markup_percentage' => 'decimal:2',
        'valid_until' => 'date',
        'converted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Quote $quote) {
            if (empty($quote->quote_number)) {
                $quote->quote_number = self::generateQuoteNumber();
            }
        });
    }

    public static function generateQuoteNumber(): string
    {
        $year = date('Y');
        $lastQuote = self::whereYear('created_at', $year)
            ->orderByDesc('id')
            ->first();

        $sequence = $lastQuote ? ((int) substr($lastQuote->quote_number, -4)) + 1 : 1;

        return sprintf('Q%s-%04d', $year, $sequence);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(QuoteTemplate::class, 'template_id');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(QuoteLine::class)->orderBy('sort_order');
    }

    public function getSubtotalAttribute(): float
    {
        return $this->lines->sum('total');
    }

    public function getTotalCostAttribute(): float
    {
        return $this->lines->sum(fn ($line) => $line->quantity * $line->unit_cost);
    }

    public function getTotalMarkupAttribute(): float
    {
        return $this->subtotal - $this->total_cost;
    }
}
```

**Step 3: Run migration**

Run:
```bash
php artisan migrate
```

**Step 4: Commit**

```bash
git add database/migrations/*quotes_table* app/Models/Quote.php
git commit -m "feat: add Quote model and migration"
```

---

## Task 4: Create QuoteLine Migration and Model

**Files:**
- Create: `database/migrations/2026_02_03_000003_create_quote_lines_table.php`
- Create: `app/Models/QuoteLine.php`

**Step 1: Create migration**

Run:
```bash
php artisan make:migration create_quote_lines_table
```

Edit the migration file:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->string('description');
            $table->decimal('quantity', 10, 2)->default(1);
            $table->string('unit')->nullable();
            $table->decimal('unit_cost', 10, 2)->default(0);
            $table->decimal('markup_percentage', 5, 2)->default(0);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_lines');
    }
};
```

**Step 2: Create model**

Create `app/Models/QuoteLine.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteLine extends Model
{
    protected $fillable = [
        'quote_id',
        'description',
        'quantity',
        'unit',
        'unit_cost',
        'markup_percentage',
        'unit_price',
        'total',
        'sort_order',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'markup_percentage' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function (QuoteLine $line) {
            $line->unit_price = $line->unit_cost * (1 + $line->markup_percentage / 100);
            $line->total = $line->quantity * $line->unit_price;
        });
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }
}
```

**Step 3: Run migration**

Run:
```bash
php artisan migrate
```

**Step 4: Commit**

```bash
git add database/migrations/*quote_lines* app/Models/QuoteLine.php
git commit -m "feat: add QuoteLine model and migration"
```

---

## Task 5: Create QuoteExtractionAgent

**Files:**
- Create: `app/Agents/QuoteExtractionAgent.php`

**Step 1: Create the agent**

Create `app/Agents/QuoteExtractionAgent.php`:

```php
<?php

namespace App\Agents;

use NeuronAI\Agent;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\Anthropic\Anthropic;

class QuoteExtractionAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        return new Anthropic(
            key: config('services.anthropic.api_key'),
            model: 'claude-sonnet-4-20250514',
        );
    }

    public function instructions(): string
    {
        return <<<PROMPT
You are an invoice/quote line item extraction specialist. Your task is to extract line items from supplier invoices, price lists, or quotes.

Given the raw text content from a document, identify and extract all line items with their:
- description: The item/service description
- quantity: The quantity (default to 1 if not specified)
- unit: The unit of measurement (e.g., pcs, m², hours, kg, stuks, meter, liter)
- unit_price: The unit price/cost (numeric value only, no currency symbols)

Return ONLY a valid JSON array of objects. Do not include any explanation or markdown formatting.

Example output:
[
  {"description": "Labor - Installation", "quantity": 8, "unit": "hours", "unit_price": 45.00},
  {"description": "PVC Pipe 50mm", "quantity": 10, "unit": "meter", "unit_price": 3.50}
]

Rules:
- Extract ALL line items you can identify
- If quantity is not specified, use 1
- If unit is not specified, use "stuks" (pieces)
- Convert all prices to numeric values (remove currency symbols)
- Use Dutch unit names when appropriate (stuks, meter, uur, etc.)
- If you cannot identify any line items, return an empty array: []
PROMPT;
    }
}
```

**Step 2: Add Anthropic config**

Edit `config/services.php` and add:

```php
'anthropic' => [
    'api_key' => env('ANTHROPIC_API_KEY'),
],
```

**Step 3: Update .env.example**

Add to `.env.example`:
```
ANTHROPIC_API_KEY=
```

**Step 4: Commit**

```bash
git add app/Agents/QuoteExtractionAgent.php config/services.php .env.example
git commit -m "feat: add QuoteExtractionAgent for AI line item extraction"
```

---

## Task 6: Create QuoteTemplateController

**Files:**
- Create: `app/Http/Controllers/QuoteTemplateController.php`

**Step 1: Create controller**

Create `app/Http/Controllers/QuoteTemplateController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\QuoteTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuoteTemplateController extends Controller
{
    public function index(Request $request)
    {
        $templates = QuoteTemplate::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('quote-templates/index', [
            'templates' => $templates,
            'search' => $request->search,
        ]);
    }

    public function create()
    {
        return Inertia::render('quote-templates/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            QuoteTemplate::where('is_default', true)->update(['is_default' => false]);
        }

        $template = QuoteTemplate::create($validated);

        return redirect()->route('quote-templates.index')
            ->with('success', 'Template aangemaakt.');
    }

    public function edit(QuoteTemplate $quoteTemplate)
    {
        return Inertia::render('quote-templates/edit', [
            'template' => $quoteTemplate,
        ]);
    }

    public function update(Request $request, QuoteTemplate $quoteTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            QuoteTemplate::where('is_default', true)
                ->where('id', '!=', $quoteTemplate->id)
                ->update(['is_default' => false]);
        }

        $quoteTemplate->update($validated);

        return redirect()->route('quote-templates.index')
            ->with('success', 'Template bijgewerkt.');
    }

    public function destroy(QuoteTemplate $quoteTemplate)
    {
        $quoteTemplate->delete();

        return redirect()->route('quote-templates.index')
            ->with('success', 'Template verwijderd.');
    }
}
```

**Step 2: Commit**

```bash
git add app/Http/Controllers/QuoteTemplateController.php
git commit -m "feat: add QuoteTemplateController"
```

---

## Task 7: Create QuoteController (Part 1 - Basic CRUD)

**Files:**
- Create: `app/Http/Controllers/QuoteController.php`

**Step 1: Create controller with basic CRUD**

Create `app/Http/Controllers/QuoteController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Location;
use App\Models\Quote;
use App\Models\QuoteTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $quotes = Quote::with(['client', 'template'])
            ->when($request->search, function ($query, $search) {
                $query->where('quote_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $quotes->getCollection()->transform(function ($quote) {
            $quote->total = $quote->subtotal;
            return $quote;
        });

        return Inertia::render('quotes/index', [
            'quotes' => $quotes,
            'search' => $request->search,
        ]);
    }

    public function create()
    {
        return Inertia::render('quotes/create', [
            'clients' => Client::orderBy('name')->get(['id', 'name']),
            'locations' => Location::with('client:id,name')->orderBy('name')->get(['id', 'name', 'client_id']),
            'templates' => QuoteTemplate::orderBy('name')->get(['id', 'name', 'is_default']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'location_id' => 'nullable|exists:locations,id',
            'template_id' => 'required|exists:quote_templates,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'customer_address' => 'nullable|string',
            'markup_percentage' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'valid_until' => 'nullable|date',
            'lines' => 'required|array|min:1',
            'lines.*.description' => 'required|string|max:255',
            'lines.*.quantity' => 'required|numeric|min:0.01',
            'lines.*.unit' => 'nullable|string|max:50',
            'lines.*.unit_cost' => 'required|numeric|min:0',
            'lines.*.markup_percentage' => 'required|numeric|min:0|max:100',
        ]);

        $quote = Quote::create([
            'client_id' => $validated['client_id'],
            'location_id' => $validated['location_id'],
            'template_id' => $validated['template_id'],
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'customer_address' => $validated['customer_address'],
            'markup_percentage' => $validated['markup_percentage'],
            'notes' => $validated['notes'],
            'valid_until' => $validated['valid_until'],
        ]);

        foreach ($validated['lines'] as $index => $line) {
            $quote->lines()->create([
                'description' => $line['description'],
                'quantity' => $line['quantity'],
                'unit' => $line['unit'] ?? 'stuks',
                'unit_cost' => $line['unit_cost'],
                'markup_percentage' => $line['markup_percentage'],
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('quotes.show', $quote)
            ->with('success', 'Offerte aangemaakt.');
    }

    public function show(Quote $quote)
    {
        $quote->load(['client', 'location', 'template', 'lines', 'project']);

        return Inertia::render('quotes/show', [
            'quote' => $quote,
            'totals' => [
                'subtotal' => $quote->subtotal,
                'total_cost' => $quote->total_cost,
                'total_markup' => $quote->total_markup,
            ],
        ]);
    }

    public function edit(Quote $quote)
    {
        $quote->load('lines');

        return Inertia::render('quotes/edit', [
            'quote' => $quote,
            'clients' => Client::orderBy('name')->get(['id', 'name']),
            'locations' => Location::with('client:id,name')->orderBy('name')->get(['id', 'name', 'client_id']),
            'templates' => QuoteTemplate::orderBy('name')->get(['id', 'name', 'is_default']),
        ]);
    }

    public function update(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'location_id' => 'nullable|exists:locations,id',
            'template_id' => 'required|exists:quote_templates,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'customer_address' => 'nullable|string',
            'markup_percentage' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'valid_until' => 'nullable|date',
            'lines' => 'required|array|min:1',
            'lines.*.description' => 'required|string|max:255',
            'lines.*.quantity' => 'required|numeric|min:0.01',
            'lines.*.unit' => 'nullable|string|max:50',
            'lines.*.unit_cost' => 'required|numeric|min:0',
            'lines.*.markup_percentage' => 'required|numeric|min:0|max:100',
        ]);

        $quote->update([
            'client_id' => $validated['client_id'],
            'location_id' => $validated['location_id'],
            'template_id' => $validated['template_id'],
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'customer_address' => $validated['customer_address'],
            'markup_percentage' => $validated['markup_percentage'],
            'notes' => $validated['notes'],
            'valid_until' => $validated['valid_until'],
        ]);

        $quote->lines()->delete();

        foreach ($validated['lines'] as $index => $line) {
            $quote->lines()->create([
                'description' => $line['description'],
                'quantity' => $line['quantity'],
                'unit' => $line['unit'] ?? 'stuks',
                'unit_cost' => $line['unit_cost'],
                'markup_percentage' => $line['markup_percentage'],
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('quotes.show', $quote)
            ->with('success', 'Offerte bijgewerkt.');
    }

    public function destroy(Quote $quote)
    {
        $quote->delete();

        return redirect()->route('quotes.index')
            ->with('success', 'Offerte verwijderd.');
    }
}
```

**Step 2: Commit**

```bash
git add app/Http/Controllers/QuoteController.php
git commit -m "feat: add QuoteController with basic CRUD"
```

---

## Task 8: Add Extract and PDF Methods to QuoteController

**Files:**
- Modify: `app/Http/Controllers/QuoteController.php`

**Step 1: Add extract method**

Add these methods to `QuoteController.php`:

```php
use App\Agents\QuoteExtractionAgent;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Smalot\PdfParser\Parser as PdfParser;

// Add to the class:

public function extract(Request $request)
{
    $request->validate([
        'file' => 'required|file|mimes:pdf,xlsx,xls,csv|max:10240',
    ]);

    $file = $request->file('file');
    $extension = strtolower($file->getClientOriginalExtension());

    $content = match ($extension) {
        'pdf' => $this->extractFromPdf($file),
        'xlsx', 'xls' => $this->extractFromExcel($file),
        'csv' => $this->extractFromCsv($file),
        default => throw new \Exception('Unsupported file type'),
    };

    if (empty(trim($content))) {
        return response()->json([
            'lines' => [],
            'message' => 'Geen tekst gevonden in het bestand.',
        ]);
    }

    $agent = new QuoteExtractionAgent();
    $response = $agent->chat($content);

    $lines = json_decode($response, true);

    if (!is_array($lines)) {
        return response()->json([
            'lines' => [],
            'message' => 'Kon geen regels extraheren uit het bestand.',
        ]);
    }

    return response()->json([
        'lines' => $lines,
    ]);
}

protected function extractFromPdf($file): string
{
    $parser = new PdfParser();
    $pdf = $parser->parseFile($file->getPathname());
    return $pdf->getText();
}

protected function extractFromExcel($file): string
{
    $spreadsheet = IOFactory::load($file->getPathname());
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = [];

    foreach ($worksheet->getRowIterator() as $row) {
        $cellIterator = $row->getCellIterator();
        $cellIterator->setIterateOnlyExistingCells(false);
        $rowData = [];
        foreach ($cellIterator as $cell) {
            $rowData[] = $cell->getValue();
        }
        $rows[] = implode(' | ', array_filter($rowData));
    }

    return implode("\n", $rows);
}

protected function extractFromCsv($file): string
{
    return file_get_contents($file->getPathname());
}

public function pdf(Quote $quote)
{
    $quote->load(['client', 'location', 'template', 'lines']);

    $pdf = Pdf::loadView('quotes.pdf', [
        'quote' => $quote,
        'totals' => [
            'subtotal' => $quote->subtotal,
            'total_cost' => $quote->total_cost,
            'total_markup' => $quote->total_markup,
        ],
    ]);

    return $pdf->download("offerte-{$quote->quote_number}.pdf");
}
```

**Step 2: Commit**

```bash
git add app/Http/Controllers/QuoteController.php
git commit -m "feat: add extract and PDF generation to QuoteController"
```

---

## Task 9: Add Convert to Project Method

**Files:**
- Modify: `app/Http/Controllers/QuoteController.php`

**Step 1: Add convert method**

Add this method to `QuoteController.php`:

```php
public function convert(Request $request, Quote $quote)
{
    if ($quote->project_id) {
        return back()->with('error', 'Deze offerte is al omgezet naar een project.');
    }

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'type' => 'required|in:maintenance,recurring,renovation',
        'create_client' => 'boolean',
        'create_location' => 'boolean',
    ]);

    $clientId = $quote->client_id;
    $locationId = $quote->location_id;

    // Create client if needed
    if (($validated['create_client'] ?? false) && !$clientId) {
        $client = Client::create([
            'name' => $quote->customer_name,
            'email' => $quote->customer_email,
            'phone' => $quote->customer_phone,
        ]);
        $clientId = $client->id;
    }

    // Create location if needed
    if (($validated['create_location'] ?? false) && !$locationId && $clientId) {
        $location = Location::create([
            'client_id' => $clientId,
            'name' => $quote->customer_name,
            'address' => $quote->customer_address ?? '',
            'city' => '',
            'postal_code' => '',
        ]);
        $locationId = $location->id;
    }

    if (!$locationId) {
        return back()->with('error', 'Een locatie is vereist om een project aan te maken.');
    }

    $project = Project::create([
        'location_id' => $locationId,
        'title' => $validated['title'],
        'type' => $validated['type'],
        'status' => 'approved',
        'quoted_price' => $quote->subtotal,
    ]);

    $quote->update([
        'project_id' => $project->id,
        'client_id' => $clientId,
        'location_id' => $locationId,
        'converted_at' => now(),
    ]);

    return redirect()->route('projects.show', $project)
        ->with('success', 'Offerte omgezet naar project.');
}
```

**Step 2: Commit**

```bash
git add app/Http/Controllers/QuoteController.php
git commit -m "feat: add convert to project functionality"
```

---

## Task 10: Add Routes

**Files:**
- Modify: `routes/web.php`

**Step 1: Add quote routes**

Add to `routes/web.php` inside the authenticated middleware group:

```php
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\QuoteTemplateController;

// Inside Route::middleware(['auth', 'verified'])->group(function () { ... }):

// Quotes
Route::resource('dashboard/quotes', QuoteController::class)->names('quotes');
Route::post('dashboard/quotes/extract', [QuoteController::class, 'extract'])->name('quotes.extract');
Route::get('dashboard/quotes/{quote}/pdf', [QuoteController::class, 'pdf'])->name('quotes.pdf');
Route::post('dashboard/quotes/{quote}/convert', [QuoteController::class, 'convert'])->name('quotes.convert');

// Quote Templates
Route::resource('dashboard/quote-templates', QuoteTemplateController::class)->names('quote-templates')->except(['show']);
```

**Step 2: Commit**

```bash
git add routes/web.php
git commit -m "feat: add quote and template routes"
```

---

## Task 11: Add TypeScript Types

**Files:**
- Modify: `resources/js/types/index.d.ts`

**Step 1: Add quote types**

Add to `resources/js/types/index.d.ts`:

```typescript
export interface QuoteTemplate {
    id: number;
    name: string;
    description: string | null;
    content: string | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface QuoteLine {
    id?: number;
    quote_id?: number;
    description: string;
    quantity: number;
    unit: string | null;
    unit_cost: number;
    markup_percentage: number;
    unit_price: number;
    total: number;
    sort_order: number;
}

export interface Quote {
    id: number;
    quote_number: string;
    client_id: number | null;
    location_id: number | null;
    project_id: number | null;
    template_id: number;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    customer_address: string | null;
    markup_percentage: number;
    notes: string | null;
    valid_until: string | null;
    converted_at: string | null;
    created_at: string;
    updated_at: string;
    client?: Client;
    location?: Location;
    project?: Project;
    template?: QuoteTemplate;
    lines?: QuoteLine[];
    total?: number;
}

export interface Client {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
}

export interface Location {
    id: number;
    name: string;
    client_id: number;
    client?: Client;
}

export interface Project {
    id: number;
    title: string;
    status: string;
    type: string;
}
```

**Step 2: Commit**

```bash
git add resources/js/types/index.d.ts
git commit -m "feat: add Quote TypeScript types"
```

---

## Task 12: Update Sidebar Navigation

**Files:**
- Modify: `resources/js/components/app-sidebar.tsx`

**Step 1: Add quotes to navigation**

Edit `resources/js/components/app-sidebar.tsx`:

Add import:
```typescript
import { FileText } from 'lucide-react';
```

Add to `mainNavItems` array after Projects:
```typescript
{
    title: 'Offertes',
    href: '/dashboard/quotes',
    icon: FileText,
},
```

**Step 2: Commit**

```bash
git add resources/js/components/app-sidebar.tsx
git commit -m "feat: add Quotes to sidebar navigation"
```

---

## Task 13: Create Quote Templates Index Page

**Files:**
- Create: `resources/js/pages/quote-templates/index.tsx`

**Step 1: Create the page**

Create `resources/js/pages/quote-templates/index.tsx`:

```tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type QuoteTemplate } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PaginatedData {
    data: QuoteTemplate[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    templates: PaginatedData;
    search: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Offerte Templates', href: '/dashboard/quote-templates' },
];

export default function QuoteTemplatesIndex({ templates, search }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/quote-templates/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard/quote-templates', searchValue ? { search: searchValue } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offerte Templates" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Offerte Templates
                                </CardTitle>
                                <CardDescription>
                                    Beheer uw offerte templates
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/quote-templates/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuwe Template
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Zoek op naam..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Zoeken
                                </Button>
                            </div>
                        </form>

                        {templates.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen templates gevonden.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Naam</TableHead>
                                            <TableHead>Beschrijving</TableHead>
                                            <TableHead>Standaard</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {templates.data.map((template) => (
                                            <TableRow key={template.id}>
                                                <TableCell className="font-medium">
                                                    {template.name}
                                                </TableCell>
                                                <TableCell>{template.description || '-'}</TableCell>
                                                <TableCell>
                                                    {template.is_default && (
                                                        <Badge>Standaard</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/quote-templates/${template.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(template.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {templates.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {templates.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze template wordt permanent verwijderd.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
```

**Step 2: Commit**

```bash
git add resources/js/pages/quote-templates/index.tsx
git commit -m "feat: add quote templates index page"
```

---

## Task 14: Create Quote Templates Create/Edit Pages

**Files:**
- Create: `resources/js/pages/quote-templates/create.tsx`
- Create: `resources/js/pages/quote-templates/edit.tsx`

**Step 1: Create the create page**

Create `resources/js/pages/quote-templates/create.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Offerte Templates', href: '/dashboard/quote-templates' },
    { title: 'Nieuwe Template', href: '/dashboard/quote-templates/create' },
];

export default function QuoteTemplateCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        content: '',
        is_default: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/quote-templates');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nieuwe Template" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Nieuwe Template
                        </CardTitle>
                        <CardDescription>
                            Maak een nieuwe offerte template aan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Naam *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Bijv. Standaard Offerte"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Beschrijving</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Korte beschrijving van deze template..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_default"
                                    checked={data.is_default}
                                    onCheckedChange={(checked) => setData('is_default', checked as boolean)}
                                />
                                <Label htmlFor="is_default">Standaard template</Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Opslaan...' : 'Template Aanmaken'}
                                </Button>
                                <Link href="/dashboard/quote-templates">
                                    <Button type="button" variant="outline">
                                        Annuleren
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
```

**Step 2: Create the edit page**

Create `resources/js/pages/quote-templates/edit.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type QuoteTemplate } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';

interface Props {
    template: QuoteTemplate;
}

export default function QuoteTemplateEdit({ template }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Offerte Templates', href: '/dashboard/quote-templates' },
        { title: template.name, href: `/dashboard/quote-templates/${template.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        description: template.description || '',
        content: template.content || '',
        is_default: template.is_default,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/quote-templates/${template.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Template Bewerken - ${template.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Template Bewerken
                        </CardTitle>
                        <CardDescription>
                            Bewerk de offerte template
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Naam *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Beschrijving</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_default"
                                    checked={data.is_default}
                                    onCheckedChange={(checked) => setData('is_default', checked as boolean)}
                                />
                                <Label htmlFor="is_default">Standaard template</Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Opslaan...' : 'Opslaan'}
                                </Button>
                                <Link href="/dashboard/quote-templates">
                                    <Button type="button" variant="outline">
                                        Annuleren
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
```

**Step 3: Commit**

```bash
git add resources/js/pages/quote-templates/create.tsx resources/js/pages/quote-templates/edit.tsx
git commit -m "feat: add quote template create and edit pages"
```

---

## Task 15: Create Quotes Index Page

**Files:**
- Create: `resources/js/pages/quotes/index.tsx`

**Step 1: Create the page**

Create `resources/js/pages/quotes/index.tsx`:

```tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Quote } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PaginatedData {
    data: Quote[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    quotes: PaginatedData;
    search: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Offertes', href: '/dashboard/quotes' },
];

export default function QuotesIndex({ quotes, search }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/quotes/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard/quotes', searchValue ? { search: searchValue } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatPrice = (price: number | null) => {
        if (price === null || price === undefined) return '-';
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offertes" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Offertes
                                </CardTitle>
                                <CardDescription>
                                    Beheer uw offertes
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/quotes/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuwe Offerte
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Zoek op offertenummer of klantnaam..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Zoeken
                                </Button>
                            </div>
                        </form>

                        {quotes.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen offertes gevonden.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nummer</TableHead>
                                            <TableHead>Klant</TableHead>
                                            <TableHead>Template</TableHead>
                                            <TableHead>Totaal</TableHead>
                                            <TableHead>Datum</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {quotes.data.map((quote) => (
                                            <TableRow key={quote.id}>
                                                <TableCell className="font-medium">
                                                    {quote.quote_number}
                                                </TableCell>
                                                <TableCell>{quote.customer_name}</TableCell>
                                                <TableCell>{quote.template?.name || '-'}</TableCell>
                                                <TableCell>{formatPrice(quote.total ?? 0)}</TableCell>
                                                <TableCell>{formatDate(quote.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/quotes/${quote.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/dashboard/quotes/${quote.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(quote.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {quotes.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {quotes.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze offerte wordt permanent verwijderd.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
```

**Step 2: Commit**

```bash
git add resources/js/pages/quotes/index.tsx
git commit -m "feat: add quotes index page"
```

---

## Task 16: Create Quotes Create Page

**Files:**
- Create: `resources/js/pages/quotes/create.tsx`

This is a larger component - see separate file for full implementation.

---

## Task 17: Create Quotes Show Page

**Files:**
- Create: `resources/js/pages/quotes/show.tsx`

This is a larger component - see separate file for full implementation.

---

## Task 18: Create Quotes Edit Page

**Files:**
- Create: `resources/js/pages/quotes/edit.tsx`

Similar to create page with pre-filled data.

---

## Task 19: Create PDF Template

**Files:**
- Create: `resources/views/quotes/pdf.blade.php`

**Step 1: Create the PDF view**

Create `resources/views/quotes/pdf.blade.php`:

```blade
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Offerte {{ $quote->quote_number }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.4; }
        .header { margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; }
        .quote-title { font-size: 18px; margin-top: 20px; }
        .quote-number { color: #666; }
        .customer-info { margin: 20px 0; }
        .customer-info h3 { margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .text-right { text-align: right; }
        .totals { margin-top: 20px; }
        .totals table { width: 300px; margin-left: auto; }
        .totals td { border: none; padding: 5px 10px; }
        .total-row { font-weight: bold; font-size: 14px; }
        .footer { margin-top: 40px; font-size: 10px; color: #666; }
        .valid-until { margin-top: 20px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Fixzt</div>
        <div class="quote-title">OFFERTE</div>
        <div class="quote-number">{{ $quote->quote_number }}</div>
        <div>Datum: {{ $quote->created_at->format('d-m-Y') }}</div>
    </div>

    <div class="customer-info">
        <h3>Klant:</h3>
        <p>
            {{ $quote->customer_name }}<br>
            @if($quote->customer_address){{ nl2br(e($quote->customer_address)) }}<br>@endif
            @if($quote->customer_email){{ $quote->customer_email }}<br>@endif
            @if($quote->customer_phone){{ $quote->customer_phone }}@endif
        </p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Omschrijving</th>
                <th class="text-right">Aantal</th>
                <th>Eenheid</th>
                <th class="text-right">Prijs</th>
                <th class="text-right">Totaal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quote->lines as $line)
            <tr>
                <td>{{ $line->description }}</td>
                <td class="text-right">{{ number_format($line->quantity, 2, ',', '.') }}</td>
                <td>{{ $line->unit ?? 'stuks' }}</td>
                <td class="text-right">&euro; {{ number_format($line->unit_price, 2, ',', '.') }}</td>
                <td class="text-right">&euro; {{ number_format($line->total, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr class="total-row">
                <td>Totaal (excl. BTW)</td>
                <td class="text-right">&euro; {{ number_format($totals['subtotal'], 2, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    @if($quote->valid_until)
    <div class="valid-until">
        Deze offerte is geldig tot {{ $quote->valid_until->format('d-m-Y') }}.
    </div>
    @endif

    @if($quote->notes)
    <div style="margin-top: 30px;">
        <h4>Opmerkingen:</h4>
        <p>{{ $quote->notes }}</p>
    </div>
    @endif

    <div class="footer">
        <p>Bedankt voor uw interesse. Neem gerust contact met ons op voor vragen.</p>
    </div>
</body>
</html>
```

**Step 2: Commit**

```bash
git add resources/views/quotes/pdf.blade.php
git commit -m "feat: add quote PDF template"
```

---

## Task 20: Create Default Template Seeder

**Files:**
- Create: `database/seeders/QuoteTemplateSeeder.php`

**Step 1: Create seeder**

Run:
```bash
php artisan make:seeder QuoteTemplateSeeder
```

Edit `database/seeders/QuoteTemplateSeeder.php`:

```php
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
```

**Step 2: Run seeder**

Run:
```bash
php artisan db:seed --class=QuoteTemplateSeeder
```

**Step 3: Commit**

```bash
git add database/seeders/QuoteTemplateSeeder.php
git commit -m "feat: add quote template seeder"
```

---

## Summary

This plan covers:
1. Dependencies installation (Neuron AI, DomPDF, PdfParser, PhpSpreadsheet)
2. Database migrations (quote_templates, quotes, quote_lines)
3. Models with relationships and calculated attributes
4. QuoteExtractionAgent for AI-powered line item extraction
5. Controllers for quotes and templates
6. Routes for all CRUD + extract + PDF + convert
7. TypeScript types
8. React pages for templates and quotes management
9. PDF template for quote generation
10. Default template seeder

Total: ~20 tasks, each with specific files and commit points.
