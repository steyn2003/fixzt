import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type CalculationTemplate } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';

interface Props {
    template: CalculationTemplate;
}

export default function CalculationTemplateEdit({ template }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Calculatie Templates', href: '/dashboard/calculation-templates' },
        { title: template.name, href: `/dashboard/calculation-templates/${template.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        description: template.description || '',
        content: template.content || '',
        is_default: template.is_default,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/calculation-templates/${template.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Template Bewerken - ${template.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Template Bewerken
                        </CardTitle>
                        <CardDescription>
                            Bewerk de calculatie template
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Naam *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Beschrijving</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_default"
                                    checked={data.is_default}
                                    onCheckedChange={(checked) => setData('is_default', checked as boolean)}
                                />
                                <Label htmlFor="is_default">Standaard template</Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Opslaan...' : 'Opslaan'}
                                </Button>
                                <Link href="/dashboard/calculation-templates">
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
