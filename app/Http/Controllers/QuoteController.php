<?php

namespace App\Http\Controllers;

use App\Models\Calculation;
use App\Models\Client;
use App\Models\Quote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $quotes = Quote::query()
            ->with(['calculation', 'client'])
            ->when($request->search, function ($query, $search) {
                $query->where('quote_number', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('calculation', function ($q) use ($search) {
                        $q->where('customer_name', 'like', "%{$search}%");
                    });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('quotes/index', [
            'quotes' => $quotes,
            'search' => $request->search,
        ]);
    }

    public function create(Request $request)
    {
        $calculations = Calculation::query()
            ->whereDoesntHave('quote')
            ->orderBy('created_at', 'desc')
            ->get();

        $clients = Client::orderBy('name')->get();

        // Pre-select calculation if passed
        $selectedCalculation = null;
        if ($request->calculation_id) {
            $selectedCalculation = Calculation::find($request->calculation_id);
        }

        return Inertia::render('quotes/create', [
            'calculations' => $calculations,
            'clients' => $clients,
            'selectedCalculation' => $selectedCalculation,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'calculation_id' => 'required|exists:calculations,id',
            'client_id' => 'nullable|exists:clients,id',
            'description' => 'required|string|max:500',
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        // Generate quote number
        $lastQuote = Quote::orderBy('id', 'desc')->first();
        $nextNumber = $lastQuote ? ((int) substr($lastQuote->quote_number, 4)) + 1 : 1;
        $validated['quote_number'] = 'OFF-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

        // Get client from calculation if not specified
        if (empty($validated['client_id'])) {
            $calculation = Calculation::find($validated['calculation_id']);
            $validated['client_id'] = $calculation->client_id;
        }

        $quote = Quote::create($validated);

        return redirect()->route('quotes.show', $quote)
            ->with('success', 'Offerte aangemaakt.');
    }

    public function show(Quote $quote)
    {
        $quote->load(['calculation.lines', 'client']);

        return Inertia::render('quotes/show', [
            'quote' => $quote,
        ]);
    }

    public function edit(Quote $quote)
    {
        $quote->load(['calculation', 'client']);

        $calculations = Calculation::query()
            ->where(function ($query) use ($quote) {
                $query->whereDoesntHave('quote')
                    ->orWhere('id', $quote->calculation_id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $clients = Client::orderBy('name')->get();

        return Inertia::render('quotes/edit', [
            'quote' => $quote,
            'calculations' => $calculations,
            'clients' => $clients,
        ]);
    }

    public function update(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'calculation_id' => 'required|exists:calculations,id',
            'client_id' => 'nullable|exists:clients,id',
            'description' => 'required|string|max:500',
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        // Get client from calculation if not specified
        if (empty($validated['client_id'])) {
            $calculation = Calculation::find($validated['calculation_id']);
            $validated['client_id'] = $calculation->client_id;
        }

        $quote->update($validated);

        return redirect()->route('quotes.show', $quote)
            ->with('success', 'Offerte bijgewerkt.');
    }

    public function destroy(Quote $quote)
    {
        $quote->delete();

        return redirect()->route('quotes.index')
            ->with('success', 'Offerte verwijderd.');
    }

    public function pdf(Quote $quote)
    {
        $quote->load(['calculation.lines', 'client']);

        $pdf = Pdf::loadView('pdf.quote', [
            'quote' => $quote,
        ]);

        return $pdf->download("offerte-{$quote->quote_number}.pdf");
    }
}
