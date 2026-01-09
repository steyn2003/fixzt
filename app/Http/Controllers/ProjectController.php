<?php

namespace App\Http\Controllers;

use App\Models\ActivityType;
use App\Models\Client;
use App\Models\Location;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::with(['location.client'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('location', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location.client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->client_id, function ($query, $clientId) {
                $query->whereHas('location', function ($q) use ($clientId) {
                    $q->where('client_id', $clientId);
                });
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'search' => $request->search,
            'currentStatus' => $request->status,
            'currentType' => $request->type,
            'clientId' => $request->client_id,
            'clients' => Client::orderBy('name')->get(['id', 'name']),
            'counts' => [
                'all' => Project::count(),
                'quote' => Project::where('status', 'quote')->count(),
                'approved' => Project::where('status', 'approved')->count(),
                'in_progress' => Project::where('status', 'in_progress')->count(),
                'completed' => Project::where('status', 'completed')->count(),
                'invoiced' => Project::where('status', 'invoiced')->count(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('projects/create', [
            'clients' => Client::with('locations')->orderBy('name')->get(),
            'selectedLocationId' => $request->location_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:maintenance,recurring,renovation',
            'status' => 'required|in:quote,approved,in_progress,completed,invoiced',
            'quoted_price' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $project = Project::create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project aangemaakt.');
    }

    public function show(Project $project)
    {
        $project->load(['location.client', 'timeEntries.activityType', 'materials', 'notes.user', 'files.user']);

        return Inertia::render('projects/show', [
            'project' => $project,
            'activityTypes' => ActivityType::where('is_active', true)->orderBy('name')->get(),
            'financials' => [
                'quoted_price' => $project->quoted_price,
                'labor_cost' => $project->labor_cost,
                'material_cost' => $project->material_cost,
                'actual_cost' => $project->actual_cost,
                'profit_margin' => $project->profit_margin,
            ],
        ]);
    }

    public function edit(Project $project)
    {
        $project->load('location');

        return Inertia::render('projects/edit', [
            'project' => $project,
            'clients' => Client::with('locations')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:maintenance,recurring,renovation',
            'status' => 'required|in:quote,approved,in_progress,completed,invoiced',
            'quoted_price' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $project->update($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project bijgewerkt.');
    }

    public function destroy(Project $project)
    {
        $locationId = $project->location_id;
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project verwijderd.');
    }
}
