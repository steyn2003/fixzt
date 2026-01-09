<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActivityType extends Model
{
    protected $fillable = [
        'name',
        'default_hourly_rate',
        'is_active',
    ];

    protected $casts = [
        'default_hourly_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }
}
