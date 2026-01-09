<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'location_id',
        'title',
        'description',
        'type',
        'status',
        'quoted_price',
        'start_date',
        'due_date',
    ];

    protected $casts = [
        'quoted_price' => 'decimal:2',
        'start_date' => 'date',
        'due_date' => 'date',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function client(): BelongsTo
    {
        return $this->location->client();
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(ProjectMaterial::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(ProjectNote::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(ProjectFile::class);
    }

    public function getLaborCostAttribute(): float
    {
        return $this->timeEntries->sum(function ($entry) {
            return $entry->hours * $entry->hourly_rate;
        });
    }

    public function getMaterialCostAttribute(): float
    {
        return $this->materials->sum('total_cost');
    }

    public function getActualCostAttribute(): float
    {
        return $this->labor_cost + $this->material_cost;
    }

    public function getProfitMarginAttribute(): ?float
    {
        if (!$this->quoted_price) {
            return null;
        }
        return $this->quoted_price - $this->actual_cost;
    }
}
