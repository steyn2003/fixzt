<?php

namespace App\Agents;

use NeuronAI\Agent;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\Anthropic\Anthropic;

class QuoteExtractionAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        return new Anthropic(
            key: config('services.anthropic.api_key'),
            model: 'claude-sonnet-4-20250514',
        );
    }

    public function instructions(): string
    {
        return <<<'PROMPT'
You are an invoice/quote line item extraction specialist. Your task is to extract line items from supplier invoices, price lists, or quotes.

Given the raw text content from a document, identify and extract all line items with their:
- description: The item/service description
- quantity: The quantity (default to 1 if not specified)
- unit: The unit of measurement (e.g., pcs, m², hours, kg, stuks, meter, liter)
- unit_price: The unit price/cost (numeric value only, no currency symbols)

Return ONLY a valid JSON array of objects. Do not include any explanation or markdown formatting.

Example output:
[
  {"description": "Labor - Installation", "quantity": 8, "unit": "hours", "unit_price": 45.00},
  {"description": "PVC Pipe 50mm", "quantity": 10, "unit": "meter", "unit_price": 3.50}
]

Rules:
- Extract ALL line items you can identify
- If quantity is not specified, use 1
- If unit is not specified, use "stuks" (pieces)
- Convert all prices to numeric values (remove currency symbols)
- Use Dutch unit names when appropriate (stuks, meter, uur, etc.)
- If you cannot identify any line items, return an empty array: []
PROMPT;
    }
}
