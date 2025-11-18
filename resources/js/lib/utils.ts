import { MCUParameter, MCUParamResult } from '@/types';
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

export function parseToMCUParameters(results: MCUParamResult[]): MCUParameter[] {
    return results.map(result => ({
        id: result.id,
        category_id: result.category_id,
        name: result.name,
        input_type: result.input_type,
        unit: result.unit,
        ranges: result.ranges,
        options: result.options,
    }));
}

export function parseToMCUParamResults(params: MCUParameter[]): MCUParamResult[] {
    return params.map(item => ({
        id: item.id,
        category_id: item.category_id,
        category: item.category?.name ?? '',
        name: item.name,
        input_type: item.input_type ?? 'Teks Bebas',
        unit: item.unit,
        ranges: item.ranges,
        options: item.options ?? [],
        result: '',
        notes: '',
    }));
}
