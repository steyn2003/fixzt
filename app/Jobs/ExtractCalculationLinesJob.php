<?php

namespace App\Jobs;

use App\Agents\QuoteExtractionAgent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use NeuronAI\Chat\Messages\UserMessage;

class ExtractCalculationLinesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    public function __construct(
        public string $extractionId,
        public string $content,
    ) {}

    public function handle(): void
    {
        try {
            $agent = new QuoteExtractionAgent;
            $response = $agent->chat(new UserMessage($this->content));

            $lines = json_decode($response->getContent(), true);

            if (! is_array($lines)) {
                Cache::put("calculation_extraction:{$this->extractionId}", [
                    'status' => 'completed',
                    'lines' => [],
                    'message' => 'Kon geen regels extraheren uit het bestand.',
                ], now()->addMinutes(10));
                return;
            }

            Cache::put("calculation_extraction:{$this->extractionId}", [
                'status' => 'completed',
                'lines' => $lines,
            ], now()->addMinutes(10));
        } catch (\Throwable $e) {
            Cache::put("calculation_extraction:{$this->extractionId}", [
                'status' => 'failed',
                'lines' => [],
                'message' => 'Er is een fout opgetreden: ' . $e->getMessage(),
            ], now()->addMinutes(10));
        }
    }
}
