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

export interface Province {
    id: string;
    name: string;
}

export interface Regency {
    id: string;
    name: string;
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

export interface Provider {
    id: string;
    name: string;
    province_id?: string;
    regency_id?: string;
    address: string;
    phone?: string;
    // province?: 
}

export interface Media {
    id: string;
    model_type: string;
    model_id: string;
    collection: string;
    name: string;
    file_name: string;
    mime_type: string | null;
    disk: string;
    size: number | null;
    url: string | null;
    url_public: string;
    full_url: string;
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
    unit?: string | null;
    ranges?: {
        male: { min: string; max: string };
        female: { min: string; max: string };
    } | null;
    options?: string[] | null;
    category?: MCUCategory;
}

export interface MCUIHeader {
    id: string;
    company_id: string;
    mcu_type: string;
    mcu_date: string;
    participant_id: string;
    name: string;
    position: string;
    department_name: string;
    gender: string;
    conclusion: string;
    recommendation: string;
    created_at: string;
    company?: Company;
    provider?: Provider;
    participant?: Participant;
    items: MCUIItem[];
    attachments: Media[];
    followup?: MCUFHeader;
}

export interface MCUIItem {
    id: string;
    header_id: string;
    category_id: string;
    parameter_id: string;
    name: string;
    input_type: string;
    unit?: string | null;
    ranges?: {
        male: { min: string; max: string };
        female: { min: string; max: string };
    } | null;
    options?: string[] | null;
    result: string;
    notes?: string | null;
    category?: MCUCategory | null;
}

export type MCUParamResult = {
    id: string;
    category_id: string;
    category: string;
    name: string;
    input_type: string;
    unit?: string | null;
    ranges?: {
        male: { min: string; max: string };
        female: { min: string; max: string };
    } | null;
    options?: string[];
    result: string;
    notes: string;
};

export interface MCUFHeader {
    id: string;
    mcu_date: string;
    provider_id: string;
    conclusion: string;
    recommendation: string;
    created_at: string;
    company?: Company;
    provider?: Provider;
    items: MCUIItem[];
    attachments: Media[];
}


