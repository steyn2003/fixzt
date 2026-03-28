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
        if (PageContent::count() > 0) {
            return redirect()->back()->with('info', 'Content is al geïnitialiseerd.');
        }

        $defaults = $this->getDefaults();

        foreach ($defaults as $item) {
            PageContent::create($item);
        }

        PageContent::clearCache();

        return redirect()->back()->with('success', 'Content geïnitialiseerd met standaardwaarden.');
    }

    private function getDefaults(): array
    {
        return [
            // Welcome page - Hero
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'badge', 'type' => 'text', 'value' => 'Full-Service Onderhoud Commercieel Vastgoed', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'title', 'type' => 'text', 'value' => 'Uw Gebouw Technisch in Topconditie', 'sort_order' => 1],
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'description', 'type' => 'textarea', 'value' => 'Fixzt ondersteunt vastgoedbeheerders, eigenaren en beleggers bij alle kleine reparaties, dagelijks onderhoud en terugkerende klussen in kantoorgebouwen, winkelcentra en andere commerciële panden. Eén vaste, betrouwbare partij.', 'sort_order' => 2],
            ['page' => 'welcome', 'section' => 'hero', 'key' => 'image', 'type' => 'image', 'value' => '/homepage.webp', 'sort_order' => 3],

            // Welcome page - Stats
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_1_value', 'type' => 'text', 'value' => '24/7', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_1_label', 'type' => 'text', 'value' => 'Bereikbaar', 'sort_order' => 1],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_2_value', 'type' => 'text', 'value' => '100+', 'sort_order' => 2],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_2_label', 'type' => 'text', 'value' => 'Beheerde Locaties', 'sort_order' => 3],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_3_value', 'type' => 'text', 'value' => '10+', 'sort_order' => 4],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_3_label', 'type' => 'text', 'value' => 'Jaar Ervaring', 'sort_order' => 5],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_4_value', 'type' => 'text', 'value' => '98%', 'sort_order' => 6],
            ['page' => 'welcome', 'section' => 'stats', 'key' => 'stat_4_label', 'type' => 'text', 'value' => 'Klanttevredenheid', 'sort_order' => 7],

            // Welcome page - Services section header
            ['page' => 'welcome', 'section' => 'services', 'key' => 'title', 'type' => 'text', 'value' => 'Wat Doen We Precies?', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'services', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Onze diensten voor optimaal onderhoud van uw commercieel vastgoed', 'sort_order' => 1],

            // Welcome page - CTA
            ['page' => 'welcome', 'section' => 'cta', 'key' => 'title', 'type' => 'text', 'value' => 'Klaar Om Uw Vastgoed Te Ontzorgen?', 'sort_order' => 0],
            ['page' => 'welcome', 'section' => 'cta', 'key' => 'description', 'type' => 'textarea', 'value' => 'Neem vandaag nog contact met ons op en ontdek hoe Fixzt uw gebouwen in topconditie houdt, uw huurders tevreden stelt en grotere problemen voorkomt.', 'sort_order' => 1],

            // About page - Hero
            ['page' => 'about', 'section' => 'hero', 'key' => 'title', 'type' => 'text', 'value' => 'Maak kennis met Fixzt', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'hero', 'key' => 'description', 'type' => 'textarea', 'value' => 'Full-service dienstverlener voor commercieel vastgoed onderhoud. Uw betrouwbare partner voor dagelijks onderhoud, preventieve service en spoedinterventies.', 'sort_order' => 1],

            // About page - Mission
            ['page' => 'about', 'section' => 'mission', 'key' => 'title', 'type' => 'text', 'value' => 'Gebouwen in Topconditie Houden', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'mission', 'key' => 'paragraph_1', 'type' => 'textarea', 'value' => 'Bij Fixzt zijn wij toegewijd aan het in optimale technische staat houden van uw commerciële vastgoed. Wij begrijpen dat goed onderhoud essentieel is voor de waarde van uw pand en het comfort van uw huurders.', 'sort_order' => 1],
            ['page' => 'about', 'section' => 'mission', 'key' => 'paragraph_2', 'type' => 'textarea', 'value' => 'Als vaste aanwezigheid in gebouwen zijn wij het eerste aanspreekpunt voor huurders en zorgen we voor directe oplossingen. Onze preventieve aanpak voorkomt grote problemen en zorgt ervoor dat vastgoedbeheerders, eigenaren en investeerders volledig ontzorgd worden met één betrouwbare, vaste partner.', 'sort_order' => 2],
            ['page' => 'about', 'section' => 'mission', 'key' => 'image', 'type' => 'image', 'value' => '/about.jpg', 'sort_order' => 3],

            // About page - Stats
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_1_value', 'type' => 'text', 'value' => '500+', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_1_label', 'type' => 'text', 'value' => 'Panden Beheerd', 'sort_order' => 1],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_2_value', 'type' => 'text', 'value' => '1000+', 'sort_order' => 2],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_2_label', 'type' => 'text', 'value' => 'Tevreden Huurders', 'sort_order' => 3],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_3_value', 'type' => 'text', 'value' => '15+', 'sort_order' => 4],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_3_label', 'type' => 'text', 'value' => 'Jaar Ervaring', 'sort_order' => 5],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_4_value', 'type' => 'text', 'value' => '24/7', 'sort_order' => 6],
            ['page' => 'about', 'section' => 'stats', 'key' => 'stat_4_label', 'type' => 'text', 'value' => 'Beschikbaarheid', 'sort_order' => 7],

            // About page - CTA
            ['page' => 'about', 'section' => 'cta', 'key' => 'title', 'type' => 'text', 'value' => 'Klaar Voor Professioneel Gebouwbeheer?', 'sort_order' => 0],
            ['page' => 'about', 'section' => 'cta', 'key' => 'description', 'type' => 'textarea', 'value' => 'Laten we bespreken hoe wij uw vastgoed optimaal kunnen onderhouden en uw huurders kunnen ontzorgen', 'sort_order' => 1],

            // Services page - Hero
            ['page' => 'services', 'section' => 'hero', 'key' => 'title', 'type' => 'text', 'value' => 'Onze Diensten', 'sort_order' => 0],
            ['page' => 'services', 'section' => 'hero', 'key' => 'description', 'type' => 'textarea', 'value' => 'Professioneel gebouwbeheer en technisch onderhoud voor kantoren en light industrial panden. Van preventief onderhoud tot snelle reparaties, wij zorgen dat uw vastgoed optimaal functioneert.', 'sort_order' => 1],

            // Services page - CTA
            ['page' => 'services', 'section' => 'cta', 'key' => 'title', 'type' => 'text', 'value' => 'Klaar om te Beginnen?', 'sort_order' => 0],
            ['page' => 'services', 'section' => 'cta', 'key' => 'description', 'type' => 'textarea', 'value' => 'Neem vandaag nog contact met ons op om te bespreken hoe wij u kunnen helpen met professioneel gebouwbeheer', 'sort_order' => 1],
        ];
    }
}
