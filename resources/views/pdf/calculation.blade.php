@php
    $logoPath = public_path('images/pdf/logo.png');
    $logoBase64 = '';
    if (file_exists($logoPath)) {
        $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
    }
@endphp
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Calculatie {{ $calculation->calculation_number }}</title>
    <style>
        @page {
            margin: 60px 60px;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            color: #333;
        }
        .page-wrapper {
            padding: 30px;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 25px;
            border-bottom: 2px solid #8B7355;
            padding-bottom: 15px;
        }
        .header-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .header-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }
        .header-logo {
            height: 50px;
            width: auto;
        }
        .logo-text {
            font-size: 24pt;
            font-weight: bold;
            color: #8B7355;
            letter-spacing: 2px;
        }
        .logo-tagline {
            font-size: 7pt;
            color: #8B7355;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .document-title {
            font-size: 16pt;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .document-number {
            font-size: 11pt;
            color: #8B7355;
        }
        .info-section {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .info-block {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .info-label {
            font-size: 8pt;
            color: #8B7355;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .info-content {
            font-size: 9pt;
        }
        .info-content strong {
            font-size: 10pt;
        }
        .meta-row {
            display: table;
            width: 100%;
            margin-bottom: 3px;
        }
        .meta-label {
            display: table-cell;
            width: 80px;
            color: #666;
            font-size: 8pt;
        }
        .meta-value {
            display: table-cell;
            font-size: 9pt;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .items-table th {
            background-color: #8B7355;
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-size: 8pt;
            font-weight: normal;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .items-table th.right {
            text-align: right;
        }
        .items-table td {
            padding: 6px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 8pt;
            vertical-align: top;
        }
        .items-table td.right {
            text-align: right;
        }
        .items-table tr:nth-child(even) {
            background-color: #fafafa;
        }
        .totals-section {
            width: 280px;
            margin-left: auto;
            margin-top: 15px;
        }
        .total-row {
            display: table;
            width: 100%;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .total-row.subtotal {
            border-bottom: none;
            background-color: #f5f5f5;
            padding: 8px;
        }
        .total-row.grand {
            border-bottom: none;
            border-top: 2px solid #8B7355;
            padding-top: 10px;
            font-size: 12pt;
            font-weight: bold;
        }
        .total-label {
            display: table-cell;
            width: 60%;
        }
        .total-value {
            display: table-cell;
            width: 40%;
            text-align: right;
        }
        .notes-section {
            margin-top: 25px;
            padding: 15px;
            background-color: #fef9e7;
            border-left: 3px solid #C4B078;
        }
        .notes-title {
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 8px;
            color: #8B7355;
        }
        .validity-section {
            margin-top: 20px;
            padding: 12px;
            background-color: #f0f0f0;
            text-align: center;
            font-size: 9pt;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        }
        .footer-logo {
            font-size: 12pt;
            font-weight: bold;
            color: #8B7355;
            letter-spacing: 2px;
        }
        .footer-tagline {
            font-size: 6pt;
            color: #8B7355;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .footer-info {
            margin-top: 8px;
            font-size: 7pt;
            color: #666;
        }
    </style>
</head>
<body>
<div class="page-wrapper">
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <div class="document-title">CALCULATIE</div>
            <div class="document-number">{{ $calculation->calculation_number }}</div>
        </div>
        <div class="header-right">
            @if($logoBase64)
                <img src="{{ $logoBase64 }}" alt="FIXZT" class="header-logo">
            @else
                <div class="logo-text">FIXZT</div>
                <div class="logo-tagline">VASTGOEDSERVICE</div>
            @endif
        </div>
    </div>

    <!-- Info section -->
    <div class="info-section">
        <div class="info-block">
            <div class="info-label">Klant</div>
            <div class="info-content">
                <strong>{{ $calculation->customer_name }}</strong><br>
                @if($calculation->customer_address)
                    {!! nl2br(e($calculation->customer_address)) !!}<br>
                @endif
                @if($calculation->customer_email)
                    {{ $calculation->customer_email }}<br>
                @endif
                @if($calculation->customer_phone)
                    {{ $calculation->customer_phone }}
                @endif
            </div>
        </div>
        <div class="info-block">
            <div class="info-label">Details</div>
            <div class="info-content">
                <div class="meta-row">
                    <div class="meta-label">Datum:</div>
                    <div class="meta-value">{{ $calculation->created_at->format('d-m-Y') }}</div>
                </div>
                @if($calculation->valid_until)
                <div class="meta-row">
                    <div class="meta-label">Geldig tot:</div>
                    <div class="meta-value">{{ \Carbon\Carbon::parse($calculation->valid_until)->format('d-m-Y') }}</div>
                </div>
                @endif
            </div>
        </div>
    </div>

    <!-- Items table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 40%;">Omschrijving</th>
                <th class="right" style="width: 10%;">Aantal</th>
                <th style="width: 10%;">Eenheid</th>
                <th class="right" style="width: 10%;">Prijs</th>
                <th class="right" style="width: 10%;">Totaal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($calculation->lines as $line)
            <tr>
                <td>{{ $line->description }}</td>
                <td class="right">{{ number_format($line->quantity, 2, ',', '.') }}</td>
                <td>{{ $line->unit ?? 'stuks' }}</td>
                <td class="right">&euro; {{ number_format($line->unit_price, 2, ',', '.') }}</td>
                <td class="right">&euro; {{ number_format($line->total, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totals -->
    <div class="totals-section">
        <div class="total-row">
            <div class="total-label">Subtotaal materialen & arbeid</div>
            <div class="total-value">&euro; {{ number_format($totals['lines_subtotal'], 2, ',', '.') }}</div>
        </div>
        <div class="total-row">
            <div class="total-label">Projectmanagement 6%</div>
            <div class="total-value">&euro; {{ number_format($totals['project_management_fee'], 2, ',', '.') }}</div>
        </div>
        <div class="total-row">
            <div class="total-label">Winst & Risico 3%</div>
            <div class="total-value">&euro; {{ number_format($totals['winst_risico_fee'], 2, ',', '.') }}</div>
        </div>
        <div class="total-row subtotal">
            <div class="total-label"><strong>Subtotaal excl. BTW</strong></div>
            <div class="total-value"><strong>&euro; {{ number_format($totals['subtotal'], 2, ',', '.') }}</strong></div>
        </div>
        <div class="total-row">
            <div class="total-label">BTW 21%</div>
            <div class="total-value">&euro; {{ number_format($totals['subtotal'] * 0.21, 2, ',', '.') }}</div>
        </div>
        <div class="total-row grand">
            <div class="total-label">Totaal incl. BTW</div>
            <div class="total-value" style="color: #8B7355;">&euro; {{ number_format($totals['subtotal'] * 1.21, 2, ',', '.') }}</div>
        </div>
    </div>

    @if($calculation->valid_until)
    <div class="validity-section">
        <strong>Deze calculatie is geldig tot {{ \Carbon\Carbon::parse($calculation->valid_until)->locale('nl')->isoFormat('D MMMM YYYY') }}</strong>
    </div>
    @endif

    @if($calculation->notes)
    <div class="notes-section">
        <div class="notes-title">Opmerkingen</div>
        {!! nl2br(e($calculation->notes)) !!}
    </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        @if($logoBase64)
            <img src="{{ $logoBase64 }}" alt="FIXZT" style="height: 35px; width: auto; margin-bottom: 8px;">
        @else
            <div class="footer-logo">FIXZT</div>
            <div class="footer-tagline">VASTGOEDSERVICE</div>
        @endif
        <div class="footer-info">
            Velperplein 23-25, 6811 AH Arnhem | KvK 95897755 | BTW NL 867380354B01 | IBAN NL84 RABO 0388 9563 21
        </div>
    </div>
</div>
</body>
</html>
