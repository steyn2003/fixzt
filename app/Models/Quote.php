<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    protected $fillable = [
        'quote_number',
        'client_id',
        'location_id',
        'project_id',
        'template_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'markup_percentage',
        'notes',
        'valid_until',
        'converted_at',
    ];

    protected $casts = [
        'markup_percentage' => 'decimal:2',
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
        $lastQuote = self::whereYear('created_at', $year)
            ->orderByDesc('id')
            ->first();

        $sequence = $lastQuote ? ((int) substr($lastQuote->quote_number, -4)) + 1 : 1;

        return sprintf('Q%s-%04d', $year, $sequence);
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

    public function template(): BelongsTo
    {
        return $this->belongsTo(QuoteTemplate::class, 'template_id');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(QuoteLine::class)->orderBy('sort_order');
    }

    public function getSubtotalAttribute(): float
    {
        return $this->lines->sum('total');
    }

    public function getTotalCostAttribute(): float
    {
        return $this->lines->sum(fn ($line) => $line->quantity * $line->unit_cost);
    }

    public function getTotalMarkupAttribute(): float
    {
        return $this->subtotal - $this->total_cost;
    }
}
