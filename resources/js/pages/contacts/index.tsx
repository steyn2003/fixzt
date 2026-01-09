import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Mail, Trash2, Eye } from 'lucide-react';
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

interface PaginatedData {
    data: ContactSubmission[];
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
    submissions: PaginatedData;
    counts: {
        all: number;
        new: number;
        read: number;
        replied: number;
        archived: number;
    };
    currentStatus: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contactberichten', href: '/dashboard/contacts' },
];

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

export default function ContactsIndex({ submissions, counts, currentStatus }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/contacts/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleFilterChange = (status: string | null) => {
        router.get('/dashboard/contacts', status ? { status } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactberichten" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Contactberichten
                                </CardTitle>
                                <CardDescription>
                                    Beheer inkomende contactformulieren
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filter tabs */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            <Button
                                variant={currentStatus === null ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange(null)}
                            >
                                Alle ({counts.all})
                            </Button>
                            <Button
                                variant={currentStatus === 'new' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange('new')}
                            >
                                Nieuw ({counts.new})
                            </Button>
                            <Button
                                variant={currentStatus === 'read' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange('read')}
                            >
                                Gelezen ({counts.read})
                            </Button>
                            <Button
                                variant={currentStatus === 'replied' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange('replied')}
                            >
                                Beantwoord ({counts.replied})
                            </Button>
                            <Button
                                variant={currentStatus === 'archived' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange('archived')}
                            >
                                Gearchiveerd ({counts.archived})
                            </Button>
                        </div>

                        {/* Table */}
                        {submissions.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen contactberichten gevonden.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Naam</TableHead>
                                            <TableHead>E-mail</TableHead>
                                            <TableHead>Onderwerp</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Datum</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {submissions.data.map((submission) => (
                                            <TableRow
                                                key={submission.id}
                                                className={submission.status === 'new' ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
                                            >
                                                <TableCell className="font-medium">
                                                    {submission.name}
                                                </TableCell>
                                                <TableCell>{submission.email}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {submission.subject}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[submission.status]}>
                                                        {statusLabels[submission.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatDate(submission.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/contacts/${submission.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(submission.id)}
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
                        {submissions.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {submissions.links.map((link, index) => (
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
                            Dit contactbericht wordt permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.
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
