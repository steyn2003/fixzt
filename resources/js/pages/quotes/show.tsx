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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Quote } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    Download,
    Euro,
    FileText,
    FolderKanban,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    quote: Quote;
    totals: {
        subtotal: number;
        total_cost: number;
        total_markup: number;
    };
}

export default function QuoteShow({ quote, totals }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showConvertDialog, setShowConvertDialog] = useState(false);

    const convertForm = useForm({
        title: quote.customer_name,
        type: 'maintenance' as 'maintenance' | 'recurring' | 'renovation',
        create_client: !quote.client_id,
        create_location: !quote.location_id,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Offertes', href: '/dashboard/quotes' },
        { title: quote.quote_number, href: `/dashboard/quotes/${quote.id}` },
    ];

    const formatPrice = (price: number | string | null) => {
        if (price === null || price === undefined) return '-';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(numPrice);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleDelete = () => {
        router.delete(`/dashboard/quotes/${quote.id}`, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    const handleConvert = (e: React.FormEvent) => {
        e.preventDefault();
        convertForm.post(`/dashboard/quotes/${quote.id}/convert`, {
            onSuccess: () => setShowConvertDialog(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Offerte ${quote.quote_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Offerte {quote.quote_number}
                                    </CardTitle>
                                    {quote.converted_at && (
                                        <Badge variant="secondary">Omgezet naar project</Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href={`/dashboard/quotes/${quote.id}/pdf`}>
                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        PDF Download
                                    </Button>
                                </a>
                                <Link href={`/dashboard/quotes/${quote.id}/edit`}>
                                    <Button variant="outline">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Bewerken
                                    </Button>
                                </Link>
                                {!quote.project_id && (
                                    <Button onClick={() => setShowConvertDialog(true)}>
                                        <FolderKanban className="mr-2 h-4 w-4" />
                                        Omzetten naar Project
                                    </Button>
                                )}
                                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Verwijderen
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-start gap-3">
                                <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Klant</p>
                                    <p className="text-sm">{quote.customer_name}</p>
                                    {quote.client && (
                                        <Link
                                            href={`/dashboard/clients/${quote.client.id}`}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Bekijk klant
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {quote.customer_email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">E-mail</p>
                                        <p className="text-sm">{quote.customer_email}</p>
                                    </div>
                                </div>
                            )}
                            {quote.customer_phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Telefoon</p>
                                        <p className="text-sm">{quote.customer_phone}</p>
                                    </div>
                                </div>
                            )}
                            {quote.valid_until && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Geldig tot</p>
                                        <p className="text-sm">{formatDate(quote.valid_until)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {quote.customer_address && (
                            <div className="mt-4 flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Adres</p>
                                    <p className="text-sm whitespace-pre-line">{quote.customer_address}</p>
                                </div>
                            </div>
                        )}
                        {quote.project && (
                            <div className="mt-4 rounded-lg bg-muted p-4">
                                <p className="text-sm font-medium">Gekoppeld Project</p>
                                <Link
                                    href={`/dashboard/projects/${quote.project.id}`}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {quote.project.title}
                                </Link>
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
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Inkoopprijs</p>
                                <p className="text-2xl font-bold">{formatPrice(totals.total_cost)}</p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Marge ({quote.markup_percentage}%)</p>
                                <p className="text-2xl font-bold text-green-600">{formatPrice(totals.total_markup)}</p>
                            </div>
                            <div className="rounded-lg border p-4 bg-primary/5">
                                <p className="text-sm text-muted-foreground">Totaal</p>
                                <p className="text-2xl font-bold">{formatPrice(totals.subtotal)}</p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Template</p>
                                <p className="text-lg font-medium">{quote.template?.name || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Line Items Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Offerte Regels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Omschrijving</TableHead>
                                        <TableHead className="text-right">Aantal</TableHead>
                                        <TableHead>Eenheid</TableHead>
                                        <TableHead className="text-right">Inkoopprijs</TableHead>
                                        <TableHead className="text-right">Marge %</TableHead>
                                        <TableHead className="text-right">Verkoopprijs</TableHead>
                                        <TableHead className="text-right">Totaal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quote.lines?.map((line) => (
                                        <TableRow key={line.id}>
                                            <TableCell>{line.description}</TableCell>
                                            <TableCell className="text-right">
                                                {Number(line.quantity).toFixed(2)}
                                            </TableCell>
                                            <TableCell>{line.unit || 'stuks'}</TableCell>
                                            <TableCell className="text-right">
                                                {formatPrice(line.unit_cost)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {Number(line.markup_percentage).toFixed(1)}%
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatPrice(line.unit_price)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatPrice(line.total)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Card */}
                {quote.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Opmerkingen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{quote.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze offerte wordt permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.
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

            {/* Convert to Project Dialog */}
            <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Omzetten naar Project</DialogTitle>
                        <DialogDescription>
                            Maak een nieuw project aan op basis van deze offerte.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleConvert} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Titel *</Label>
                            <Input
                                id="title"
                                value={convertForm.data.title}
                                onChange={e => convertForm.setData('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Project Type *</Label>
                            <Select
                                value={convertForm.data.type}
                                onValueChange={(v: 'maintenance' | 'recurring' | 'renovation') => convertForm.setData('type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="maintenance">Onderhoud</SelectItem>
                                    <SelectItem value="recurring">Terugkerend</SelectItem>
                                    <SelectItem value="renovation">Renovatie</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {!quote.client_id && (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="create_client"
                                    checked={convertForm.data.create_client}
                                    onChange={e => convertForm.setData('create_client', e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="create_client">Maak nieuwe klant aan</Label>
                            </div>
                        )}
                        {!quote.location_id && (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="create_location"
                                    checked={convertForm.data.create_location}
                                    onChange={e => convertForm.setData('create_location', e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="create_location">Maak nieuwe locatie aan</Label>
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowConvertDialog(false)}>
                                Annuleren
                            </Button>
                            <Button type="submit" disabled={convertForm.processing}>
                                {convertForm.processing ? 'Bezig...' : 'Project Aanmaken'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
