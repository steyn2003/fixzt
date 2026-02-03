<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CalculationTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'content',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function calculations(): HasMany
    {
        return $this->hasMany(Calculation::class, 'template_id');
    }
}
