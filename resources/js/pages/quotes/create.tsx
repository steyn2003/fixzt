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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Client, type Location, type QuoteLine, type QuoteTemplate } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FileText, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
    clients: Client[];
    locations: Location[];
    templates: QuoteTemplate[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Offertes', href: '/dashboard/quotes' },
    { title: 'Nieuwe Offerte', href: '/dashboard/quotes/create' },
];

const defaultLine: Omit<QuoteLine, 'id' | 'quote_id'> = {
    description: '',
    quantity: 1,
    unit: 'stuks',
    unit_cost: 0,
    markup_percentage: 0,
    unit_price: 0,
    total: 0,
    sort_order: 0,
};

export default function QuoteCreate({ clients, locations, templates }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [extracting, setExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);

    const defaultTemplate = templates.find(t => t.is_default) || templates[0];

    const { data, setData, post, processing, errors } = useForm({
        client_id: '' as string | number,
        location_id: '' as string | number,
        template_id: defaultTemplate?.id.toString() || '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        markup_percentage: 10,
        notes: '',
        valid_until: '',
        lines: [{ ...defaultLine }] as Omit<QuoteLine, 'id' | 'quote_id'>[],
    });

    const filteredLocations = data.client_id
        ? locations.filter(l => l.client_id === Number(data.client_id))
        : locations;

    const handleClientChange = (clientId: string) => {
        const client = clients.find(c => c.id === Number(clientId));
        setData(prev => ({
            ...prev,
            client_id: clientId,
            location_id: '',
            customer_name: client?.name || prev.customer_name,
            customer_email: client?.email || prev.customer_email,
            customer_phone: client?.phone || prev.customer_phone,
        }));
    };

    const handleLocationChange = (locationId: string) => {
        const location = locations.find(l => l.id === Number(locationId));
        setData(prev => ({
            ...prev,
            location_id: locationId,
            customer_address: location ? `${location.address}\n${location.city}` : prev.customer_address,
        }));
    };

    const calculateLinePrice = (line: Omit<QuoteLine, 'id' | 'quote_id'>) => {
        const unitPrice = line.unit_cost * (1 + line.markup_percentage / 100);
        const total = line.quantity * unitPrice;
        return { unit_price: unitPrice, total };
    };

    const updateLine = (index: number, field: keyof QuoteLine, value: string | number) => {
        const newLines = [...data.lines];
        newLines[index] = { ...newLines[index], [field]: value };
        const calculated = calculateLinePrice(newLines[index]);
        newLines[index] = { ...newLines[index], ...calculated };
        setData('lines', newLines);
    };

    const applyGlobalMarkup = () => {
        const newLines = data.lines.map(line => {
            const updated = { ...line, markup_percentage: data.markup_percentage };
            return { ...updated, ...calculateLinePrice(updated) };
        });
        setData('lines', newLines);
    };

    const addLine = () => {
        const newLine = { ...defaultLine, markup_percentage: data.markup_percentage, sort_order: data.lines.length };
        setData('lines', [...data.lines, newLine]);
    };

    const removeLine = (index: number) => {
        if (data.lines.length > 1) {
            setData('lines', data.lines.filter((_, i) => i !== index));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setExtracting(true);
        setExtractError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/dashboard/quotes/extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.lines && response.data.lines.length > 0) {
                const extractedLines = response.data.lines.map((line: { description: string; quantity: number; unit: string; unit_price: number }, index: number) => {
                    const newLine: Omit<QuoteLine, 'id' | 'quote_id'> = {
                        description: line.description,
                        quantity: line.quantity || 1,
                        unit: line.unit || 'stuks',
                        unit_cost: line.unit_price || 0,
                        markup_percentage: data.markup_percentage,
                        unit_price: 0,
                        total: 0,
                        sort_order: index,
                    };
                    return { ...newLine, ...calculateLinePrice(newLine) };
                });
                setData('lines', extractedLines);
            } else {
                setExtractError(response.data.message || 'Geen regels gevonden in het bestand.');
            }
        } catch {
            setExtractError('Fout bij het verwerken van het bestand.');
        } finally {
            setExtracting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/quotes');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const totalCost = data.lines.reduce((sum, line) => sum + (line.quantity * line.unit_cost), 0);
    const totalPrice = data.lines.reduce((sum, line) => sum + line.total, 0);
    const totalMarkup = totalPrice - totalCost;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nieuwe Offerte" />

            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-4 p-4">
                    {/* Basic Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Nieuwe Offerte
                            </CardTitle>
                            <CardDescription>
                                Maak een nieuwe offerte aan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Client/Location Selection */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Bestaande Klant (optioneel)</Label>
                                    <Select value={data.client_id.toString()} onValueChange={handleClientChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer klant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Geen klant</SelectItem>
                                            {clients.map(client => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Locatie (optioneel)</Label>
                                    <Select value={data.location_id.toString()} onValueChange={handleLocationChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer locatie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Geen locatie</SelectItem>
                                            {filteredLocations.map(location => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {location.name} {location.client && `(${location.client.name})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_name">Klantnaam *</Label>
                                    <Input
                                        id="customer_name"
                                        value={data.customer_name}
                                        onChange={e => setData('customer_name', e.target.value)}
                                        placeholder="Naam van de klant"
                                    />
                                    {errors.customer_name && (
                                        <p className="text-sm text-destructive">{errors.customer_name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer_email">E-mail</Label>
                                    <Input
                                        id="customer_email"
                                        type="email"
                                        value={data.customer_email}
                                        onChange={e => setData('customer_email', e.target.value)}
                                        placeholder="klant@voorbeeld.nl"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_phone">Telefoon</Label>
                                    <Input
                                        id="customer_phone"
                                        value={data.customer_phone}
                                        onChange={e => setData('customer_phone', e.target.value)}
                                        placeholder="06-12345678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="template_id">Template *</Label>
                                    <Select value={data.template_id} onValueChange={v => setData('template_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templates.map(template => (
                                                <SelectItem key={template.id} value={template.id.toString()}>
                                                    {template.name} {template.is_default && '(Standaard)'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.template_id && (
                                        <p className="text-sm text-destructive">{errors.template_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer_address">Adres</Label>
                                <Textarea
                                    id="customer_address"
                                    value={data.customer_address}
                                    onChange={e => setData('customer_address', e.target.value)}
                                    placeholder="Straat en huisnummer&#10;Postcode Plaats"
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="markup_percentage">Standaard Marge (%)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="markup_percentage"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={data.markup_percentage}
                                            onChange={e => setData('markup_percentage', parseFloat(e.target.value) || 0)}
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="secondary" onClick={applyGlobalMarkup}>
                                            Toepassen
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="valid_until">Geldig tot</Label>
                                    <Input
                                        id="valid_until"
                                        type="date"
                                        value={data.valid_until}
                                        onChange={e => setData('valid_until', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Offerte Regels</CardTitle>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept=".pdf,.xlsx,.xls,.csv"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={extracting}
                                    >
                                        {extracting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verwerken...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Importeer PDF/Excel
                                            </>
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={addLine}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Regel Toevoegen
                                    </Button>
                                </div>
                            </div>
                            {extractError && (
                                <p className="text-sm text-destructive">{extractError}</p>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[300px]">Omschrijving</TableHead>
                                            <TableHead className="w-[80px]">Aantal</TableHead>
                                            <TableHead className="w-[80px]">Eenheid</TableHead>
                                            <TableHead className="w-[100px]">Inkoopprijs</TableHead>
                                            <TableHead className="w-[80px]">Marge %</TableHead>
                                            <TableHead className="w-[100px]">Verkoopprijs</TableHead>
                                            <TableHead className="w-[100px]">Totaal</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.lines.map((line, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Input
                                                        value={line.description}
                                                        onChange={e => updateLine(index, 'description', e.target.value)}
                                                        placeholder="Omschrijving"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={line.quantity}
                                                        onChange={e => updateLine(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={line.unit || ''}
                                                        onChange={e => updateLine(index, 'unit', e.target.value)}
                                                        placeholder="stuks"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={line.unit_cost}
                                                        onChange={e => updateLine(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        value={line.markup_percentage}
                                                        onChange={e => updateLine(index, 'markup_percentage', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatPrice(line.unit_price)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatPrice(line.total)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeLine(index)}
                                                        disabled={data.lines.length <= 1}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Totals */}
                            <div className="mt-4 flex justify-end">
                                <div className="w-[300px] space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Inkoopprijs totaal:</span>
                                        <span>{formatPrice(totalCost)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Marge totaal:</span>
                                        <span className="text-green-600">{formatPrice(totalMarkup)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                        <span>Totaal:</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {errors.lines && (
                                <p className="mt-2 text-sm text-destructive">{errors.lines}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Notes Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Opmerkingen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Interne opmerkingen bij deze offerte..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    {/* Actions */}
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
