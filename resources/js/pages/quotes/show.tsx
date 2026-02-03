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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Quote } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calculator,
    Calendar,
    Download,
    Euro,
    FileText,
    Pencil,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    quote: Quote;
}

export default function QuoteShow({ quote }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Offertes', href: '/dashboard/quotes' },
        { title: quote.quote_number, href: `/dashboard/quotes/${quote.id}` },
    ];

    const formatPrice = (price: number | string | null | undefined) => {
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

    const customerName =
        quote.client?.name || quote.calculation?.customer_name || '-';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Offerte ${quote.quote_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Offerte {quote.quote_number}
                                </CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <a href={`/dashboard/quotes/${quote.id}/pdf`}>
                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        PDF Download
                                    </Button>
                                </a>
                                <Link
                                    href={`/dashboard/quotes/${quote.id}/edit`}
                                >
                                    <Button variant="outline">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Bewerken
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
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
                                    <p className="text-sm">{customerName}</p>
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
                            <div className="flex items-start gap-3">
                                <Calculator className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Calculatie
                                    </p>
                                    <Link
                                        href={`/dashboard/calculations/${quote.calculation?.id}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {quote.calculation?.calculation_number}
                                    </Link>
                                </div>
                            </div>
                            {quote.valid_until && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Geldig tot
                                        </p>
                                        <p className="text-sm">
                                            {formatDate(quote.valid_until)}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <Euro className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Totaal (excl. BTW)
                                    </p>
                                    <p className="text-lg font-bold">
                                        {formatPrice(quote.total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quote Content Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Offerte Inhoud</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {quote.description}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Zie bijgevoegde calculatie voor
                                        gedetailleerde specificatie
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        {formatPrice(quote.total)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        excl. BTW
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Calculation Preview Card */}
                {quote.calculation && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Gekoppelde Calculatie</CardTitle>
                                <Link
                                    href={`/dashboard/calculations/${quote.calculation.id}`}
                                >
                                    <Button variant="outline" size="sm">
                                        Bekijk volledige calculatie
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {quote.calculation.lines
                                    ?.slice(0, 5)
                                    .map((line) => (
                                        <div
                                            key={line.id}
                                            className="flex justify-between border-b py-1 text-sm last:border-0"
                                        >
                                            <span>{line.description}</span>
                                            <span className="font-medium">
                                                {formatPrice(line.total)}
                                            </span>
                                        </div>
                                    ))}
                                {(quote.calculation.lines?.length || 0) > 5 && (
                                    <p className="pt-2 text-sm text-muted-foreground">
                                        ... en{' '}
                                        {(quote.calculation.lines?.length ||
                                            0) - 5}{' '}
                                        meer regels
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Notes Card */}
                {quote.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Interne Opmerkingen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">
                                {quote.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze offerte wordt permanent verwijderd. De
                            gekoppelde calculatie blijft behouden.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
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
