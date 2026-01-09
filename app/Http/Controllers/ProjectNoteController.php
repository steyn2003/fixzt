<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectNoteController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $validated['project_id'] = $project->id;
        $validated['user_id'] = Auth::id();

        ProjectNote::create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Notitie toegevoegd.');
    }

    public function destroy(Project $project, ProjectNote $note)
    {
        $note->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Notitie verwijderd.');
    }
}
