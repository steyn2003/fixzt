<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalculationLine extends Model
{
    protected $fillable = [
        'calculation_id',
        'description',
        'quantity',
        'unit',
        'unit_cost',
        'markup_percentage',
        'unit_price',
        'total',
        'sort_order',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'markup_percentage' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function (CalculationLine $line) {
            $line->unit_price = $line->unit_cost * (1 + $line->markup_percentage / 100);
            $line->total = $line->quantity * $line->unit_price;
        });
    }

    public function calculation(): BelongsTo
    {
        return $this->belongsTo(Calculation::class);
    }
}
