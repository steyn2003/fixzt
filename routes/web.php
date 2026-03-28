<?php

use App\Http\Controllers\CalculationController;
use App\Http\Controllers\PageContentController;
use App\Http\Controllers\CalculationTemplateController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContactSubmissionController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\ProjectMaterialController;
use App\Http\Controllers\ProjectNoteController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\TimeEntryController;
use App\Http\Controllers\UserController;
use App\Models\ContactSubmission;
use App\Models\Project;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'content' => \App\Models\PageContent::getForPage('welcome'),
    ]);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about', [
        'content' => \App\Models\PageContent::getForPage('about'),
    ]);
})->name('about');

Route::get('/services', function () {
    return Inertia::render('services', [
        'content' => \App\Models\PageContent::getForPage('services'),
    ]);
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

    // Users
    Route::resource('dashboard/users', UserController::class)->names('users')->except(['show']);

    // Calculations (detailed breakdown with lines)
    Route::resource('dashboard/calculations', CalculationController::class)->names('calculations');
    Route::post('dashboard/calculations/extract', [CalculationController::class, 'extract'])->name('calculations.extract');
    Route::get('dashboard/calculations/extract/{extractionId}', [CalculationController::class, 'extractStatus'])->name('calculations.extract.status');
    Route::get('dashboard/calculations/{calculation}/pdf', [CalculationController::class, 'pdf'])->name('calculations.pdf');
    Route::post('dashboard/calculations/{calculation}/convert', [CalculationController::class, 'convert'])->name('calculations.convert');

    // Calculation Templates
    Route::resource('dashboard/calculation-templates', CalculationTemplateController::class)->names('calculation-templates')->except(['show']);

    // Page Content (CMS)
    Route::get('dashboard/content', [PageContentController::class, 'index'])->name('content.index');
    Route::put('dashboard/content', [PageContentController::class, 'update'])->name('content.update');
    Route::post('dashboard/content/upload', [PageContentController::class, 'uploadImage'])->name('content.upload');
    Route::post('dashboard/content/seed', [PageContentController::class, 'seed'])->name('content.seed');

    // Quotes (simple offer referencing a calculation)
    Route::resource('dashboard/quotes', QuoteController::class)->names('quotes');
    Route::get('dashboard/quotes/{quote}/pdf', [QuoteController::class, 'pdf'])->name('quotes.pdf');
});

require __DIR__.'/settings.php';
