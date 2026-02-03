<?php

namespace App\Http\Controllers;

use App\Jobs\ExtractCalculationLinesJob;
use App\Models\Calculation;
use App\Models\CalculationTemplate;
use App\Models\Client;
use App\Models\Location;
use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Smalot\PdfParser\Parser as PdfParser;

class CalculationController extends Controller
{
    public function index(Request $request)
    {
        $calculations = Calculation::with(['client', 'template'])
            ->when($request->search, function ($query, $search) {
                $query->where('calculation_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $calculations->getCollection()->transform(function ($calculation) {
            $calculation->total = $calculation->subtotal;

            return $calculation;
        });

        return Inertia::render('calculations/index', [
            'calculations' => $calculations,
            'search' => $request->search,
        ]);
    }

    public function create()
    {
        return Inertia::render('calculations/create', [
            'clients' => Client::orderBy('name')->get(['id', 'name']),
            'locations' => Location::with('client:id,name')->orderBy('name')->get(['id', 'name', 'client_id']),
            'templates' => CalculationTemplate::orderBy('name')->get(['id', 'name', 'is_default']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'location_id' => 'nullable|exists:locations,id',
            'template_id' => 'required|exists:calculation_templates,id',
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

        $calculation = Calculation::create([
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
            $calculation->lines()->create([
                'description' => $line['description'],
                'quantity' => $line['quantity'],
                'unit' => $line['unit'] ?? 'stuks',
                'unit_cost' => $line['unit_cost'],
                'markup_percentage' => $line['markup_percentage'],
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('calculations.show', $calculation)
            ->with('success', 'Calculatie aangemaakt.');
    }

    public function show(Calculation $calculation)
    {
        $calculation->load(['client', 'location', 'template', 'lines', 'project', 'quote']);

        return Inertia::render('calculations/show', [
            'calculation' => $calculation,
            'totals' => [
                'subtotal' => $calculation->subtotal,
                'total_cost' => $calculation->total_cost,
                'total_markup' => $calculation->total_markup,
            ],
        ]);
    }

    public function edit(Calculation $calculation)
    {
        $calculation->load('lines');

        return Inertia::render('calculations/edit', [
            'calculation' => $calculation,
            'clients' => Client::orderBy('name')->get(['id', 'name']),
            'locations' => Location::with('client:id,name')->orderBy('name')->get(['id', 'name', 'client_id']),
            'templates' => CalculationTemplate::orderBy('name')->get(['id', 'name', 'is_default']),
        ]);
    }

    public function update(Request $request, Calculation $calculation)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'location_id' => 'nullable|exists:locations,id',
            'template_id' => 'required|exists:calculation_templates,id',
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

        $calculation->update([
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

        $calculation->lines()->delete();

        foreach ($validated['lines'] as $index => $line) {
            $calculation->lines()->create([
                'description' => $line['description'],
                'quantity' => $line['quantity'],
                'unit' => $line['unit'] ?? 'stuks',
                'unit_cost' => $line['unit_cost'],
                'markup_percentage' => $line['markup_percentage'],
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('calculations.show', $calculation)
            ->with('success', 'Calculatie bijgewerkt.');
    }

    public function destroy(Calculation $calculation)
    {
        $calculation->delete();

        return redirect()->route('calculations.index')
            ->with('success', 'Calculatie verwijderd.');
    }

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

        $extractionId = Str::uuid()->toString();

        Cache::put("calculation_extraction:{$extractionId}", [
            'status' => 'processing',
        ], now()->addMinutes(10));

        ExtractCalculationLinesJob::dispatch($extractionId, $content);

        return response()->json([
            'extraction_id' => $extractionId,
            'status' => 'processing',
        ]);
    }

    public function extractStatus(string $extractionId)
    {
        $result = Cache::get("calculation_extraction:{$extractionId}");

        if (! $result) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Extractie niet gevonden.',
            ], 404);
        }

        return response()->json($result);
    }

    protected function extractFromPdf($file): string
    {
        $parser = new PdfParser;
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

    public function pdf(Calculation $calculation)
    {
        $calculation->load(['client', 'location', 'template', 'lines']);

        $pdf = Pdf::loadView('calculations.pdf', [
            'calculation' => $calculation,
            'totals' => [
                'subtotal' => $calculation->subtotal,
                'total_cost' => $calculation->total_cost,
                'total_markup' => $calculation->total_markup,
            ],
        ]);

        return $pdf->download("calculatie-{$calculation->calculation_number}.pdf");
    }

    public function convert(Request $request, Calculation $calculation)
    {
        if ($calculation->project_id) {
            return back()->with('error', 'Deze calculatie is al omgezet naar een project.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:maintenance,recurring,renovation',
            'create_client' => 'boolean',
            'create_location' => 'boolean',
        ]);

        $clientId = $calculation->client_id;
        $locationId = $calculation->location_id;

        if (($validated['create_client'] ?? false) && ! $clientId) {
            $client = Client::create([
                'name' => $calculation->customer_name,
                'email' => $calculation->customer_email,
                'phone' => $calculation->customer_phone,
            ]);
            $clientId = $client->id;
        }

        if (($validated['create_location'] ?? false) && ! $locationId && $clientId) {
            $location = Location::create([
                'client_id' => $clientId,
                'name' => $calculation->customer_name,
                'address' => $calculation->customer_address ?? '',
                'city' => '',
                'postal_code' => '',
            ]);
            $locationId = $location->id;
        }

        if (! $locationId) {
            return back()->with('error', 'Een locatie is vereist om een project aan te maken.');
        }

        $project = Project::create([
            'location_id' => $locationId,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'status' => 'approved',
            'quoted_price' => $calculation->subtotal,
        ]);

        $calculation->update([
            'project_id' => $project->id,
            'client_id' => $clientId,
            'location_id' => $locationId,
            'converted_at' => now(),
        ]);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Calculatie omgezet naar project.');
    }
}
