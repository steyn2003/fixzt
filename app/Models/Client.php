<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'name',
        'contact_person',
        'email',
        'phone',
        'notes',
    ];

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function projects(): HasMany
    {
        return $this->hasManyThrough(Project::class, Location::class);
    }
}
