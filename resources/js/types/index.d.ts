import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Client {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
}

export interface Location {
    id: number;
    name: string;
    address: string;
    city: string;
    client_id: number;
    client?: Client;
}

export interface Project {
    id: number;
    title: string;
    status: string;
    type: string;
    location_id: number;
    quoted_price: string | null;
}

export interface QuoteTemplate {
    id: number;
    name: string;
    description: string | null;
    content: string | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface QuoteLine {
    id?: number;
    quote_id?: number;
    description: string;
    quantity: number;
    unit: string | null;
    unit_cost: number;
    markup_percentage: number;
    unit_price: number;
    total: number;
    sort_order: number;
}

export interface Quote {
    id: number;
    quote_number: string;
    client_id: number | null;
    location_id: number | null;
    project_id: number | null;
    template_id: number;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    customer_address: string | null;
    markup_percentage: number;
    notes: string | null;
    valid_until: string | null;
    converted_at: string | null;
    created_at: string;
    updated_at: string;
    client?: Client;
    location?: Location;
    project?: Project;
    template?: QuoteTemplate;
    lines?: QuoteLine[];
    total?: number;
}
