<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContactSubmissionController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\ProjectMaterialController;
use App\Http\Controllers\ProjectNoteController;
use App\Http\Controllers\TimeEntryController;
use App\Models\ContactSubmission;
use App\Models\Project;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

// Public contact form submission
Route::post('/contact', [ContactSubmissionController::class, 'store'])->name('contact.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'contactStats' => [
                'total' => ContactSubmission::count(),
                'new' => ContactSubmission::where('status', 'new')->count(),
            ],
            'recentContacts' => ContactSubmission::latest()->take(5)->get(['id', 'name', 'subject', 'status', 'created_at']),
            'projectStats' => [
                'total' => Project::count(),
                'active' => Project::whereIn('status', ['approved', 'in_progress'])->count(),
            ],
            'recentProjects' => Project::with('location.client')
                ->latest()
                ->take(5)
                ->get(['id', 'title', 'status', 'location_id', 'created_at']),
        ]);
    })->name('dashboard');

    // Contact submissions admin routes
    Route::get('dashboard/contacts', [ContactSubmissionController::class, 'index'])->name('contacts.index');
    Route::get('dashboard/contacts/{contactSubmission}', [ContactSubmissionController::class, 'show'])->name('contacts.show');
    Route::patch('dashboard/contacts/{contactSubmission}', [ContactSubmissionController::class, 'update'])->name('contacts.update');
    Route::delete('dashboard/contacts/{contactSubmission}', [ContactSubmissionController::class, 'destroy'])->name('contacts.destroy');

    // Clients
    Route::resource('dashboard/clients', ClientController::class)->names('clients');

    // Locations
    Route::resource('dashboard/locations', LocationController::class)->names('locations');

    // Projects
    Route::resource('dashboard/projects', ProjectController::class)->names('projects');

    // Time Entries (nested under projects)
    Route::post('dashboard/projects/{project}/time-entries', [TimeEntryController::class, 'store'])->name('time-entries.store');
    Route::put('dashboard/projects/{project}/time-entries/{timeEntry}', [TimeEntryController::class, 'update'])->name('time-entries.update');
    Route::delete('dashboard/projects/{project}/time-entries/{timeEntry}', [TimeEntryController::class, 'destroy'])->name('time-entries.destroy');

    // Materials (nested under projects)
    Route::post('dashboard/projects/{project}/materials', [ProjectMaterialController::class, 'store'])->name('materials.store');
    Route::put('dashboard/projects/{project}/materials/{material}', [ProjectMaterialController::class, 'update'])->name('materials.update');
    Route::delete('dashboard/projects/{project}/materials/{material}', [ProjectMaterialController::class, 'destroy'])->name('materials.destroy');

    // Notes (nested under projects)
    Route::post('dashboard/projects/{project}/notes', [ProjectNoteController::class, 'store'])->name('notes.store');
    Route::delete('dashboard/projects/{project}/notes/{note}', [ProjectNoteController::class, 'destroy'])->name('notes.destroy');

    // Files (nested under projects)
    Route::post('dashboard/projects/{project}/files', [ProjectFileController::class, 'store'])->name('files.store');
    Route::delete('dashboard/projects/{project}/files/{file}', [ProjectFileController::class, 'destroy'])->name('files.destroy');
});

require __DIR__.'/settings.php';
