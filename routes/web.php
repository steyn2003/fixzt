<?php

use App\Http\Controllers\ContactSubmissionController;
use App\Models\ContactSubmission;
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
        ]);
    })->name('dashboard');

    // Contact submissions admin routes
    Route::get('dashboard/contacts', [ContactSubmissionController::class, 'index'])->name('contacts.index');
    Route::get('dashboard/contacts/{contactSubmission}', [ContactSubmissionController::class, 'show'])->name('contacts.show');
    Route::patch('dashboard/contacts/{contactSubmission}', [ContactSubmissionController::class, 'update'])->name('contacts.update');
    Route::delete('dashboard/contacts/{contactSubmission}', [ContactSubmissionController::class, 'destroy'])->name('contacts.destroy');
});

require __DIR__.'/settings.php';
