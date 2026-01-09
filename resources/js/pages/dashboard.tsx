import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Eye,
    FolderKanban,
    Mail,
    MessageSquare,
    TrendingUp,
} from 'lucide-react';

interface ContactSubmission {
    id: number;
    name: string;
    subject: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    created_at: string;
}

interface ProjectLocation {
    id: number;
    name: string;
    client: {
        id: number;
        name: string;
    };
}

interface Project {
    id: number;
    title: string;
    status: 'quote' | 'approved' | 'in_progress' | 'completed' | 'invoiced';
    location: ProjectLocation;
    created_at: string;
}

interface Props {
    contactStats: {
        total: number;
        new: number;
    };
    recentContacts: ContactSubmission[];
    projectStats: {
        total: number;
        active: number;
    };
    recentProjects: Project[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const contactStatusLabels: Record<string, string> = {
    new: 'Nieuw',
    read: 'Gelezen',
    replied: 'Beantwoord',
    archived: 'Gearchiveerd',
};

const contactStatusColors: Record<string, string> = {
    new: 'bg-blue-500',
    read: 'bg-gray-500',
    replied: 'bg-green-500',
    archived: 'bg-yellow-500',
};

const projectStatusLabels: Record<string, string> = {
    quote: 'Offerte',
    approved: 'Goedgekeurd',
    in_progress: 'In Uitvoering',
    completed: 'Afgerond',
    invoiced: 'Gefactureerd',
};

const projectStatusColors: Record<string, string> = {
    quote: 'bg-yellow-500',
    approved: 'bg-blue-500',
    in_progress: 'bg-purple-500',
    completed: 'bg-green-500',
    invoiced: 'bg-gray-500',
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

export default function Dashboard({
    contactStats,
    recentContacts,
    projectStats,
    recentProjects,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
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

                    {/* Total Projects Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Totaal Projecten
                            </CardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {projectStats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Alle projecten
                            </p>
                        </CardContent>
                    </Card>

                    {/* Active Projects Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Actieve Projecten
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {projectStats.active}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                In uitvoering
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                                                            contactStatusColors[
                                                                contact.status
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            contactStatusLabels[
                                                                contact.status
                                                            ]
                                                        }
                                                    </Badge>
                                                </div>
                                                <p className="max-w-md truncate text-sm text-muted-foreground">
                                                    {contact.subject}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        contact.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/dashboard/contacts/${contact.id}`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Projects Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FolderKanban className="h-5 w-5" />
                                        Recente Projecten
                                    </CardTitle>
                                    <CardDescription>
                                        De laatste 5 projecten
                                    </CardDescription>
                                </div>
                                <Link href="/dashboard/projects">
                                    <Button variant="outline" size="sm">
                                        Bekijk Alle
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentProjects.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    Nog geen projecten aangemaakt.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {project.title}
                                                    </span>
                                                    <Badge
                                                        className={
                                                            projectStatusColors[
                                                                project.status
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            projectStatusLabels[
                                                                project.status
                                                            ]
                                                        }
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        project.location?.client
                                                            ?.name
                                                    }{' '}
                                                    - {project.location?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        project.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/dashboard/projects/${project.id}`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
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
            </div>
        </AppLayout>
    );
}
