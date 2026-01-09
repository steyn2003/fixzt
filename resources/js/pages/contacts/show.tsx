import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Mail, Phone, User, Calendar, Trash2, Save } from 'lucide-react';
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

interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    notes: string | null;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    submission: ContactSubmission;
}

const statusLabels: Record<string, string> = {
    new: 'Nieuw',
    read: 'Gelezen',
    replied: 'Beantwoord',
    archived: 'Gearchiveerd',
};

const statusColors: Record<string, string> = {
    new: 'bg-blue-500',
    read: 'bg-gray-500',
    replied: 'bg-green-500',
    archived: 'bg-yellow-500',
};

export default function ContactShow({ submission }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data, setData, patch, processing } = useForm({
        status: submission.status,
        notes: submission.notes || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Contactberichten', href: '/dashboard/contacts' },
        { title: submission.name, href: `/dashboard/contacts/${submission.id}` },
    ];

    const handleSave = () => {
        patch(`/dashboard/contacts/${submission.id}`, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        router.delete(`/dashboard/contacts/${submission.id}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Contact: ${submission.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/contacts">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Terug naar overzicht
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Verwijderen
                    </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{submission.subject}</CardTitle>
                                        <CardDescription>
                                            Ontvangen op {formatDate(submission.created_at)}
                                        </CardDescription>
                                    </div>
                                    <Badge className={statusColors[submission.status]}>
                                        {statusLabels[submission.status]}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Contact info */}
                                <div className="grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-3">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Naam</p>
                                            <p className="font-medium">{submission.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">E-mail</p>
                                            <a
                                                href={`mailto:${submission.email}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {submission.email}
                                            </a>
                                        </div>
                                    </div>
                                    {submission.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Telefoon</p>
                                                <a
                                                    href={`tel:${submission.phone}`}
                                                    className="font-medium text-primary hover:underline"
                                                >
                                                    {submission.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <h3 className="mb-2 font-semibold">Bericht</h3>
                                    <div className="whitespace-pre-wrap rounded-lg border bg-background p-4">
                                        {submission.message}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Status card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status wijzigen</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as ContactSubmission['status'])}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">Nieuw</SelectItem>
                                            <SelectItem value="read">Gelezen</SelectItem>
                                            <SelectItem value="replied">Beantwoord</SelectItem>
                                            <SelectItem value="archived">Gearchiveerd</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Interne notities</Label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Voeg interne notities toe..."
                                        rows={4}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <Button onClick={handleSave} disabled={processing} className="w-full">
                                    <Save className="mr-2 h-4 w-4" />
                                    Opslaan
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground">Ontvangen</p>
                                        <p>{formatDate(submission.created_at)}</p>
                                    </div>
                                </div>
                                {submission.read_at && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">Gelezen</p>
                                            <p>{formatDate(submission.read_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Dit contactbericht van {submission.name} wordt permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.
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
