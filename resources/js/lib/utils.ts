import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRange(range?: { min?: string; max?: string }) {
    if (!range) return "-";

    const { min, max } = range;

    if (min && max) return `${min} – ${max}`;
    if (min) return `> ${min}`;
    if (max) return `< ${max}`;

    return "-";
}
