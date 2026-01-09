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
import { MapPin } from 'lucide-react';

interface Client {
    id: number;
    name: string;
}

interface Props {
    clients: Client[];
    selectedClientId: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Locaties', href: '/dashboard/locations' },
    { title: 'Nieuwe Locatie', href: '/dashboard/locations/create' },
];

const buildingTypes = [
    { value: 'kantoor', label: 'Kantoor' },
    { value: 'winkel', label: 'Winkel' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'zorg', label: 'Zorg' },
    { value: 'industrial', label: 'Industrieel' },
    { value: 'residential', label: 'Wonen' },
    { value: 'overig', label: 'Overig' },
];

export default function LocationCreate({ clients, selectedClientId }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: selectedClientId || '',
        name: '',
        address: '',
        postal_code: '',
        city: '',
        building_type: 'overig',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/locations');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nieuwe Locatie" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Nieuwe Locatie
                        </CardTitle>
                        <CardDescription>
                            Voeg een nieuwe locatie toe aan het systeem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="client_id">Klant *</Label>
                                <Select
                                    value={data.client_id}
                                    onValueChange={(value) => setData('client_id', value)}
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
                                {errors.client_id && (
                                    <p className="text-sm text-destructive">{errors.client_id}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Locatienaam *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Bijv. Winkelcentrum De Boog"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="building_type">Type Gebouw *</Label>
                                    <Select
                                        value={data.building_type}
                                        onValueChange={(value) => setData('building_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {buildingTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.building_type && (
                                        <p className="text-sm text-destructive">{errors.building_type}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Adres *</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Straatnaam 123"
                                />
                                {errors.address && (
                                    <p className="text-sm text-destructive">{errors.address}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postcode *</Label>
                                    <Input
                                        id="postal_code"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        placeholder="1234 AB"
                                    />
                                    {errors.postal_code && (
                                        <p className="text-sm text-destructive">{errors.postal_code}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">Stad *</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Amsterdam"
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-destructive">{errors.city}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notities</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Bijv. toegangscodes, bijzonderheden..."
                                    rows={4}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-destructive">{errors.notes}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Opslaan...' : 'Locatie Aanmaken'}
                                </Button>
                                <Link href="/dashboard/locations">
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
