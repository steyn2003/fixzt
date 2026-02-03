<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Offerte {{ $quote->quote_number }}</title>
    <style>
        @page {
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #333;
        }

        /* Cover Page Styles */
        .cover-page {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 750px;
            page-break-after: always;
        }
        .cover-logo {
            position: absolute;
            top: 30px;
            right: 40px;
            width: 180px;
        }
        .cover-logo img {
            width: 100%;
            height: auto;
        }
        .cover-title-block {
            position: absolute;
            top: 150px;
            left: 0;
            width: 300px;
            background-color: #C4B078;
            padding: 40px 35px;
            min-height: 160px;
            z-index: 10;
        }
        .cover-label {
            font-size: 18pt;
            color: #333;
            margin-bottom: 12px;
        }
        .cover-title {
            font-size: 13pt;
            color: #333;
            line-height: 1.4;
        }
        .cover-image {
            position: absolute;
            top: 100px;
            left: 160px;
            right: 0;
            height: 520px;
            overflow: hidden;
        }
        .cover-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Content Page Styles */
        .content-page {
            padding: 40px 50px;
            page-break-after: always;
        }
        .content-page:last-child {
            page-break-after: auto;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 25px;
        }
        .header-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            font-size: 9pt;
        }
        .header-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
            font-size: 9pt;
        }
        .company-name {
            font-weight: bold;
            color: #8B7355;
        }
        .customer-name {
            font-weight: bold;
            margin-bottom: 3px;
        }
        .meta-section {
            margin: 25px 0;
            font-size: 9pt;
        }
        .meta-row {
            display: table;
            width: 100%;
            margin-bottom: 2px;
        }
        .meta-label {
            display: table-cell;
            width: 80px;
            color: #666;
            font-style: italic;
        }
        .meta-value {
            display: table-cell;
        }
        .greeting {
            margin: 20px 0;
            font-size: 10pt;
        }
        .section-title {
            font-size: 11pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
            color: #333;
        }
        .section-content {
            text-align: justify;
            margin-bottom: 12px;
            font-size: 9pt;
        }
        .bullet-list {
            margin: 8px 0 8px 20px;
            font-size: 9pt;
        }
        .bullet-list li {
            margin-bottom: 4px;
        }
        .price-section {
            margin: 25px 0;
            padding: 15px 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #8B7355;
        }
        .price-amount {
            font-size: 14pt;
            font-weight: bold;
            color: #8B7355;
        }
        .price-words {
            font-style: italic;
            color: #666;
            font-size: 9pt;
        }
        .signature-section {
            margin-top: 35px;
            display: table;
            width: 100%;
        }
        .signature-block {
            display: table-cell;
            width: 45%;
            vertical-align: top;
        }
        .signature-block-spacer {
            display: table-cell;
            width: 10%;
        }
        .signature-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 10pt;
        }
        .signature-line {
            border-bottom: 1px solid #333;
            margin: 25px 0 5px 0;
            width: 180px;
        }
        .signature-label {
            font-size: 8pt;
            color: #666;
        }
        .page-footer {
            position: fixed;
            bottom: 25px;
            left: 0;
            right: 0;
            text-align: center;
        }
        .page-footer img {
            height: 40px;
            width: auto;
        }
    </style>
</head>
<body>
    @php
        $customerName = $quote->client?->name ?? $quote->calculation?->customer_name ?? '-';
        $customerAddress = $quote->calculation?->customer_address ?? '';
        $contactPerson = $quote->client?->contact_person ?? '';
        $subtotal = $quote->calculation?->subtotal ?? 0;

        // Convert number to Dutch words
        function convertHundreds($num, $ones, $tens) {
            $result = '';
            if ($num >= 100) {
                $h = intval($num / 100);
                $result .= ($h == 1 ? '' : $ones[$h]) . 'honderd';
                $num = $num % 100;
            }
            if ($num > 0) {
                if ($num < 20) {
                    $result .= $ones[$num];
                } else {
                    $t = intval($num / 10);
                    $o = $num % 10;
                    if ($o > 0) {
                        $result .= $ones[$o] . 'en' . $tens[$t];
                    } else {
                        $result .= $tens[$t];
                    }
                }
            }
            return $result;
        }

        function numberToWords($number) {
            $ones = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
            $tens = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];

            $intPart = intval($number);
            $cents = round(($number - $intPart) * 100);

            if ($intPart == 0) return 'Nul Euro';

            $words = '';

            // Thousands
            if ($intPart >= 1000) {
                $thousands = intval($intPart / 1000);
                if ($thousands == 1) {
                    $words .= 'duizend';
                } else {
                    $words .= convertHundreds($thousands, $ones, $tens) . 'duizend';
                }
                $intPart = $intPart % 1000;
            }

            // Remaining hundreds, tens, ones
            if ($intPart > 0) {
                $words .= convertHundreds($intPart, $ones, $tens);
            }

            $words .= ' Euro';
            if ($cents > 0) {
                $words .= ' en ' . $cents . ' cent';
            }

            return ucfirst($words);
        }

        $priceInWords = numberToWords($subtotal);
        $logoPath = public_path('images/pdf/logo.png');
        $coverImagePath = public_path('images/pdf/cover-image.webp');
    @endphp

    <!-- Cover Page -->
    <div class="cover-page">
        <!-- Logo top right -->
        <div class="cover-logo">
            @if(file_exists($logoPath))
                <img src="{{ $logoPath }}" alt="FIXZT">
            @else
                <div style="font-size: 24pt; font-weight: bold; color: #8B7355; letter-spacing: 3px;">FIXZT</div>
                <div style="font-size: 7pt; color: #8B7355; letter-spacing: 1px;">VASTGOEDSERVICE</div>
            @endif
        </div>

        <!-- Title block with olive/gold background -->
        <div class="cover-title-block">
            <div class="cover-label">Offerte</div>
            <div class="cover-title">
                @if($quote->title)
                    {{ $quote->title }}
                @else
                    {{ $quote->description }}
                @endif
            </div>
        </div>

        <!-- Cover image -->
        <div class="cover-image">
            @if(file_exists($coverImagePath))
                <img src="{{ $coverImagePath }}" alt="Cover">
            @endif
        </div>
    </div>

    <!-- Content Page -->
    <div class="content-page">
        <!-- Header with addresses -->
        <div class="header">
            <div class="header-left">
                <div class="customer-name">{{ $customerName }}</div>
                @if($contactPerson)
                    <div>t.a.v. {{ $contactPerson }}</div>
                @endif
                @if($customerAddress)
                    {!! nl2br(e($customerAddress)) !!}
                @endif
            </div>
            <div class="header-right">
                <div class="company-name">FIXZT B.V.</div>
                <div>Velperplein 23-25</div>
                <div>6811 AH Arnhem</div>
                <div>KvK 95897755</div>
                <div>IBAN NL84 RABO 0388 9563 21</div>
                <div>BTW NL 867380354B01</div>
            </div>
        </div>

        <!-- Meta information -->
        <div class="meta-section">
            <div class="meta-row">
                <div class="meta-label">Ons kenmerk:</div>
                <div class="meta-value">{{ $quote->quote_number }}</div>
            </div>
            <div class="meta-row">
                <div class="meta-label">Onderwerp:</div>
                <div class="meta-value">{{ $quote->title ?? $quote->description }}</div>
            </div>
            <div class="meta-row">
                <div class="meta-label">Datum:</div>
                <div class="meta-value">{{ $quote->created_at->locale('nl')->isoFormat('dddd D MMMM YYYY') }}</div>
            </div>
            <div class="meta-row">
                <div class="meta-label">Contact:</div>
                <div class="meta-value">Fixzt B.V.</div>
            </div>
            <div class="meta-row">
                <div class="meta-label">E-mail:</div>
                <div class="meta-value">info@fixzt.nl</div>
            </div>
        </div>

        <!-- Greeting -->
        <div class="greeting">
            <p>Geachte heer/mevrouw,</p>
            <p style="margin-top: 8px;">
                Ik dank u voor uw offerteaanvraag. Hierbij ontvangt u onze offerte voor {{ strtolower($quote->title ?? $quote->description) }}.
            </p>
        </div>

        <!-- Work description reference -->
        <div class="section-title">Werkomschrijving</div>
        <div class="section-content">
            <p>{{ $quote->description }}</p>
            <p style="margin-top: 8px;">
                Voor een gedetailleerde specificatie van de werkzaamheden, materialen en kosten verwijzen wij u naar
                de bijgevoegde calculatie met kenmerk {{ $quote->calculation?->calculation_number }}.
            </p>
        </div>

        @if($quote->calculation?->lines && count($quote->calculation->lines) > 0)
        <div class="section-content">
            <p>De volgende werkzaamheden worden uitgevoerd:</p>
        </div>
        <ul class="bullet-list">
            @foreach($quote->calculation->lines->take(3) as $line)
                <li>{{ $line->description }}</li>
            @endforeach
            @if(count($quote->calculation->lines) > 3)
                <li><em>... en {{ count($quote->calculation->lines) - 3}} andere posten (zie calculatie)</em></li>
            @endif
        </ul>
        @endif

        <!-- Price section -->
        <div class="section-title">Honorarium</div>
        <div class="section-content">
            <p>Op basis van het bovenstaande, stellen wij voor de genoemde werkzaamheden uit te voeren op basis van een vaste prijs van:</p>
        </div>
        <div class="price-section">
            <p class="price-amount">
                &euro; {{ number_format($subtotal, 2, ',', '.') }}
            </p>
            <p class="price-words">(zegge: {{ $priceInWords }})</p>
            <p style="margin-top: 10px; font-size: 8pt; color: #666;">
                De genoemde bedragen zijn prijspeil {{ date('Y') }} en exclusief BTW.
                Op onze facturen geldt een betalingstermijn van 30 dagen.
            </p>
        </div>

        <!-- Terms reference -->
        <div class="section-title">Rechtsverhouding</div>
        <div class="section-content">
            <p>
                Op de aanbiedingen en daaruit volgende overeenkomst(en) zijn de algemene voorwaarden Fixzt B.V. van toepassing.
                Opdrachtgever verklaart zich middels ondertekening van deze offerte akkoord met de inhoud van genoemde voorwaarden.
            </p>
        </div>

        <!-- Closing -->
        <div class="section-content" style="margin-top: 15px;">
            <p>
                Wij vertrouwen u hiermee een passende aanbieding te hebben gedaan en zien uw reactie met belangstelling tegemoet.
                Indien akkoord ontvangen wij graag een getekend exemplaar retour.
                @if($quote->valid_until)
                    Deze aanbieding is geldig tot {{ \Carbon\Carbon::parse($quote->valid_until)->locale('nl')->isoFormat('D MMMM YYYY') }}.
                @else
                    Deze aanbieding doen wij gestand tot één (1) maand na verzenddatum.
                @endif
            </p>
        </div>

        <!-- Signature section -->
        <div class="signature-section">
            <div class="signature-block">
                <div class="signature-title">FIXZT B.V.</div>
                <div class="signature-line"></div>
                <div class="signature-label">Datum: {{ $quote->created_at->format('d-m-Y') }}</div>
            </div>
            <div class="signature-block-spacer"></div>
            <div class="signature-block">
                <div class="signature-title">Voor akkoord,</div>
                <div class="signature-line"></div>
                <div class="signature-label">Datum:</div>
                <div class="signature-line" style="margin-top: 15px;"></div>
                <div class="signature-label">Naam:</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="page-footer">
            @if(file_exists($logoPath))
                <img src="{{ $logoPath }}" alt="FIXZT">
            @else
                <div style="font-size: 12pt; font-weight: bold; color: #8B7355; letter-spacing: 2px;">FIXZT</div>
                <div style="font-size: 6pt; color: #8B7355; letter-spacing: 1px;">VASTGOEDSERVICE</div>
            @endif
        </div>
    </div>
</body>
</html>
