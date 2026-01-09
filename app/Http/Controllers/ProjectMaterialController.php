<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMaterial;
use Illuminate\Http\Request;

class ProjectMaterialController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
            'unit_cost' => 'required|numeric|min:0',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['project_id'] = $project->id;
        $validated['total_cost'] = $validated['quantity'] * $validated['unit_cost'];

        ProjectMaterial::create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Materiaal toegevoegd.');
    }

    public function update(Request $request, Project $project, ProjectMaterial $material)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
            'unit_cost' => 'required|numeric|min:0',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['total_cost'] = $validated['quantity'] * $validated['unit_cost'];

        $material->update($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Materiaal bijgewerkt.');
    }

    public function destroy(Project $project, ProjectMaterial $material)
    {
        $material->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Materiaal verwijderd.');
    }
}
