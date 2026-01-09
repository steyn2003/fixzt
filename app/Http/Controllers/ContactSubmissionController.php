<?php

namespace App\Http\Controllers;

use App\Mail\NewContactSubmission;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactSubmissionController extends Controller
{
    /**
     * Store a new contact submission (public)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $submission = ContactSubmission::create($validated);

        // Send email notification to admin
        $adminEmail = config('mail.admin_address', config('mail.from.address'));
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new NewContactSubmission($submission));
        }

        return back()->with('success', 'Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.');
    }

    /**
     * Display list of contact submissions (admin)
     */
    public function index(Request $request)
    {
        $status = $request->get('status');

        $query = ContactSubmission::query()
            ->orderByRaw("CASE WHEN status = 'new' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['new', 'read', 'replied', 'archived'])) {
            $query->where('status', $status);
        }

        $submissions = $query->paginate(20);

        $counts = [
            'all' => ContactSubmission::count(),
            'new' => ContactSubmission::where('status', 'new')->count(),
            'read' => ContactSubmission::where('status', 'read')->count(),
            'replied' => ContactSubmission::where('status', 'replied')->count(),
            'archived' => ContactSubmission::where('status', 'archived')->count(),
        ];

        return Inertia::render('contacts/index', [
            'submissions' => $submissions,
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Display a single contact submission (admin)
     */
    public function show(ContactSubmission $contactSubmission)
    {
        // Mark as read when viewed
        $contactSubmission->markAsRead();

        return Inertia::render('contacts/show', [
            'submission' => $contactSubmission,
        ]);
    }

    /**
     * Update contact submission (admin) - status and notes
     */
    public function update(Request $request, ContactSubmission $contactSubmission)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:new,read,replied,archived',
            'notes' => 'sometimes|nullable|string|max:5000',
        ]);

        $contactSubmission->update($validated);

        return back()->with('success', 'Contact bijgewerkt.');
    }

    /**
     * Delete contact submission (admin)
     */
    public function destroy(ContactSubmission $contactSubmission)
    {
        $contactSubmission->delete();

        return redirect()->route('contacts.index')->with('success', 'Contact verwijderd.');
    }
}
