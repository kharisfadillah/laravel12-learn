import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    permissions: string[];
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
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    is_sa: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Company {
    id: string;
    code: string;
    name: string;
}

export interface Department {
    id: string;
    name: string;
}

export interface Participant {
    id: string;
    company_id: string;
    name: string;
    position?: string;
    department_id: string;
    birth_date?: string;
    gender: string;
    phone?: string;
    company?: Company;
    department?: Department;
}

export interface MCUCategory {
    id: string;
    name: string;
}

export interface MCUParameter {
    id: string;
    category_id: string;
    name: string;
    input_type: string;
    unit?: string;
    ranges?: string;
    options?: string;
    category?: MCUCategory;
}


