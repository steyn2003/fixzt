<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $locations = Location::with('client')
            ->withCount('projects')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->client_id, function ($query, $clientId) {
                $query->where('client_id', $clientId);
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('locations/index', [
            'locations' => $locations,
            'search' => $request->search,
            'clientId' => $request->client_id,
            'clients' => Client::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('locations/create', [
            'clients' => Client::orderBy('name')->get(['id', 'name']),
            'selectedClientId' => $request->client_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'city' => 'required|string|max:255',
            'building_type' => 'required|in:kantoor,winkel,hotel,zorg,industrial,residential,overig',
            'notes' => 'nullable|string',
        ]);

        $location = Location::create($validated);

        return redirect()->route('locations.show', $location)
            ->with('success', 'Locatie aangemaakt.');
    }

    public function show(Location $location)
    {
        $location->load(['client', 'projects']);

        return Inertia::render('locations/show', [
            'location' => $location,
        ]);
    }

    public function edit(Location $location)
    {
        return Inertia::render('locations/edit', [
            'location' => $location,
            'clients' => Client::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'city' => 'required|string|max:255',
            'building_type' => 'required|in:kantoor,winkel,hotel,zorg,industrial,residential,overig',
            'notes' => 'nullable|string',
        ]);

        $location->update($validated);

        return redirect()->route('locations.show', $location)
            ->with('success', 'Locatie bijgewerkt.');
    }

    public function destroy(Location $location)
    {
        $clientId = $location->client_id;
        $location->delete();

        return redirect()->route('clients.show', $clientId)
            ->with('success', 'Locatie verwijderd.');
    }
}
