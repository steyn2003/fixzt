<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Offerte {{ $quote->quote_number }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1a1a1a;
        }
        .quote-title {
            font-size: 20px;
            margin-top: 10px;
            color: #666;
        }
        .quote-number {
            color: #888;
            font-size: 14px;
        }
        .meta-info {
            margin-top: 10px;
            color: #666;
        }
        .customer-section {
            margin: 30px 0;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
        }
        .customer-section h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .customer-section p {
            margin: 0;
            font-size: 13px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        td {
            border: 1px solid #ddd;
            padding: 10px 8px;
            vertical-align: top;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .totals-section {
            margin-top: 30px;
            page-break-inside: avoid;
        }
        .totals-table {
            width: 300px;
            margin-left: auto;
        }
        .totals-table td {
            border: none;
            padding: 8px 12px;
        }
        .totals-table .label {
            text-align: right;
            color: #666;
        }
        .totals-table .value {
            text-align: right;
            font-weight: 500;
        }
        .total-row td {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #333;
            padding-top: 12px;
        }
        .valid-until {
            margin-top: 30px;
            padding: 15px;
            background: #fff8e1;
            border-left: 4px solid #ffc107;
            font-style: italic;
        }
        .notes-section {
            margin-top: 30px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .notes-section h4 {
            margin: 0 0 10px 0;
            font-size: 13px;
            color: #666;
        }
        .notes-section p {
            margin: 0;
            white-space: pre-wrap;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #888;
            text-align: center;
        }
        .line-description {
            max-width: 250px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Fixzt</div>
        <div class="quote-title">OFFERTE</div>
        <div class="quote-number">{{ $quote->quote_number }}</div>
        <div class="meta-info">Datum: {{ $quote->created_at->format('d-m-Y') }}</div>
    </div>

    <div class="customer-section">
        <h3>Klantgegevens</h3>
        <p>
            <strong>{{ $quote->customer_name }}</strong><br>
            @if($quote->customer_address)
                {!! nl2br(e($quote->customer_address)) !!}<br>
            @endif
            @if($quote->customer_email)
                E-mail: {{ $quote->customer_email }}<br>
            @endif
            @if($quote->customer_phone)
                Tel: {{ $quote->customer_phone }}
            @endif
        </p>
    </div>

    <table>
        <thead>
            <tr>
                <th class="line-description">Omschrijving</th>
                <th class="text-center">Aantal</th>
                <th class="text-center">Eenheid</th>
                <th class="text-right">Prijs per eenheid</th>
                <th class="text-right">Totaal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quote->lines as $line)
            <tr>
                <td class="line-description">{{ $line->description }}</td>
                <td class="text-center">{{ number_format($line->quantity, 2, ',', '.') }}</td>
                <td class="text-center">{{ $line->unit ?? 'stuks' }}</td>
                <td class="text-right">&euro; {{ number_format($line->unit_price, 2, ',', '.') }}</td>
                <td class="text-right">&euro; {{ number_format($line->total, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <table class="totals-table">
            <tr class="total-row">
                <td class="label">Totaal (excl. BTW)</td>
                <td class="value">&euro; {{ number_format($totals['subtotal'], 2, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    @if($quote->valid_until)
    <div class="valid-until">
        <strong>Let op:</strong> Deze offerte is geldig tot {{ $quote->valid_until->format('d-m-Y') }}.
    </div>
    @endif

    @if($quote->notes)
    <div class="notes-section">
        <h4>Opmerkingen</h4>
        <p>{{ $quote->notes }}</p>
    </div>
    @endif

    <div class="footer">
        <p>Bedankt voor uw interesse in onze diensten. Neem gerust contact met ons op voor vragen of om deze offerte te bespreken.</p>
        <p>Fixzt - Professioneel Onderhoud &amp; Renovatie</p>
    </div>
</body>
</html>
