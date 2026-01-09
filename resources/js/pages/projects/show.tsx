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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Download,
    Euro,
    FileText,
    FolderKanban,
    Image,
    MapPin,
    Package,
    Pencil,
    Plus,
    StickyNote,
    Trash2,
    TrendingUp,
    Upload,
    Users,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface ActivityType {
    id: number;
    name: string;
    default_hourly_rate: string;
}

interface Client {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    address: string;
    city: string;
    client: Client;
}

interface TimeEntry {
    id: number;
    activity_type_id: number;
    activity_type: ActivityType;
    hours: string;
    hourly_rate: string;
    date: string;
    notes: string | null;
}

interface Material {
    id: number;
    name: string;
    quantity: string;
    unit: string;
    unit_cost: string;
    total_cost: string;
    date: string;
    notes: string | null;
}

interface Note {
    id: number;
    content: string;
    user: { name: string };
    created_at: string;
}

interface ProjectFileType {
    id: number;
    name: string;
    original_name: string;
    mime_type: string;
    url: string;
    formatted_size: string;
    user: { name: string };
    created_at: string;
}

interface Project {
    id: number;
    title: string;
    description: string | null;
    type: 'maintenance' | 'recurring' | 'renovation';
    status: 'quote' | 'approved' | 'in_progress' | 'completed' | 'invoiced';
    quoted_price: string | null;
    start_date: string | null;
    due_date: string | null;
    location: Location;
    time_entries: TimeEntry[];
    materials: Material[];
    notes: Note[];
    files: ProjectFileType[];
    created_at: string;
    updated_at: string;
}

interface Financials {
    quoted_price: string | null;
    labor_cost: number;
    material_cost: number;
    actual_cost: number;
    profit_margin: number | null;
}

interface Props {
    project: Project;
    activityTypes: ActivityType[];
    financials: Financials;
}

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

const materialUnits = [
    { value: 'stuks', label: 'Stuks' },
    { value: 'meter', label: 'Meter' },
    { value: 'liter', label: 'Liter' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'm2', label: 'Vierkante meter' },
    { value: 'm3', label: 'Kubieke meter' },
    { value: 'set', label: 'Set' },
    { value: 'rol', label: 'Rol' },
    { value: 'doos', label: 'Doos' },
];

export default function ProjectShow({
    project,
    activityTypes,
    financials,
}: Props) {
    const [showTimeEntryDialog, setShowTimeEntryDialog] = useState(false);
    const [showMaterialDialog, setShowMaterialDialog] = useState(false);
    const [showNoteDialog, setShowNoteDialog] = useState(false);
    const [deleteTimeEntryId, setDeleteTimeEntryId] = useState<number | null>(
        null,
    );
    const [deleteMaterialId, setDeleteMaterialId] = useState<number | null>(
        null,
    );
    const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
    const [deleteFileId, setDeleteFileId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const timeEntryForm = useForm({
        activity_type_id: '',
        hours: '',
        hourly_rate: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const materialForm = useForm({
        name: '',
        quantity: '',
        unit: 'stuks',
        unit_cost: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const noteForm = useForm({
        content: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projecten', href: '/dashboard/projects' },
        { title: project.title, href: `/dashboard/projects/${project.id}` },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: string | number | null) => {
        if (price === null || price === undefined) return '-';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(numPrice);
    };

    const handleActivityTypeChange = (activityTypeId: string) => {
        timeEntryForm.setData('activity_type_id', activityTypeId);
        const activityType = activityTypes.find(
            (at) => at.id.toString() === activityTypeId,
        );
        if (activityType) {
            timeEntryForm.setData(
                'hourly_rate',
                activityType.default_hourly_rate,
            );
        }
    };

    const handleTimeEntrySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        timeEntryForm.post(`/dashboard/projects/${project.id}/time-entries`, {
            onSuccess: () => {
                setShowTimeEntryDialog(false);
                timeEntryForm.reset();
            },
        });
    };

    const handleMaterialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        materialForm.post(`/dashboard/projects/${project.id}/materials`, {
            onSuccess: () => {
                setShowMaterialDialog(false);
                materialForm.reset();
            },
        });
    };

    const handleNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post(`/dashboard/projects/${project.id}/notes`, {
            onSuccess: () => {
                setShowNoteDialog(false);
                noteForm.reset();
            },
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post(`/dashboard/projects/${project.id}/files`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: () => {
                setUploading(false);
            },
        });
    };

    const handleDeleteTimeEntry = () => {
        if (deleteTimeEntryId) {
            router.delete(
                `/dashboard/projects/${project.id}/time-entries/${deleteTimeEntryId}`,
                {
                    onSuccess: () => setDeleteTimeEntryId(null),
                },
            );
        }
    };

    const handleDeleteMaterial = () => {
        if (deleteMaterialId) {
            router.delete(
                `/dashboard/projects/${project.id}/materials/${deleteMaterialId}`,
                {
                    onSuccess: () => setDeleteMaterialId(null),
                },
            );
        }
    };

    const handleDeleteNote = () => {
        if (deleteNoteId) {
            router.delete(
                `/dashboard/projects/${project.id}/notes/${deleteNoteId}`,
                {
                    onSuccess: () => setDeleteNoteId(null),
                },
            );
        }
    };

    const handleDeleteFile = () => {
        if (deleteFileId) {
            router.delete(
                `/dashboard/projects/${project.id}/files/${deleteFileId}`,
                {
                    onSuccess: () => setDeleteFileId(null),
                },
            );
        }
    };

    const isImage = (mimeType: string) => mimeType.startsWith('image/');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.title} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Project Header Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <FolderKanban className="h-5 w-5" />
                                        {project.title}
                                    </CardTitle>
                                    <Badge
                                        className={statusColors[project.status]}
                                    >
                                        {statusLabels[project.status]}
                                    </Badge>
                                    <Badge variant="outline">
                                        {typeLabels[project.type]}
                                    </Badge>
                                </div>
                            </div>
                            <Link
                                href={`/dashboard/projects/${project.id}/edit`}
                            >
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
                                        href={`/dashboard/clients/${project.location.client.id}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {project.location.client.name}
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Locatie
                                    </p>
                                    <Link
                                        href={`/dashboard/locations/${project.location.id}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {project.location.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        {project.location.address},{' '}
                                        {project.location.city}
                                    </p>
                                </div>
                            </div>
                            {project.start_date && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Startdatum
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(project.start_date)}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {project.due_date && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Deadline
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(project.due_date)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {project.description && (
                            <div className="mt-6 rounded-lg bg-muted p-4">
                                <p className="mb-1 text-sm font-medium">
                                    Beschrijving
                                </p>
                                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                    {project.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Financials Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Euro className="h-5 w-5" />
                            Financieel Overzicht
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Offerteprijs
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatPrice(financials.quoted_price)}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Arbeidskosten
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatPrice(financials.labor_cost)}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Materiaalkosten
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatPrice(financials.material_cost)}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Werkelijke Kosten
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatPrice(financials.actual_cost)}
                                </p>
                            </div>
                            <div
                                className={`rounded-lg border p-4 ${financials.profit_margin !== null && financials.profit_margin >= 0 ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}
                            >
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <TrendingUp className="h-3 w-3" />
                                    Marge
                                </p>
                                <p
                                    className={`text-2xl font-bold ${financials.profit_margin !== null && financials.profit_margin >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {formatPrice(financials.profit_margin)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="time" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            value="time"
                            className="flex items-center gap-2"
                        >
                            <Clock className="h-4 w-4" />
                            Uren ({project.time_entries.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="materials"
                            className="flex items-center gap-2"
                        >
                            <Package className="h-4 w-4" />
                            Materialen ({project.materials.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="notes"
                            className="flex items-center gap-2"
                        >
                            <StickyNote className="h-4 w-4" />
                            Notities ({project.notes.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="files"
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Bestanden ({project.files.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Time Entries Tab */}
                    <TabsContent value="time">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Gewerkte Uren</CardTitle>
                                    <Button
                                        onClick={() =>
                                            setShowTimeEntryDialog(true)
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Uren Toevoegen
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project.time_entries.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Nog geen uren geregistreerd.
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Datum</TableHead>
                                                    <TableHead>
                                                        Activiteit
                                                    </TableHead>
                                                    <TableHead>Uren</TableHead>
                                                    <TableHead>
                                                        Uurtarief
                                                    </TableHead>
                                                    <TableHead>
                                                        Totaal
                                                    </TableHead>
                                                    <TableHead>
                                                        Notities
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Acties
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {project.time_entries.map(
                                                    (entry) => (
                                                        <TableRow
                                                            key={entry.id}
                                                        >
                                                            <TableCell>
                                                                {formatDate(
                                                                    entry.date,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    entry
                                                                        .activity_type
                                                                        .name
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {parseFloat(
                                                                    entry.hours,
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatPrice(
                                                                    entry.hourly_rate,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatPrice(
                                                                    parseFloat(
                                                                        entry.hours,
                                                                    ) *
                                                                        parseFloat(
                                                                            entry.hourly_rate,
                                                                        ),
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="max-w-[200px] truncate">
                                                                {entry.notes ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        setDeleteTimeEntryId(
                                                                            entry.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Materials Tab */}
                    <TabsContent value="materials">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Gebruikte Materialen</CardTitle>
                                    <Button
                                        onClick={() =>
                                            setShowMaterialDialog(true)
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Materiaal Toevoegen
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project.materials.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Nog geen materialen geregistreerd.
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Datum</TableHead>
                                                    <TableHead>
                                                        Materiaal
                                                    </TableHead>
                                                    <TableHead>
                                                        Aantal
                                                    </TableHead>
                                                    <TableHead>
                                                        Eenheid
                                                    </TableHead>
                                                    <TableHead>
                                                        Stuksprijs
                                                    </TableHead>
                                                    <TableHead>
                                                        Totaal
                                                    </TableHead>
                                                    <TableHead>
                                                        Notities
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Acties
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {project.materials.map(
                                                    (material) => (
                                                        <TableRow
                                                            key={material.id}
                                                        >
                                                            <TableCell>
                                                                {formatDate(
                                                                    material.date,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {material.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {parseFloat(
                                                                    material.quantity,
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {material.unit}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatPrice(
                                                                    material.unit_cost,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatPrice(
                                                                    material.total_cost,
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="max-w-[200px] truncate">
                                                                {material.notes ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        setDeleteMaterialId(
                                                                            material.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notes Tab */}
                    <TabsContent value="notes">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Projectnotities</CardTitle>
                                    <Button
                                        onClick={() => setShowNoteDialog(true)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Notitie Toevoegen
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project.notes.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Nog geen notities.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {project.notes.map((note) => (
                                            <div
                                                key={note.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="mb-2 text-sm text-muted-foreground">
                                                            {note.user.name} -{' '}
                                                            {formatDateTime(
                                                                note.created_at,
                                                            )}
                                                        </p>
                                                        <p className="text-sm whitespace-pre-wrap">
                                                            {note.content}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeleteNoteId(
                                                                note.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Files Tab */}
                    <TabsContent value="files">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Projectbestanden</CardTitle>
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                        />
                                        <Button
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            disabled={uploading}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {uploading
                                                ? 'Uploaden...'
                                                : 'Bestand Uploaden'}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project.files.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Nog geen bestanden geüpload.
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {project.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                        {isImage(
                                                            file.mime_type,
                                                        ) ? (
                                                            <Image className="h-5 w-5 text-muted-foreground" />
                                                        ) : (
                                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium">
                                                            {file.original_name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                file.formatted_size
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {file.user.name} -{' '}
                                                            {formatDateTime(
                                                                file.created_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex gap-2">
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Download className="mr-1 h-3 w-3" />
                                                            Download
                                                        </Button>
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setDeleteFileId(
                                                                file.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Time Entry Dialog */}
            <Dialog
                open={showTimeEntryDialog}
                onOpenChange={setShowTimeEntryDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Uren Toevoegen</DialogTitle>
                        <DialogDescription>
                            Registreer gewerkte uren voor dit project
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleTimeEntrySubmit}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="activity_type_id">
                                Activiteit *
                            </Label>
                            <Select
                                value={timeEntryForm.data.activity_type_id}
                                onValueChange={handleActivityTypeChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecteer activiteit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activityTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id.toString()}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="hours">Uren *</Label>
                                <Input
                                    id="hours"
                                    type="number"
                                    step="0.25"
                                    min="0.25"
                                    max="24"
                                    value={timeEntryForm.data.hours}
                                    onChange={(e) =>
                                        timeEntryForm.setData(
                                            'hours',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hourly_rate">Uurtarief *</Label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                                        €
                                    </span>
                                    <Input
                                        id="hourly_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={timeEntryForm.data.hourly_rate}
                                        onChange={(e) =>
                                            timeEntryForm.setData(
                                                'hourly_rate',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Datum *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={timeEntryForm.data.date}
                                onChange={(e) =>
                                    timeEntryForm.setData(
                                        'date',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notities</Label>
                            <Textarea
                                id="notes"
                                value={timeEntryForm.data.notes}
                                onChange={(e) =>
                                    timeEntryForm.setData(
                                        'notes',
                                        e.target.value,
                                    )
                                }
                                placeholder="Optionele notities..."
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowTimeEntryDialog(false)}
                            >
                                Annuleren
                            </Button>
                            <Button
                                type="submit"
                                disabled={timeEntryForm.processing}
                            >
                                {timeEntryForm.processing
                                    ? 'Opslaan...'
                                    : 'Toevoegen'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Material Dialog */}
            <Dialog
                open={showMaterialDialog}
                onOpenChange={setShowMaterialDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Materiaal Toevoegen</DialogTitle>
                        <DialogDescription>
                            Registreer gebruikt materiaal voor dit project
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMaterialSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Materiaal *</Label>
                            <Input
                                id="name"
                                value={materialForm.data.name}
                                onChange={(e) =>
                                    materialForm.setData('name', e.target.value)
                                }
                                placeholder="Bijv. LED-lampen, Verf, Leidingen"
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Aantal *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={materialForm.data.quantity}
                                    onChange={(e) =>
                                        materialForm.setData(
                                            'quantity',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Eenheid *</Label>
                                <Select
                                    value={materialForm.data.unit}
                                    onValueChange={(value) =>
                                        materialForm.setData('unit', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {materialUnits.map((unit) => (
                                            <SelectItem
                                                key={unit.value}
                                                value={unit.value}
                                            >
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit_cost">Stuksprijs *</Label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                                        €
                                    </span>
                                    <Input
                                        id="unit_cost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={materialForm.data.unit_cost}
                                        onChange={(e) =>
                                            materialForm.setData(
                                                'unit_cost',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="material_date">Datum *</Label>
                            <Input
                                id="material_date"
                                type="date"
                                value={materialForm.data.date}
                                onChange={(e) =>
                                    materialForm.setData('date', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="material_notes">Notities</Label>
                            <Textarea
                                id="material_notes"
                                value={materialForm.data.notes}
                                onChange={(e) =>
                                    materialForm.setData(
                                        'notes',
                                        e.target.value,
                                    )
                                }
                                placeholder="Optionele notities..."
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowMaterialDialog(false)}
                            >
                                Annuleren
                            </Button>
                            <Button
                                type="submit"
                                disabled={materialForm.processing}
                            >
                                {materialForm.processing
                                    ? 'Opslaan...'
                                    : 'Toevoegen'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Note Dialog */}
            <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Notitie Toevoegen</DialogTitle>
                        <DialogDescription>
                            Voeg een notitie toe aan dit project
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleNoteSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="content">Notitie *</Label>
                            <Textarea
                                id="content"
                                value={noteForm.data.content}
                                onChange={(e) =>
                                    noteForm.setData('content', e.target.value)
                                }
                                placeholder="Schrijf uw notitie..."
                                rows={5}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowNoteDialog(false)}
                            >
                                Annuleren
                            </Button>
                            <Button
                                type="submit"
                                disabled={noteForm.processing}
                            >
                                {noteForm.processing
                                    ? 'Opslaan...'
                                    : 'Toevoegen'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Time Entry Confirmation */}
            <AlertDialog
                open={deleteTimeEntryId !== null}
                onOpenChange={() => setDeleteTimeEntryId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Uren verwijderen?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze urenregistratie wordt permanent verwijderd.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTimeEntry}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Material Confirmation */}
            <AlertDialog
                open={deleteMaterialId !== null}
                onOpenChange={() => setDeleteMaterialId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Materiaal verwijderen?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Dit materiaal wordt permanent verwijderd.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMaterial}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Note Confirmation */}
            <AlertDialog
                open={deleteNoteId !== null}
                onOpenChange={() => setDeleteNoteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Notitie verwijderen?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze notitie wordt permanent verwijderd.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteNote}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete File Confirmation */}
            <AlertDialog
                open={deleteFileId !== null}
                onOpenChange={() => setDeleteFileId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Bestand verwijderen?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Dit bestand wordt permanent verwijderd.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteFile}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
