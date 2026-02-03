<?php

namespace App\Http\Controllers;

use App\Models\CalculationTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalculationTemplateController extends Controller
{
    public function index(Request $request)
    {
        $templates = CalculationTemplate::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('calculation-templates/index', [
            'templates' => $templates,
            'search' => $request->search,
        ]);
    }

    public function create()
    {
        return Inertia::render('calculation-templates/create');
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
            CalculationTemplate::where('is_default', true)->update(['is_default' => false]);
        }

        CalculationTemplate::create($validated);

        return redirect()->route('calculation-templates.index')
            ->with('success', 'Template aangemaakt.');
    }

    public function edit(CalculationTemplate $calculationTemplate)
    {
        return Inertia::render('calculation-templates/edit', [
            'template' => $calculationTemplate,
        ]);
    }

    public function update(Request $request, CalculationTemplate $calculationTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            CalculationTemplate::where('is_default', true)
                ->where('id', '!=', $calculationTemplate->id)
                ->update(['is_default' => false]);
        }

        $calculationTemplate->update($validated);

        return redirect()->route('calculation-templates.index')
            ->with('success', 'Template bijgewerkt.');
    }

    public function destroy(CalculationTemplate $calculationTemplate)
    {
        $calculationTemplate->delete();

        return redirect()->route('calculation-templates.index')
            ->with('success', 'Template verwijderd.');
    }
}
