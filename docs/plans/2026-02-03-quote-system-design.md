# Quote System Design

## Overview

A quote markup system that extracts line items from supplier invoices (PDF/Excel), applies configurable markup percentages, and generates professional quote PDFs for customers. Quotes can optionally be converted into projects.

## Core Workflow

1. Upload supplier invoice (PDF/Excel)
2. AI extracts line items and prices using Neuron AI (Claude)
3. Apply markup percentage (global or per-line)
4. Review and edit extracted lines
5. Generate professional quote PDF using templates
6. Optionally convert accepted quote to project

## Data Model

### `quote_templates` table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Template name |
| description | text, nullable | Template description |
| content | text | Blade template content or config |
| is_default | boolean | Default template flag |
| timestamps | | created_at, updated_at |

### `quotes` table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| quote_number | string, unique | Auto-generated quote number |
| client_id | foreignId, nullable | Link to existing client |
| location_id | foreignId, nullable | Link to existing location |
| project_id | foreignId, nullable | Link to project after conversion |
| template_id | foreignId | Quote template to use |
| customer_name | string | Customer/lead name |
| customer_email | string, nullable | Customer email |
| customer_phone | string, nullable | Customer phone |
| customer_address | text, nullable | Customer address |
| markup_percentage | decimal(5,2) | Default markup % |
| notes | text, nullable | Internal notes |
| valid_until | date, nullable | Quote validity date |
| converted_at | timestamp, nullable | When converted to project |
| timestamps | | created_at, updated_at |

### `quote_lines` table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| quote_id | foreignId | Parent quote |
| description | string | Line item description |
| quantity | decimal(10,2) | Quantity |
| unit | string, nullable | Unit (pcs, m², hours, etc.) |
| unit_cost | decimal(10,2) | Original supplier price |
| markup_percentage | decimal(5,2) | Line-specific markup |
| unit_price | decimal(10,2) | Calculated: cost + markup |
| total | decimal(10,2) | Calculated: qty × unit_price |
| sort_order | integer | Display order |
| timestamps | | created_at, updated_at |

## Model Relationships

```
Quote
├── belongsTo Client (optional)
├── belongsTo Location (optional)
├── belongsTo QuoteTemplate
├── belongsTo Project (after conversion)
└── hasMany QuoteLines

QuoteTemplate
└── hasMany Quotes

QuoteLine
└── belongsTo Quote
```

## AI Integration

### Package
- `neuron-core/neuron-ai` - Laravel AI agent framework

### Provider
- Anthropic Claude (configured via .env)

### QuoteExtractionAgent

Agent responsible for extracting line items from uploaded files.

**Input:** Raw text content from PDF or parsed Excel data

**Output:** Structured JSON array of line items:
```json
[
  {
    "description": "Item description",
    "quantity": 10,
    "unit": "pcs",
    "unit_price": 25.00
  }
]
```

**Processing Flow:**
1. User uploads PDF or Excel file
2. System detects file type
3. PDF: Extract text using pdf parser
4. Excel: Parse rows/columns
5. Send content to QuoteExtractionAgent
6. AI identifies and structures line items
7. Return to frontend for review/editing

## Quote to Project Conversion

When user clicks "Convert to Project":

1. If `client_id` is null:
   - Create new Client from customer_name, customer_email, customer_phone
   
2. If `location_id` is null:
   - Create new Location under the client with customer_address
   
3. Create Project:
   - `title`: From user input or quote_number
   - `location_id`: From quote or newly created
   - `quoted_price`: Quote total
   - `status`: 'pending' or user-selected
   
4. Update Quote:
   - Set `project_id` to new project
   - Set `converted_at` to now

## Admin Pages

### Routes

```
GET    /dashboard/quotes                  quotes.index
GET    /dashboard/quotes/create           quotes.create
POST   /dashboard/quotes                  quotes.store
GET    /dashboard/quotes/{quote}          quotes.show
GET    /dashboard/quotes/{quote}/edit     quotes.edit
PUT    /dashboard/quotes/{quote}          quotes.update
DELETE /dashboard/quotes/{quote}          quotes.destroy
POST   /dashboard/quotes/{quote}/extract  quotes.extract
GET    /dashboard/quotes/{quote}/pdf      quotes.pdf
POST   /dashboard/quotes/{quote}/convert  quotes.convert

GET    /dashboard/quote-templates                     quote-templates.index
GET    /dashboard/quote-templates/create              quote-templates.create
POST   /dashboard/quote-templates                     quote-templates.store
GET    /dashboard/quote-templates/{template}/edit     quote-templates.edit
PUT    /dashboard/quote-templates/{template}          quote-templates.update
DELETE /dashboard/quote-templates/{template}          quote-templates.destroy
```

### UI Pages

**Quotes Index** (`/dashboard/quotes`)
- List all quotes: quote number, customer name, total, template, date
- Search by customer name or quote number
- "New Quote" button

**Create Quote** (`/dashboard/quotes/create`)
- Basic info: client/location selection OR new customer details
- Template selection
- Default markup percentage
- Valid until date
- File upload with "Extract Lines" button
- Editable line items table
- Running totals display

**Show Quote** (`/dashboard/quotes/{quote}`)
- Full quote details
- Line items table with costs and markup
- Actions: Download PDF, Edit, Convert to Project, Delete

**Edit Quote** (`/dashboard/quotes/{quote}/edit`)
- Same as create, pre-filled with existing data

**Quote Templates** (`/dashboard/quote-templates`)
- Simple CRUD list
- Name, description, default toggle
- Create/edit with template content editor

## File Structure

### Backend

```
app/
├── Models/
│   ├── Quote.php
│   ├── QuoteLine.php
│   └── QuoteTemplate.php
├── Http/Controllers/
│   ├── QuoteController.php
│   └── QuoteTemplateController.php
├── Agents/
│   └── QuoteExtractionAgent.php
└── Services/
    └── QuotePdfService.php

database/migrations/
├── YYYY_MM_DD_000001_create_quote_templates_table.php
├── YYYY_MM_DD_000002_create_quotes_table.php
└── YYYY_MM_DD_000003_create_quote_lines_table.php
```

### Frontend

```
resources/js/pages/
├── quotes/
│   ├── index.tsx
│   ├── create.tsx
│   ├── show.tsx
│   └── edit.tsx
└── quote-templates/
    ├── index.tsx
    ├── create.tsx
    └── edit.tsx

resources/js/types/index.d.ts (extend with Quote types)
```

### PDF Templates

```
resources/views/quotes/
└── templates/
    ├── default.blade.php
    └── (additional templates)
```

## Environment Configuration

```env
# Neuron AI - Anthropic Claude
ANTHROPIC_API_KEY=your-api-key
```

## Dependencies

- `neuron-core/neuron-ai` - AI agent framework
- `barryvdh/laravel-dompdf` or `spatie/laravel-pdf` - PDF generation
- `smalot/pdfparser` or similar - PDF text extraction
- `phpoffice/phpspreadsheet` - Excel parsing
