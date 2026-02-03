<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteTemplate extends Model
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

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class, 'template_id');
    }
}
