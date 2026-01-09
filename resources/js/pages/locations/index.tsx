import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Eye, MapPin, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
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

interface Client {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    address: string;
    postal_code: string;
    city: string;
    building_type: string;
    projects_count: number;
    client: Client;
}

interface PaginatedData {
    data: Location[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    locations: PaginatedData;
    search: string | null;
    clientId: string | null;
    clients: Client[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Locaties', href: '/dashboard/locations' },
];

const buildingTypeLabels: Record<string, string> = {
    kantoor: 'Kantoor',
    winkel: 'Winkel',
    hotel: 'Hotel',
    zorg: 'Zorg',
    industrial: 'Industrieel',
    residential: 'Wonen',
    overig: 'Overig',
};

export default function LocationsIndex({ locations, search, clientId, clients }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/locations/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (searchValue) params.search = searchValue;
        if (clientId) params.client_id = clientId;
        router.get('/dashboard/locations', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClientFilter = (value: string) => {
        const params: Record<string, string> = {};
        if (searchValue) params.search = searchValue;
        if (value !== 'all') params.client_id = value;
        router.get('/dashboard/locations', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locaties" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Locaties
                                </CardTitle>
                                <CardDescription>
                                    Beheer alle locaties en gebouwen
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/locations/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuwe Locatie
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search & Filter */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Zoek op naam, adres of stad..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Zoeken
                                </Button>
                            </form>
                            <Select
                                value={clientId || 'all'}
                                onValueChange={handleClientFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filter op klant" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alle klanten</SelectItem>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        {locations.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen locaties gevonden.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Naam</TableHead>
                                            <TableHead>Klant</TableHead>
                                            <TableHead>Adres</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Projecten</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {locations.data.map((location) => (
                                            <TableRow key={location.id}>
                                                <TableCell className="font-medium">
                                                    {location.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/dashboard/clients/${location.client.id}`}
                                                        className="flex items-center gap-1 text-primary hover:underline"
                                                    >
                                                        <Users className="h-3 w-3" />
                                                        {location.client.name}
                                                    </Link>
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
                                                            onClick={() => setDeleteId(location.id)}
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

                        {/* Pagination */}
                        {locations.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {locations.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete confirmation dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze locatie en alle bijbehorende projecten worden permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
