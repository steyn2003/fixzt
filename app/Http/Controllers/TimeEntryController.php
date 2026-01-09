<?php

namespace App\Http\Controllers;

use App\Models\ActivityType;
use App\Models\Project;
use App\Models\TimeEntry;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'activity_type_id' => 'required|exists:activity_types,id',
            'hours' => 'required|numeric|min:0.25|max:24',
            'hourly_rate' => 'required|numeric|min:0',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['project_id'] = $project->id;

        TimeEntry::create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Uren toegevoegd.');
    }

    public function update(Request $request, Project $project, TimeEntry $timeEntry)
    {
        $validated = $request->validate([
            'activity_type_id' => 'required|exists:activity_types,id',
            'hours' => 'required|numeric|min:0.25|max:24',
            'hourly_rate' => 'required|numeric|min:0',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $timeEntry->update($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Uren bijgewerkt.');
    }

    public function destroy(Project $project, TimeEntry $timeEntry)
    {
        $timeEntry->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Uren verwijderd.');
    }
}
