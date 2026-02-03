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
        'title',
        'description',
        'notes',
        'valid_until',
    ];

    protected $casts = [
        'valid_until' => 'date',
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

        return sprintf('OFF%s-%04d', $year, $sequence);
    }

    public function calculation(): BelongsTo
    {
        return $this->belongsTo(Calculation::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->calculation?->subtotal ?? 0;
    }
}
