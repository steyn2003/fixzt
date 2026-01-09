<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectFileController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("projects/{$project->id}", $name, 'public');

        ProjectFile::create([
            'project_id' => $project->id,
            'user_id' => Auth::id(),
            'name' => $name,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Bestand geüpload.');
    }

    public function destroy(Project $project, ProjectFile $file)
    {
        Storage::disk('public')->delete($file->path);
        $file->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Bestand verwijderd.');
    }
}
