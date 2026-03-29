<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PageContentController extends Controller
{
    public function index()
    {
        $contents = PageContent::orderBy('page')
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('page');

        return Inertia::render('content/index', [
            'contents' => $contents,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'nullable|integer|exists:page_contents,id',
            'items.*.page' => 'required|string|max:50',
            'items.*.section' => 'required|string|max:100',
            'items.*.key' => 'required|string|max:100',
            'items.*.type' => 'required|in:text,textarea,image',
            'items.*.value' => 'nullable|string',
        ]);

        $affectedPages = [];

        foreach ($request->items as $item) {
            PageContent::updateOrCreate(
                [
                    'page' => $item['page'],
                    'section' => $item['section'],
                    'key' => $item['key'],
                ],
                [
                    'type' => $item['type'],
                    'value' => $item['value'],
                    'sort_order' => $item['sort_order'] ?? 0,
                ]
            );
            $affectedPages[$item['page']] = true;
        }

        foreach (array_keys($affectedPages) as $page) {
            PageContent::clearCache($page);
        }

        return redirect()->back()->with('success', 'Content bijgewerkt.');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB max
            'page' => 'required|string|max:50',
            'section' => 'required|string|max:100',
            'key' => 'required|string|max:100',
        ]);

        $path = $request->file('image')->store('content', 'public');

        PageContent::updateOrCreate(
            [
                'page' => $request->page,
                'section' => $request->section,
                'key' => $request->key,
            ],
            [
                'type' => 'image',
                'value' => '/storage/' . $path,
            ]
        );

        PageContent::clearCache($request->page);

        return redirect()->back()->with('success', 'Afbeelding geüpload.');
    }

    public function seed()
    {
        $defaults = $this->getDefaults();
        $added = 0;

        foreach ($defaults as $item) {
            $created = PageContent::firstOrCreate(
                [
                    'page' => $item['page'],
                    'section' => $item['section'],
                    'key' => $item['key'],
                ],
                [
                    'type' => $item['type'],
                    'value' => $item['value'],
                    'sort_order' => $item['sort_order'],
                ]
            );
            if ($created->wasRecentlyCreated) {
                $added++;
            }
        }

        PageContent::clearCache();

        if ($added === 0) {
            return redirect()->back()->with('info', 'Alle content is al aanwezig.');
        }

        return redirect()->back()->with('success', "{$added} content items toegevoegd.");
    }

    private function getDefaults(): array
    {
        return [
            // ==================== WELCOME PAGE ====================

            // Hero
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'badge', 'type' => 'text', 'value' => 'Full-Service Onderhoud Commercieel Vastgoed', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'title', 'type' => 'text', 'value' => 'Uw Gebouw Technisch in Topconditie', 'sort_order' => 1],
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'description', 'type' => 'textarea', 'value' => 'Fixzt ondersteunt vastgoedbeheerders, eigenaren en beleggers bij alle kleine reparaties, dagelijks onderhoud en terugkerende klussen in kantoorgebouwen, winkelcentra en andere commerciële panden. Eén vaste, betrouwbare partij.', 'sort_order' => 2],
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'image', 'type' => 'image', 'value' => '/homepage.webp', 'sort_order' => 3],

            // Stats
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_1_value', 'type' => 'text', 'value' => '24/7', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_1_label', 'type' => 'text', 'value' => 'Bereikbaar', 'sort_order' => 1],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_2_value', 'type' => 'text', 'value' => '100+', 'sort_order' => 2],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_2_label', 'type' => 'text', 'value' => 'Beheerde Locaties', 'sort_order' => 3],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_3_value', 'type' => 'text', 'value' => '10+', 'sort_order' => 4],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_3_label', 'type' => 'text', 'value' => 'Jaar Ervaring', 'sort_order' => 5],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_4_value', 'type' => 'text', 'value' => '98%', 'sort_order' => 6],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_4_label', 'type' => 'text', 'value' => 'Klanttevredenheid', 'sort_order' => 7],

            // Services section header
            ['page' => 'welcome', 'section' => 'services', 'key' => 'title', 'type' => 'text', 'value' => 'Wat Doen We Precies?', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'services', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Onze diensten voor optimaal onderhoud van uw commercieel vastgoed', 'sort_order' => 1],

            // Service cards (5)
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_1_title', 'type' => 'text', 'value' => 'Kleine Reparaties & Dagelijks Onderhoud', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_1_description', 'type' => 'textarea', 'value' => 'Van lekkende kranen tot kapotte deurknoppen - alle kleine klussen die dagelijks voorkomen in commercieel vastgoed.', 'sort_order' => 1],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_2_title', 'type' => 'text', 'value' => 'Preventief Onderhoud & Inspecties', 'sort_order' => 2],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_2_description', 'type' => 'textarea', 'value' => 'Regelmatige controles en preventief onderhoud om grotere problemen en kostbare storingen te voorkomen.', 'sort_order' => 3],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_3_title', 'type' => 'text', 'value' => 'Snelle Respons & Noodgevallen', 'sort_order' => 4],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_3_description', 'type' => 'textarea', 'value' => '24/7 bereikbaar voor acute storingen. Wij schakelen snel om downtime te minimaliseren en uw huurders tevreden te houden.', 'sort_order' => 5],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_4_title', 'type' => 'text', 'value' => 'Eerste Aanspreekpunt op Locatie', 'sort_order' => 6],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_4_description', 'type' => 'textarea', 'value' => 'Uw ogen en oren ter plaatse. Wij signaleren problemen tijdig en denken proactief mee in onderhoudsbeheer.', 'sort_order' => 7],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_5_title', 'type' => 'text', 'value' => 'Kleine Projecten & Vervangingswerk', 'sort_order' => 8],
            ['page' => 'welcome', 'section' => 'service_cards', 'key' => 'card_5_description', 'type' => 'textarea', 'value' => 'Ook voor kleinschalige renovaties en vervangingen kunt u bij ons terecht - zonder de overhead van grote aannemers.', 'sort_order' => 9],

            // Building types header
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'title', 'type' => 'text', 'value' => 'Type Gebouwen', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Wij verzorgen onderhoud voor diverse commerciële vastgoedtypen', 'sort_order' => 1],
            // Building type cards (6)
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_1_title', 'type' => 'text', 'value' => 'Winkelpanden & Winkelcentra', 'sort_order' => 2],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_1_description', 'type' => 'text', 'value' => 'Onderhoud voor retail vastgoed', 'sort_order' => 3],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_1_image', 'type' => 'image', 'value' => '/building-retail.webp', 'sort_order' => 4],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_2_title', 'type' => 'text', 'value' => 'Kantoorgebouwen', 'sort_order' => 5],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_2_description', 'type' => 'text', 'value' => 'Facility management voor kantoren', 'sort_order' => 6],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_2_image', 'type' => 'image', 'value' => '/building-office.webp', 'sort_order' => 7],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_3_title', 'type' => 'text', 'value' => 'Light Industrial & Bedrijfsruimtes', 'sort_order' => 8],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_3_description', 'type' => 'text', 'value' => 'Technisch onderhoud bedrijfspanden', 'sort_order' => 9],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_3_image', 'type' => 'image', 'value' => '/building-industrial.webp', 'sort_order' => 10],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_4_title', 'type' => 'text', 'value' => 'Zorglocaties', 'sort_order' => 11],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_4_description', 'type' => 'text', 'value' => 'Betrouwbaar onderhoud zorginstellingen', 'sort_order' => 12],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_4_image', 'type' => 'image', 'value' => '/building-care.webp', 'sort_order' => 13],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_5_title', 'type' => 'text', 'value' => 'Hotels', 'sort_order' => 14],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_5_description', 'type' => 'text', 'value' => 'Continue inzetbaarheid horecavastgoed', 'sort_order' => 15],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_5_image', 'type' => 'image', 'value' => '/building-hotel.webp', 'sort_order' => 16],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_6_title', 'type' => 'text', 'value' => 'Wooncomplexen', 'sort_order' => 17],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_6_description', 'type' => 'text', 'value' => 'Complexmatig beheer woongebouwen', 'sort_order' => 18],
            ['page' => 'welcome', 'section' => 'building_types', 'key' => 'building_6_image', 'type' => 'image', 'value' => '/building-residential.webp', 'sort_order' => 19],

            // Why Fixzt
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'title', 'type' => 'text', 'value' => 'Waarom Kiezen voor Fixzt?', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Uw betrouwbare partner in commercieel vastgoedonderhoud', 'sort_order' => 1],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_1_title', 'type' => 'text', 'value' => 'Full-Service', 'sort_order' => 2],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_1_description', 'type' => 'text', 'value' => 'Eén partij voor alle onderhoudswerkzaamheden', 'sort_order' => 3],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_1_content', 'type' => 'textarea', 'value' => 'Geen gedoe met verschillende leveranciers. Wij regelen alles - van elektra tot sanitair, van schilderwerk tot kleine verbouwingen.', 'sort_order' => 4],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_2_title', 'type' => 'text', 'value' => 'Commercieel Vastgoed als Specialisatie', 'sort_order' => 5],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_2_description', 'type' => 'text', 'value' => 'Wij begrijpen uw vastgoed', 'sort_order' => 6],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_2_content', 'type' => 'textarea', 'value' => 'Jarenlange ervaring met kantoren, winkelcentra en bedrijfspanden. Wij kennen de eisen en werken discreet tijdens openingstijden.', 'sort_order' => 7],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_3_title', 'type' => 'text', 'value' => 'Snelle Respons', 'sort_order' => 8],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_3_description', 'type' => 'text', 'value' => 'Direct schakelen wanneer nodig', 'sort_order' => 9],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_3_content', 'type' => 'textarea', 'value' => 'Storing? Lekkage? Wij zijn er snel. Minimale downtime betekent tevreden huurders en behoud van waarde.', 'sort_order' => 10],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_4_title', 'type' => 'text', 'value' => 'Preventief én Correctief', 'sort_order' => 11],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_4_description', 'type' => 'text', 'value' => 'Problemen voorkomen én oplossen', 'sort_order' => 12],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_4_content', 'type' => 'textarea', 'value' => 'Regelmatige inspecties en preventief onderhoud voorkomen grotere problemen. En als er toch iets misgaat, lossen wij het snel op.', 'sort_order' => 13],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_5_title', 'type' => 'text', 'value' => 'Ogen en Oren op Locatie', 'sort_order' => 14],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_5_description', 'type' => 'text', 'value' => 'Proactief meedenken', 'sort_order' => 15],
            ['page' => 'welcome', 'section' => 'why_fixzt', 'key' => 'item_5_content', 'type' => 'textarea', 'value' => 'Tijdens onderhoudswerkzaamheden signaleren wij mogelijke toekomstige problemen en adviseren wij proactief over verbeteringen.', 'sort_order' => 16],

            // Newsletter
            ['page' => 'welcome', 'section' => 'newsletter', 'key' => 'title', 'type' => 'text', 'value' => 'Blijf Op De Hoogte', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'newsletter', 'key' => 'description', 'type' => 'textarea', 'value' => 'Ontvang praktische tips voor vastgoedonderhoud, onderhoudsplanningen en updates over onze diensten.', 'sort_order' => 1],

            // CTA
            ['page' => 'welcome', 'section' => 'cta', 'key' => 'title', 'type' => 'text', 'value' => 'Klaar Om Uw Vastgoed Te Ontzorgen?', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'cta', 'key' => 'description', 'type' => 'textarea', 'value' => 'Neem vandaag nog contact met ons op en ontdek hoe Fixzt uw gebouwen in topconditie houdt, uw huurders tevreden stelt en grotere problemen voorkomt.', 'sort_order' => 1],

            // ==================== ABOUT PAGE ====================

            // Hero
            ['page' => 'about', 'section' => 'hero', 'key' => 'title', 'type' => 'text', 'value' => 'Maak kennis met Fixzt', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'hero', 'key' => 'description', 'type' => 'textarea', 'value' => 'Full-service dienstverlener voor commercieel vastgoed onderhoud. Uw betrouwbare partner voor dagelijks onderhoud, preventieve service en spoedinterventies.', 'sort_order' => 1],

            // Mission
            ['page' => 'about', 'section' => 'mission', 'key' => 'title', 'type' => 'text', 'value' => 'Gebouwen in Topconditie Houden', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'mission', 'key' => 'paragraph_1', 'type' => 'textarea', 'value' => 'Bij Fixzt zijn wij toegewijd aan het in optimale technische staat houden van uw commerciële vastgoed. Wij begrijpen dat goed onderhoud essentieel is voor de waarde van uw pand en het comfort van uw huurders.', 'sort_order' => 1],
            ['page' => 'about', 'section' => 'mission', 'key' => 'paragraph_2', 'type' => 'textarea', 'value' => 'Als vaste aanwezigheid in gebouwen zijn wij het eerste aanspreekpunt voor huurders en zorgen we voor directe oplossingen. Onze preventieve aanpak voorkomt grote problemen en zorgt ervoor dat vastgoedbeheerders, eigenaren en investeerders volledig ontzorgd worden met één betrouwbare, vaste partner.', 'sort_order' => 2],
            ['page' => 'about', 'section' => 'mission', 'key' => 'image', 'type' => 'image', 'value' => '/about.jpg', 'sort_order' => 3],

            // Stats
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_1_value', 'type' => 'text', 'value' => '500+', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_1_label', 'type' => 'text', 'value' => 'Panden Beheerd', 'sort_order' => 1],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_2_value', 'type' => 'text', 'value' => '1000+', 'sort_order' => 2],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_2_label', 'type' => 'text', 'value' => 'Tevreden Huurders', 'sort_order' => 3],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_3_value', 'type' => 'text', 'value' => '15+', 'sort_order' => 4],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_3_label', 'type' => 'text', 'value' => 'Jaar Ervaring', 'sort_order' => 5],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_4_value', 'type' => 'text', 'value' => '24/7', 'sort_order' => 6],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_4_label', 'type' => 'text', 'value' => 'Beschikbaarheid', 'sort_order' => 7],

            // Values
            ['page' => 'about', 'section' => 'values', 'key' => 'title', 'type' => 'text', 'value' => 'Onze Kernwaarden', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'values', 'key' => 'subtitle', 'type' => 'text', 'value' => 'De principes die onze service en aanpak bepalen', 'sort_order' => 1],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_1_title', 'type' => 'text', 'value' => 'Betrouwbaar', 'sort_order' => 2],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_1_description', 'type' => 'textarea', 'value' => 'Wij zijn de vaste partner waarop u kunt rekenen. Consistente kwaliteit en betrouwbare service bij elk onderhoud.', 'sort_order' => 3],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_2_title', 'type' => 'text', 'value' => 'Snel & Flexibel', 'sort_order' => 4],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_2_description', 'type' => 'textarea', 'value' => 'Direct beschikbaar wanneer u ons nodig heeft. Snelle respons en flexibele planning voor al uw onderhoudswensen.', 'sort_order' => 5],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_3_title', 'type' => 'text', 'value' => 'Preventief Denken', 'sort_order' => 6],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_3_description', 'type' => 'textarea', 'value' => 'Wij signaleren problemen voordat ze groot worden. Preventief onderhoud voorkomt dure reparaties en verstoringen.', 'sort_order' => 7],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_4_title', 'type' => 'text', 'value' => 'Altijd Bereikbaar', 'sort_order' => 8],
            ['page' => 'about', 'section' => 'values', 'key' => 'value_4_description', 'type' => 'textarea', 'value' => '24/7 beschikbaar voor spoedgevallen. Uw eerste aanspreekpunt op locatie voor alle technische zaken.', 'sort_order' => 9],

            // Why Fixzt (services section on about page)
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'title', 'type' => 'text', 'value' => 'Waarom Fixzt?', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Uw betrouwbare partner voor technisch gebouwbeheer', 'sort_order' => 1],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_1_title', 'type' => 'text', 'value' => 'Dagelijks Onderhoud', 'sort_order' => 2],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_1_description', 'type' => 'text', 'value' => 'Klein reparatiewerk en dagelijks technisch onderhoud van uw gebouwen', 'sort_order' => 3],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_2_title', 'type' => 'text', 'value' => 'Preventief Onderhoud', 'sort_order' => 4],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_2_description', 'type' => 'text', 'value' => 'Regelmatige inspecties en preventieve maatregelen om problemen voor te zijn', 'sort_order' => 5],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_3_title', 'type' => 'text', 'value' => 'Spoedservice', 'sort_order' => 6],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_3_description', 'type' => 'text', 'value' => '24/7 beschikbaar voor spoedgevallen en technische calamiteiten', 'sort_order' => 7],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_4_title', 'type' => 'text', 'value' => 'Kleine Projecten', 'sort_order' => 8],
            ['page' => 'about', 'section' => 'why_fixzt', 'key' => 'item_4_description', 'type' => 'text', 'value' => 'Vervangingswerk en kleine projecten binnen uw vastgoed', 'sort_order' => 9],

            // CTA
            ['page' => 'about', 'section' => 'cta', 'key' => 'title', 'type' => 'text', 'value' => 'Klaar Voor Professioneel Gebouwbeheer?', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'cta', 'key' => 'description', 'type' => 'textarea', 'value' => 'Laten we bespreken hoe wij uw vastgoed optimaal kunnen onderhouden en uw huurders kunnen ontzorgen', 'sort_order' => 1],

            // ==================== SERVICES PAGE ====================

            // Hero
            ['page' => 'services', 'section' => 'hero', 'key' => 'title', 'type' => 'text', 'value' => 'Onze Diensten', 'sort_order' => 0],
            ['page' => 'services', 'section' => 'hero', 'key' => 'description', 'type' => 'textarea', 'value' => 'Professioneel gebouwbeheer en technisch onderhoud voor kantoren en light industrial panden. Van preventief onderhoud tot snelle reparaties, wij zorgen dat uw vastgoed optimaal functioneert.', 'sort_order' => 1],

            // Service cards (5) with features as newline-separated text
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_1_title', 'type' => 'text', 'value' => 'Kleine Reparaties & Dagelijks Onderhoud', 'sort_order' => 0],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_1_description', 'type' => 'text', 'value' => 'Snelle en betrouwbare oplossingen voor dagelijkse onderhoudsvraagstukken', 'sort_order' => 1],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_1_features', 'type' => 'textarea', 'value' => "Oplossen van lekkages\nHerstellen van hang- en sluitwerk (deuren, ramen, sloten, scharnieren)\nHerstellen van plafonds, wanden en deuren\nKlein bouwkundig herstel en afwerking", 'sort_order' => 2],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_2_title', 'type' => 'text', 'value' => 'Preventief Onderhoud, Controles en Inspecties', 'sort_order' => 3],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_2_description', 'type' => 'text', 'value' => 'Proactieve bewaking en onderhoud om problemen voor te zijn', 'sort_order' => 4],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_2_features', 'type' => 'textarea', 'value' => "Periodieke controles aan klimaatinstallaties en technische ruimten\nVisuele inspecties van bouwkundige en installatietechnische onderdelen\nSignaleren van slijtage, risico's en toekomstige onderhoudsbehoefte\nRapportage en terugkoppeling richting beheerder of eigenaar", 'sort_order' => 5],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_3_title', 'type' => 'text', 'value' => 'Snelle Respons & Noodgevallen', 'sort_order' => 6],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_3_description', 'type' => 'text', 'value' => 'Direct ter plaatse bij storingen en calamiteiten', 'sort_order' => 7],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_3_features', 'type' => 'textarea', 'value' => "Snel ter plaatse bij storingen of calamiteiten\nTijdelijke noodoplossing of directe reparatie waar mogelijk\nCommunicatie met huurders en betrokken partijen op locatie\n24/7 bereikbaarheid voor spoedgevallen", 'sort_order' => 8],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_4_title', 'type' => 'text', 'value' => 'Eerste Aanspreekpunt op Locatie', 'sort_order' => 9],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_4_description', 'type' => 'text', 'value' => 'Uw vaste contactpersoon voor alle facilitymanagement vraagstukken', 'sort_order' => 10],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_4_features', 'type' => 'textarea', 'value' => "Begeleiding van installateurs en aannemers\nDirect contact met huurders en gebruikers\nAfstemming met beheerder of assetmanager\nCoördinatie van kleine werkzaamheden", 'sort_order' => 11],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_5_title', 'type' => 'text', 'value' => 'Kleine Projecten & Vervangingswerk', 'sort_order' => 12],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_5_description', 'type' => 'text', 'value' => 'Uitvoering van kleinschalige projecten en upgrades', 'sort_order' => 13],
            ['page' => 'services', 'section' => 'service_cards', 'key' => 'card_5_features', 'type' => 'textarea', 'value' => "Brandmeldinstallaties (vervanging, aanpassingen)\nVervangen van verlichting door LED-oplossingen\nKleinschalige bouwkundige aanpassingen\nDeelprojecten in kantoren en light industrial panden", 'sort_order' => 14],

            // Benefits
            ['page' => 'services', 'section' => 'benefits', 'key' => 'title', 'type' => 'text', 'value' => 'Waarom Met Ons Werken?', 'sort_order' => 0],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Ervaar het verschil van professioneel gebouwbeheer met een persoonlijke aanpak', 'sort_order' => 1],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_1_title', 'type' => 'text', 'value' => 'Vaste Aanwezigheid in Gebouw', 'sort_order' => 2],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_1_description', 'type' => 'text', 'value' => 'Direct beschikbaar en ter plaatse voor al uw vragen', 'sort_order' => 3],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_2_title', 'type' => 'text', 'value' => 'Snelle Reactietijd', 'sort_order' => 4],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_2_description', 'type' => 'text', 'value' => 'Snel ingrijpen bij storingen en calamiteiten', 'sort_order' => 5],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_3_title', 'type' => 'text', 'value' => 'Preventieve Aanpak', 'sort_order' => 6],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_3_description', 'type' => 'text', 'value' => 'Problemen voorkomen door regelmatige controles', 'sort_order' => 7],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_4_title', 'type' => 'text', 'value' => 'Eén Vast Aanspreekpunt', 'sort_order' => 8],
            ['page' => 'services', 'section' => 'benefits', 'key' => 'benefit_4_description', 'type' => 'text', 'value' => 'Eén contactpersoon voor alle facilitymanagement vraagstukken', 'sort_order' => 9],

            // Process
            ['page' => 'services', 'section' => 'process', 'key' => 'title', 'type' => 'text', 'value' => 'Ons Proces', 'sort_order' => 0],
            ['page' => 'services', 'section' => 'process', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Een gestroomlijnde aanpak voor optimaal gebouwbeheer', 'sort_order' => 1],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_1_title', 'type' => 'text', 'value' => 'Kennismaking & Intake', 'sort_order' => 2],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_1_description', 'type' => 'text', 'value' => 'We maken kennis met uw gebouw en bespreken uw specifieke wensen en behoeften', 'sort_order' => 3],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_2_title', 'type' => 'text', 'value' => 'Plan van Aanpak', 'sort_order' => 4],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_2_description', 'type' => 'text', 'value' => 'Ontwikkelen van een onderhoudsplan op maat voor uw pand', 'sort_order' => 5],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_3_title', 'type' => 'text', 'value' => 'Uitvoering & Monitoring', 'sort_order' => 6],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_3_description', 'type' => 'text', 'value' => 'Actieve uitvoering van onderhoud met continue bewaking en rapportage', 'sort_order' => 7],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_4_title', 'type' => 'text', 'value' => 'Continue Optimalisatie', 'sort_order' => 8],
            ['page' => 'services', 'section' => 'process', 'key' => 'step_4_description', 'type' => 'text', 'value' => 'Regelmatige evaluatie en bijsturing voor optimale prestaties', 'sort_order' => 9],

            // CTA
            ['page' => 'services', 'section' => 'cta', 'key' => 'title', 'type' => 'text', 'value' => 'Klaar om te Beginnen?', 'sort_order' => 0],
            ['page' => 'services', 'section' => 'cta', 'key' => 'description', 'type' => 'textarea', 'value' => 'Neem vandaag nog contact met ons op om te bespreken hoe wij u kunnen helpen met professioneel gebouwbeheer', 'sort_order' => 1],
        ];
    }
}
