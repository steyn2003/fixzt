import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Eye, Mail, MapPin, Pencil, Phone, Plus, Trash2, User, Users } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Location {
    id: number;
    name: string;
    address: string;
    postal_code: string;
    city: string;
    building_type: string;
    projects_count: number;
}

interface Client {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    notes: string | null;
    locations: Location[];
    created_at: string;
    updated_at: string;
}

interface Props {
    client: Client;
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

export default function ClientShow({ client }: Props) {
    const [deleteLocationId, setDeleteLocationId] = useState<number | null>(null);

    const handleDeleteLocation = () => {
        if (deleteLocationId) {
            router.delete(`/dashboard/locations/${deleteLocationId}`, {
                onSuccess: () => setDeleteLocationId(null),
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Klanten', href: '/dashboard/clients' },
        { title: client.name, href: `/dashboard/clients/${client.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={client.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Client Info Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {client.name}
                                </CardTitle>
                                <CardDescription>
                                    Klantgegevens en overzicht
                                </CardDescription>
                            </div>
                            <Link href={`/dashboard/clients/${client.id}/edit`}>
                                <Button variant="outline">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Bewerken
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {client.contact_person && (
                                <div className="flex items-start gap-3">
                                    <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Contactpersoon</p>
                                        <p className="text-sm text-muted-foreground">{client.contact_person}</p>
                                    </div>
                                </div>
                            )}
                            {client.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">E-mail</p>
                                        <a href={`mailto:${client.email}`} className="text-sm text-primary hover:underline">
                                            {client.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Telefoon</p>
                                        <a href={`tel:${client.phone}`} className="text-sm text-primary hover:underline">
                                            {client.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Locaties</p>
                                    <p className="text-sm text-muted-foreground">{client.locations.length} locatie(s)</p>
                                </div>
                            </div>
                        </div>
                        {client.notes && (
                            <div className="mt-6 rounded-lg bg-muted p-4">
                                <p className="text-sm font-medium mb-1">Notities</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Locations Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Locaties
                                </CardTitle>
                                <CardDescription>
                                    Alle locaties van deze klant
                                </CardDescription>
                            </div>
                            <Link href={`/dashboard/locations/create?client_id=${client.id}`}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuwe Locatie
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {client.locations.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Nog geen locaties voor deze klant.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Naam</TableHead>
                                            <TableHead>Adres</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Projecten</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {client.locations.map((location) => (
                                            <TableRow key={location.id}>
                                                <TableCell className="font-medium">
                                                    {location.name}
                                                </TableCell>
                                                <TableCell>
                                                    {location.address}, {location.postal_code} {location.city}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {buildingTypeLabels[location.building_type] || location.building_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{location.projects_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/locations/${location.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/dashboard/locations/${location.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteLocationId(location.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete location confirmation dialog */}
            <AlertDialog open={deleteLocationId !== null} onOpenChange={() => setDeleteLocationId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze locatie en alle bijbehorende projecten worden permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteLocation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
