<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Calculation extends Model
{
    protected $fillable = [
        'calculation_number',
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
        static::creating(function (Calculation $calculation) {
            if (empty($calculation->calculation_number)) {
                $calculation->calculation_number = self::generateCalculationNumber();
            }
        });
    }

    public static function generateCalculationNumber(): string
    {
        $year = date('Y');
        $last = self::whereYear('created_at', $year)
            ->orderByDesc('id')
            ->first();

        $sequence = $last ? ((int) substr($last->calculation_number, -4)) + 1 : 1;

        return sprintf('C%s-%04d', $year, $sequence);
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
        return $this->belongsTo(CalculationTemplate::class, 'template_id');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(CalculationLine::class)->orderBy('sort_order');
    }

    public function quote(): HasOne
    {
        return $this->hasOne(Quote::class);
    }

    public function getLinesSubtotalAttribute(): float
    {
        return $this->lines->sum('total');
    }

    public function getProjectManagementFeeAttribute(): float
    {
        return $this->lines_subtotal * 0.06; // 6% project management fee
    }

    public function getWinstRisicoFeeAttribute(): float
    {
        return $this->lines_subtotal * 0.03; // 3% winst & risico
    }

    public function getSubtotalAttribute(): float
    {
        return $this->lines_subtotal + $this->project_management_fee + $this->winst_risico_fee;
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
