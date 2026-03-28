<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class PageContent extends Model
{
    protected $fillable = [
        'page',
        'section',
        'key',
        'type',
        'value',
        'sort_order',
    ];

    /**
     * Get all content for a page as a nested array: section.key => value
     * Cached for 1 hour, busted on save.
     */
    public static function getForPage(string $page): array
    {
        return Cache::remember("page_content.{$page}", 3600, function () use ($page) {
            $contents = static::where('page', $page)
                ->orderBy('section')
                ->orderBy('sort_order')
                ->get();

            $result = [];
            foreach ($contents as $content) {
                $result[$content->section][$content->key] = $content->value;
            }

            return $result;
        });
    }

    /**
     * Clear cache for a specific page or all pages.
     */
    public static function clearCache(?string $page = null): void
    {
        if ($page) {
            Cache::forget("page_content.{$page}");
        } else {
            foreach (['welcome', 'about', 'services'] as $p) {
                Cache::forget("page_content.{$p}");
            }
        }
    }
}
