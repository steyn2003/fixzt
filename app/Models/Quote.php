<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quote extends Model
{
    protected $fillable = [
        'quote_number',
        'calculation_id',
        'client_id',
        'location_id',
        'project_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'description',
        'notes',
        'valid_until',
        'converted_at',
    ];

    protected $casts = [
        'valid_until' => 'date',
        'converted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Quote $quote) {
            if (empty($quote->quote_number)) {
                $quote->quote_number = self::generateQuoteNumber();
            }
        });
    }

    public static function generateQuoteNumber(): string
    {
        $year = date('Y');
        $last = self::whereYear('created_at', $year)
            ->orderByDesc('id')
            ->first();

        $sequence = $last ? ((int) substr($last->quote_number, -4)) + 1 : 1;

        return sprintf('Q%s-%04d', $year, $sequence);
    }

    public function calculation(): BelongsTo
    {
        return $this->belongsTo(Calculation::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->calculation?->subtotal ?? 0;
    }
}
