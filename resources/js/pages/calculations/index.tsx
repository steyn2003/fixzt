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
import { type BreadcrumbItem, type Calculation } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calculator, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PaginatedData {
    data: Calculation[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    calculations: PaginatedData;
    search: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Calculaties', href: '/dashboard/calculations' },
];

export default function CalculationsIndex({ calculations, search }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/dashboard/calculations/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard/calculations', searchValue ? { search: searchValue } : {}, {
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
            <Head title="Calculaties" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Calculaties
                                </CardTitle>
                                <CardDescription>
                                    Beheer uw calculaties
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/calculations/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nieuwe Calculatie
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
                                        placeholder="Zoek op calculatienummer of klantnaam..."
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

                        {calculations.data.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Geen calculaties gevonden.
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
                                        {calculations.data.map((calculation) => (
                                            <TableRow key={calculation.id}>
                                                <TableCell className="font-medium">
                                                    {calculation.calculation_number}
                                                </TableCell>
                                                <TableCell>{calculation.customer_name}</TableCell>
                                                <TableCell>{calculation.template?.name || '-'}</TableCell>
                                                <TableCell>{formatPrice(calculation.total ?? 0)}</TableCell>
                                                <TableCell>{formatDate(calculation.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/calculations/${calculation.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/dashboard/calculations/${calculation.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(calculation.id)}
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

                        {calculations.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {calculations.links.map((link, index) => (
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
                            Deze calculatie wordt permanent verwijderd.
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
