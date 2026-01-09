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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FolderKanban } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Location {
    id: number;
    name: string;
}

interface Client {
    id: number;
    name: string;
    locations: Location[];
}

interface Project {
    id: number;
    location_id: number;
    title: string;
    description: string | null;
    type: string;
    status: string;
    quoted_price: string | null;
    start_date: string | null;
    due_date: string | null;
    location: {
        id: number;
        client_id: number;
    };
}

interface Props {
    project: Project;
    clients: Client[];
}

const projectTypes = [
    { value: 'maintenance', label: 'Onderhoud' },
    { value: 'recurring', label: 'Terugkerend' },
    { value: 'renovation', label: 'Renovatie' },
];

const projectStatuses = [
    { value: 'quote', label: 'Offerte' },
    { value: 'approved', label: 'Goedgekeurd' },
    { value: 'in_progress', label: 'In Uitvoering' },
    { value: 'completed', label: 'Afgerond' },
    { value: 'invoiced', label: 'Gefactureerd' },
];

export default function ProjectEdit({ project, clients }: Props) {
    const initialClient = clients.find(c =>
        c.locations.some(l => l.id === project.location_id)
    );

    const [selectedClientId, setSelectedClientId] = useState<string>(
        initialClient?.id.toString() || ''
    );
    const [availableLocations, setAvailableLocations] = useState<Location[]>(
        initialClient?.locations || []
    );

    const { data, setData, put, processing, errors } = useForm({
        location_id: project.location_id.toString(),
        title: project.title,
        description: project.description || '',
        type: project.type,
        status: project.status,
        quoted_price: project.quoted_price || '',
        start_date: project.start_date || '',
        due_date: project.due_date || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projecten', href: '/dashboard/projects' },
        { title: project.title, href: `/dashboard/projects/${project.id}` },
        { title: 'Bewerken', href: `/dashboard/projects/${project.id}/edit` },
    ];

    const handleClientChange = (clientId: string) => {
        setSelectedClientId(clientId);
        const client = clients.find(c => c.id.toString() === clientId);
        setAvailableLocations(client?.locations || []);
        setData('location_id', '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/projects/${project.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.title} Bewerken`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5" />
                            Project Bewerken
                        </CardTitle>
                        <CardDescription>
                            Pas de gegevens van {project.title} aan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Client & Location Selection */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="client">Klant *</Label>
                                    <Select
                                        value={selectedClientId}
                                        onValueChange={handleClientChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer een klant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location_id">Locatie *</Label>
                                    <Select
                                        value={data.location_id}
                                        onValueChange={(value) => setData('location_id', value)}
                                        disabled={!selectedClientId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={selectedClientId ? "Selecteer een locatie" : "Selecteer eerst een klant"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableLocations.map((location) => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {location.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.location_id && (
                                        <p className="text-sm text-destructive">{errors.location_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Projecttitel *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Bijv. Reparatie CV-installatie"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Beschrijving</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Beschrijf de werkzaamheden..."
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type Project *</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(value) => setData('type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.type && (
                                        <p className="text-sm text-destructive">{errors.type}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectStatuses.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quoted_price">Offerteprijs</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                    <Input
                                        id="quoted_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.quoted_price}
                                        onChange={(e) => setData('quoted_price', e.target.value)}
                                        placeholder="0.00"
                                        className="pl-8"
                                    />
                                </div>
                                {errors.quoted_price && (
                                    <p className="text-sm text-destructive">{errors.quoted_price}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Startdatum</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-destructive">{errors.start_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Deadline</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    {errors.due_date && (
                                        <p className="text-sm text-destructive">{errors.due_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                                </Button>
                                <Link href={`/dashboard/projects/${project.id}`}>
                                    <Button type="button" variant="outline">
                                        Annuleren
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
