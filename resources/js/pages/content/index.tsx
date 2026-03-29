import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Image, Loader2, Save, Sprout } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

interface PageContentItem {
    id: number;
    page: string;
    section: string;
    key: string;
    type: 'text' | 'textarea' | 'image';
    value: string | null;
    sort_order: number;
}

interface Props {
    contents: Record<string, PageContentItem[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Website Content', href: '/dashboard/content' },
];

const pageLabels: Record<string, string> = {
    welcome: 'Home',
    about: 'Over Ons',
    services: 'Diensten',
};

const sectionLabels: Record<string, string> = {
    hero: 'Hero Sectie',
    stats: 'Statistieken',
    services: 'Diensten Kop',
    service_cards: 'Dienst Kaarten',
    building_types: 'Type Gebouwen',
    why_fixzt: 'Waarom Fixzt',
    newsletter: 'Nieuwsbrief',
    cta: 'Call to Action',
    mission: 'Missie',
    values: 'Kernwaarden',
    benefits: 'Voordelen',
    process: 'Ons Proces',
};

function getKeyLabel(key: string): string {
    const labels: Record<string, string> = {
        badge: 'Badge Tekst',
        title: 'Titel',
        subtitle: 'Ondertitel',
        description: 'Beschrijving',
        image: 'Afbeelding',
        paragraph_1: 'Paragraaf 1',
        paragraph_2: 'Paragraaf 2',
    };
    if (labels[key]) return labels[key];

    // Auto-generate labels for numbered items like card_1_title, building_2_description, etc.
    const match = key.match(/^(\w+?)_(\d+)_(\w+)$/);
    if (match) {
        const prefixLabels: Record<string, string> = {
            stat: 'Stat',
            card: 'Kaart',
            building: 'Gebouw',
            item: 'Item',
            value: 'Waarde',
            benefit: 'Voordeel',
            step: 'Stap',
        };
        const fieldLabels: Record<string, string> = {
            value: 'Waarde',
            label: 'Label',
            title: 'Titel',
            description: 'Beschrijving',
            content: 'Inhoud',
            image: 'Afbeelding',
            features: 'Kenmerken',
        };
        const prefix = prefixLabels[match[1]] || match[1];
        const num = match[2];
        const field = fieldLabels[match[3]] || match[3];
        return `${prefix} ${num} - ${field}`;
    }

    return key;
}

export default function ContentIndex({ contents }: Props) {
    const pages = Object.keys(contents);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(pages[0] || 'welcome');
    const [editedValues, setEditedValues] = useState<
        Record<number, string>
    >({});
    const [uploading, setUploading] = useState<number | null>(null);
    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>(
        {},
    );

    const hasContent = pages.length > 0;

    function handleSeed() {
        router.post('/dashboard/content/seed', {}, {
            preserveScroll: true,
        });
    }

    function handleValueChange(id: number, value: string) {
        setEditedValues((prev) => ({ ...prev, [id]: value }));
    }

    function handleSave(page: string) {
        const pageItems = contents[page];
        if (!pageItems) return;

        const items = pageItems.map((item) => ({
            id: item.id,
            page: item.page,
            section: item.section,
            key: item.key,
            type: item.type,
            value: editedValues[item.id] !== undefined
                ? editedValues[item.id]
                : item.value,
            sort_order: item.sort_order,
        }));

        setSaving(true);
        router.put(
            '/dashboard/content',
            { items },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
                onSuccess: () => setEditedValues({}),
            },
        );
    }

    function handleImageUpload(item: PageContentItem, file: File) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('page', item.page);
        formData.append('section', item.section);
        formData.append('key', item.key);

        setUploading(item.id);
        router.post('/dashboard/content/upload', formData, {
            preserveScroll: true,
            onFinish: () => setUploading(null),
        });
    }

    function groupBySection(items: PageContentItem[]) {
        const grouped: Record<string, PageContentItem[]> = {};
        for (const item of items) {
            if (!grouped[item.section]) {
                grouped[item.section] = [];
            }
            grouped[item.section].push(item);
        }
        return grouped;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Website Content" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Website Content
                        </h1>
                        <p className="text-muted-foreground">
                            Bewerk de teksten en afbeeldingen op de website
                        </p>
                    </div>
                    {!hasContent && (
                        <Button onClick={handleSeed}>
                            <Sprout className="mr-2 h-4 w-4" />
                            Initialiseer Content
                        </Button>
                    )}
                </div>

                {!hasContent ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Sprout className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Geen content gevonden
                            </h3>
                            <p className="mb-4 text-center text-muted-foreground">
                                Klik op &quot;Initialiseer Content&quot; om
                                de standaard content te laden. Daarna kunt
                                u alles aanpassen.
                            </p>
                            <Button onClick={handleSeed}>
                                <Sprout className="mr-2 h-4 w-4" />
                                Initialiseer Content
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                    >
                        <TabsList>
                            {pages.map((page) => (
                                <TabsTrigger
                                    key={page}
                                    value={page}
                                >
                                    {pageLabels[page] || page}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {pages.map((page) => (
                            <TabsContent
                                key={page}
                                value={page}
                                className="space-y-6"
                            >
                                {Object.entries(
                                    groupBySection(contents[page]),
                                ).map(([section, items]) => (
                                    <Card key={section}>
                                        <CardHeader>
                                            <CardTitle>
                                                {sectionLabels[section] ||
                                                    section}
                                            </CardTitle>
                                            <CardDescription>
                                                {pageLabels[page] ||
                                                    page}{' '}
                                                -{' '}
                                                {sectionLabels[section] ||
                                                    section}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="space-y-2"
                                                >
                                                    <Label>
                                                        {getKeyLabel(item.key)}
                                                    </Label>
                                                    {item.type ===
                                                        'textarea' ? (
                                                        <Textarea
                                                            value={
                                                                editedValues[
                                                                    item
                                                                        .id
                                                                ] !==
                                                                undefined
                                                                    ? editedValues[
                                                                          item
                                                                              .id
                                                                      ]
                                                                    : item.value ||
                                                                      ''
                                                            }
                                                            onChange={(
                                                                e,
                                                            ) =>
                                                                handleValueChange(
                                                                    item.id,
                                                                    e
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={3}
                                                        />
                                                    ) : item.type ===
                                                      'image' ? (
                                                        <div className="space-y-3">
                                                            {item.value && (
                                                                <div className="relative h-32 w-48 overflow-hidden rounded-lg border">
                                                                    <img
                                                                        src={
                                                                            item.value
                                                                        }
                                                                        alt={
                                                                            item.key
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    ref={(
                                                                        el,
                                                                    ) => {
                                                                        fileInputRefs.current[
                                                                            item.id
                                                                        ] =
                                                                            el;
                                                                    }}
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0];
                                                                        if (
                                                                            file
                                                                        ) {
                                                                            handleImageUpload(
                                                                                item,
                                                                                file,
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        fileInputRefs.current[
                                                                            item.id
                                                                        ]?.click()
                                                                    }
                                                                    disabled={
                                                                        uploading ===
                                                                        item.id
                                                                    }
                                                                >
                                                                    {uploading ===
                                                                    item.id ? (
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Image className="mr-2 h-4 w-4" />
                                                                    )}
                                                                    Nieuwe
                                                                    Afbeelding
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            value={
                                                                editedValues[
                                                                    item
                                                                        .id
                                                                ] !==
                                                                undefined
                                                                    ? editedValues[
                                                                          item
                                                                              .id
                                                                      ]
                                                                    : item.value ||
                                                                      ''
                                                            }
                                                            onChange={(
                                                                e,
                                                            ) =>
                                                                handleValueChange(
                                                                    item.id,
                                                                    e
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}

                                <div className="flex justify-end">
                                    <Button
                                        onClick={() =>
                                            handleSave(page)
                                        }
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        Opslaan
                                    </Button>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </AppLayout>
    );
}
