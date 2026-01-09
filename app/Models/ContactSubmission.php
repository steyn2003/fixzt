<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'notes',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    /**
     * Scope for filtering by status
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for new (unread) submissions
     */
    public function scopeUnread($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Mark as read
     */
    public function markAsRead(): void
    {
        if ($this->status === 'new') {
            $this->update([
                'status' => 'read',
                'read_at' => now(),
            ]);
        }
    }
}
