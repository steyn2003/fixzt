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

        QuoteTemplate::create($validated);

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
