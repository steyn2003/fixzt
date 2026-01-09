import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, Mail, MessageSquare } from 'lucide-react';

interface ContactSubmission {
    id: number;
    name: string;
    subject: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    created_at: string;
}

interface Props {
    contactStats: {
        total: number;
        new: number;
    };
    recentContacts: ContactSubmission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
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

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function Dashboard({ contactStats, recentContacts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Total Contacts Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Totaal Berichten
                            </CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {contactStats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Alle contactformulieren
                            </p>
                        </CardContent>
                    </Card>

                    {/* New Messages Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Nieuwe Berichten
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {contactStats.new}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ongelezen berichten
                            </p>
                        </CardContent>
                    </Card>

                    {/* Placeholder for future stat */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                {/* Recent Contacts Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Recente Berichten
                                </CardTitle>
                                <CardDescription>
                                    De laatste 5 contactformulieren
                                </CardDescription>
                            </div>
                            <Link href="/dashboard/contacts">
                                <Button variant="outline" size="sm">
                                    Bekijk Alle
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentContacts.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                Nog geen contactberichten ontvangen.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentContacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className={`flex items-center justify-between rounded-lg border p-4 ${
                                            contact.status === 'new'
                                                ? 'bg-blue-50 dark:bg-blue-950/20'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {contact.name}
                                                </span>
                                                <Badge
                                                    className={
                                                        statusColors[
                                                            contact.status
                                                        ]
                                                    }
                                                >
                                                    {
                                                        statusLabels[
                                                            contact.status
                                                        ]
                                                    }
                                                </Badge>
                                            </div>
                                            <p className="max-w-md truncate text-sm text-muted-foreground">
                                                {contact.subject}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(contact.created_at)}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/dashboard/contacts/${contact.id}`}
                                        >
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
