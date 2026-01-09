import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, FolderKanban, MapPin, Pencil, Plus, Users } from 'lucide-react';

interface Client {
    id: number;
    name: string;
}

interface Project {
    id: number;
    title: string;
    status: string;
    created_at: string;
}

interface Location {
    id: number;
    name: string;
    address: string;
    postal_code: string;
    city: string;
    building_type: string;
    notes: string | null;
    client: Client;
    projects: Project[];
    created_at: string;
    updated_at: string;
}

interface Props {
    location: Location;
}

const buildingTypeLabels: Record<string, string> = {
    kantoor: 'Kantoor',
    winkel: 'Winkel',
    hotel: 'Hotel',
    zorg: 'Zorg',
    industrial: 'Industrieel',
    residential: 'Wonen',
    overig: 'Overig',
};

export default function LocationShow({ location }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Locaties', href: '/dashboard/locations' },
        { title: location.name, href: `/dashboard/locations/${location.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={location.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Location Info Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    {location.name}
                                </CardTitle>
                                <CardDescription>
                                    Locatiegegevens en overzicht
                                </CardDescription>
                            </div>
                            <Link href={`/dashboard/locations/${location.id}/edit`}>
                                <Button variant="outline">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Bewerken
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-start gap-3">
                                <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Klant</p>
                                    <Link
                                        href={`/dashboard/clients/${location.client.id}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {location.client.name}
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Adres</p>
                                    <p className="text-sm text-muted-foreground">
                                        {location.address}<br />
                                        {location.postal_code} {location.city}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Type Gebouw</p>
                                    <Badge variant="secondary">
                                        {buildingTypeLabels[location.building_type] || location.building_type}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FolderKanban className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Projecten</p>
                                    <p className="text-sm text-muted-foreground">{location.projects.length} project(en)</p>
                                </div>
                            </div>
                        </div>
                        {location.notes && (
                            <div className="mt-6 rounded-lg bg-muted p-4">
                                <p className="text-sm font-medium mb-1">Notities</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{location.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Projects Card - Placeholder for Phase 2 */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderKanban className="h-5 w-5" />
                                    Projecten
                                </CardTitle>
                                <CardDescription>
                                    Alle projecten op deze locatie
                                </CardDescription>
                            </div>
                            <Button disabled>
                                <Plus className="mr-2 h-4 w-4" />
                                Nieuw Project
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="py-12 text-center text-muted-foreground">
                            Projecten worden in de volgende fase toegevoegd.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
