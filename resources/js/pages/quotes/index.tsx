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
import { type BreadcrumbItem, type Quote } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PaginatedData {
    data: Quote[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    quotes: PaginatedData;
    search: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Offertes', href: '/dashboard/quotes' },
];

export default function QuotesIndex({ quotes, search }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/quotes/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard/quotes', searchValue ? { search: searchValue } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatPrice = (price: number | null) => {
        if (price === null || price === undefined) return '-';
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offertes" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Offertes
                                </CardTitle>
                                <CardDescription>
                                    Beheer uw offertes
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/quotes/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuwe Offerte
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Zoek op offertenummer of klantnaam..."
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

                        {quotes.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen offertes gevonden.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nummer</TableHead>
                                            <TableHead>Klant</TableHead>
                                            <TableHead>Template</TableHead>
                                            <TableHead>Totaal</TableHead>
                                            <TableHead>Datum</TableHead>
                                            <TableHead className="text-right">Acties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {quotes.data.map((quote) => (
                                            <TableRow key={quote.id}>
                                                <TableCell className="font-medium">
                                                    {quote.quote_number}
                                                </TableCell>
                                                <TableCell>{quote.customer_name}</TableCell>
                                                <TableCell>{quote.template?.name || '-'}</TableCell>
                                                <TableCell>{formatPrice(quote.total ?? 0)}</TableCell>
                                                <TableCell>{formatDate(quote.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/quotes/${quote.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/dashboard/quotes/${quote.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(quote.id)}
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

                        {quotes.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {quotes.links.map((link, index) => (
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

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze offerte wordt permanent verwijderd.
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
