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
import { Calendar, Eye, FolderKanban, MapPin, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
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
    client: Client;
}

interface Project {
    id: number;
    title: string;
    type: 'maintenance' | 'recurring' | 'renovation';
    status: 'quote' | 'approved' | 'in_progress' | 'completed' | 'invoiced';
    quoted_price: string | null;
    due_date: string | null;
    location: Location;
    created_at: string;
}

interface PaginatedData {
    data: Project[];
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
    projects: PaginatedData;
    search: string | null;
    currentStatus: string | null;
    currentType: string | null;
    clientId: string | null;
    clients: Client[];
    counts: {
        all: number;
        quote: number;
        approved: number;
        in_progress: number;
        completed: number;
        invoiced: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projecten', href: '/dashboard/projects' },
];

const statusLabels: Record<string, string> = {
    quote: 'Offerte',
    approved: 'Goedgekeurd',
    in_progress: 'In Uitvoering',
    completed: 'Afgerond',
    invoiced: 'Gefactureerd',
};

const statusColors: Record<string, string> = {
    quote: 'bg-yellow-500',
    approved: 'bg-blue-500',
    in_progress: 'bg-purple-500',
    completed: 'bg-green-500',
    invoiced: 'bg-gray-500',
};

const typeLabels: Record<string, string> = {
    maintenance: 'Onderhoud',
    recurring: 'Terugkerend',
    renovation: 'Renovatie',
};

export default function ProjectsIndex({ projects, search, currentStatus, currentType, clientId, clients, counts }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/projects/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (searchValue) params.search = searchValue;
        if (currentStatus) params.status = currentStatus;
        if (currentType) params.type = currentType;
        if (clientId) params.client_id = clientId;
        router.get('/dashboard/projects', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusFilter = (status: string | null) => {
        const params: Record<string, string> = {};
        if (searchValue) params.search = searchValue;
        if (status) params.status = status;
        if (currentType) params.type = currentType;
        if (clientId) params.client_id = clientId;
        router.get('/dashboard/projects', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClientFilter = (value: string) => {
        const params: Record<string, string> = {};
        if (searchValue) params.search = searchValue;
        if (currentStatus) params.status = currentStatus;
        if (currentType) params.type = currentType;
        if (value !== 'all') params.client_id = value;
        router.get('/dashboard/projects', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatPrice = (price: string | null) => {
        if (!price) return '-';
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(parseFloat(price));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projecten" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderKanban className="h-5 w-5" />
                                    Projecten
                                </CardTitle>
                                <CardDescription>
                                    Beheer al uw projecten en werkzaamheden
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/projects/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuw Project
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Status filter tabs */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            <Button
                                variant={currentStatus === null ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusFilter(null)}
                            >
                                Alle ({counts.all})
                            </Button>
                            <Button
                                variant={currentStatus === 'quote' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusFilter('quote')}
                            >
                                Offerte ({counts.quote})
                            </Button>
                            <Button
                                variant={currentStatus === 'approved' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusFilter('approved')}
                            >
                                Goedgekeurd ({counts.approved})
                            </Button>
                            <Button
                                variant={currentStatus === 'in_progress' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusFilter('in_progress')}
                            >
                                In Uitvoering ({counts.in_progress})
                            </Button>
                            <Button
                                variant={currentStatus === 'completed' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusFilter('completed')}
                            >
                                Afgerond ({counts.completed})
                            </Button>
                            <Button
                                variant={currentStatus === 'invoiced' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusFilter('invoiced')}
                            >
                                Gefactureerd ({counts.invoiced})
                            </Button>
                        </div>

                        {/* Search & Filter */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Zoek op titel, locatie of klant..."
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
                        {projects.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen projecten gevonden.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Klant</TableHead>
                                            <TableHead>Locatie</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Deadline</TableHead>
                                            <TableHead>Offerte</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects.data.map((project) => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">
                                                    {project.title}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/dashboard/clients/${project.location.client.id}`}
                                                        className="flex items-center gap-1 text-primary hover:underline"
                                                    >
                                                        <Users className="h-3 w-3" />
                                                        {project.location.client.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/dashboard/locations/${project.location.id}`}
                                                        className="flex items-center gap-1 text-primary hover:underline"
                                                    >
                                                        <MapPin className="h-3 w-3" />
                                                        {project.location.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {typeLabels[project.type]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[project.status]}>
                                                        {statusLabels[project.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {project.due_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(project.due_date)}
                                                        </span>
                                                    )}
                                                    {!project.due_date && '-'}
                                                </TableCell>
                                                <TableCell>{formatPrice(project.quoted_price)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/projects/${project.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/dashboard/projects/${project.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(project.id)}
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
                        {projects.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {projects.links.map((link, index) => (
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
                            Dit project en alle bijbehorende gegevens worden permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.
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
