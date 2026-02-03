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
import { type BreadcrumbItem, type Calculation, type Client } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';

interface Props {
    calculations: Calculation[];
    clients: Client[];
    selectedCalculation: Calculation | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Offertes', href: '/dashboard/quotes' },
    { title: 'Nieuwe Offerte', href: '/dashboard/quotes/create' },
];

export default function QuoteCreate({
    calculations,
    clients,
    selectedCalculation,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        calculation_id: selectedCalculation?.id.toString() || '',
        client_id: selectedCalculation?.client_id?.toString() || '',
        description: 'Werkzaamheden conform calculatie',
        valid_until: '',
        notes: '',
    });

    const selectedCalc = calculations.find(
        (c) => c.id.toString() === data.calculation_id,
    );

    const handleCalculationChange = (calculationId: string) => {
        const calc = calculations.find(
            (c) => c.id.toString() === calculationId,
        );
        setData({
            ...data,
            calculation_id: calculationId,
            client_id: calc?.client_id?.toString() || '',
        });
    };

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return '-';
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/quotes');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nieuwe Offerte" />

            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-4 p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Nieuwe Offerte
                            </CardTitle>
                            <CardDescription>
                                Maak een nieuwe offerte aan op basis van een
                                calculatie
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="calculation_id">
                                        Calculatie *
                                    </Label>
                                    <Select
                                        value={data.calculation_id}
                                        onValueChange={handleCalculationChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer calculatie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {calculations.map((calc) => (
                                                <SelectItem
                                                    key={calc.id}
                                                    value={calc.id.toString()}
                                                >
                                                    {calc.calculation_number} -{' '}
                                                    {calc.customer_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.calculation_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.calculation_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client_id">
                                        Klant (optioneel)
                                    </Label>
                                    <Select
                                        value={data.client_id || 'none'}
                                        onValueChange={(v) =>
                                            setData(
                                                'client_id',
                                                v === 'none' ? '' : v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer klant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Geen klant
                                            </SelectItem>
                                            {clients.map((client) => (
                                                <SelectItem
                                                    key={client.id}
                                                    value={client.id.toString()}
                                                >
                                                    {client.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {selectedCalc && (
                                <div className="rounded-lg bg-muted p-4">
                                    <h4 className="mb-2 font-medium">
                                        Calculatie Details
                                    </h4>
                                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                                        <div>
                                            <span className="text-muted-foreground">
                                                Klant:
                                            </span>{' '}
                                            {selectedCalc.customer_name}
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">
                                                Totaal:
                                            </span>{' '}
                                            {formatPrice(selectedCalc.total)}
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">
                                                Regels:
                                            </span>{' '}
                                            {selectedCalc.lines?.length || 0}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Omschrijving *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Bijv. Werkzaamheden conform calculatie"
                                    rows={2}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Dit is de tekst die op de offerte komt te
                                    staan (bijv. "Werkzaamheden conform
                                    calculatie")
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="valid_until">
                                        Geldig tot
                                    </Label>
                                    <Input
                                        id="valid_until"
                                        type="date"
                                        value={data.valid_until}
                                        onChange={(e) =>
                                            setData(
                                                'valid_until',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">
                                    Interne Opmerkingen
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Interne opmerkingen (worden niet op de offerte getoond)..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Opslaan...' : 'Offerte Aanmaken'}
                        </Button>
                        <Link href="/dashboard/quotes">
                            <Button type="button" variant="outline">
                                Annuleren
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
