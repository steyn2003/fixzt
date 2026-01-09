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
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    locations_count: number;
    projects_count: number;
    created_at: string;
}

interface PaginatedData {
    data: Client[];
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
    clients: PaginatedData;
    search: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Klanten', href: '/dashboard/clients' },
];

export default function ClientsIndex({ clients, search }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/clients/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard/clients', searchValue ? { search: searchValue } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Klanten" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Klanten
                                </CardTitle>
                                <CardDescription>
                                    Beheer uw klanten en hun gegevens
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/clients/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuwe Klant
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Zoek op naam, contactpersoon of e-mail..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Zoeken
                                </Button>
                            </div>
                        </form>

                        {/* Table */}
                        {clients.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen klanten gevonden.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Naam</TableHead>
                                            <TableHead>Contactpersoon</TableHead>
                                            <TableHead>E-mail</TableHead>
                                            <TableHead>Telefoon</TableHead>
                                            <TableHead>Locaties</TableHead>
                                            <TableHead>Projecten</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {clients.data.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell className="font-medium">
                                                    {client.name}
                                                </TableCell>
                                                <TableCell>{client.contact_person || '-'}</TableCell>
                                                <TableCell>{client.email || '-'}</TableCell>
                                                <TableCell>{client.phone || '-'}</TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {client.locations_count}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{client.projects_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/clients/${client.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/dashboard/clients/${client.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(client.id)}
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
                        {clients.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {clients.links.map((link, index) => (
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
                            Deze klant en alle bijbehorende locaties worden permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.
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
