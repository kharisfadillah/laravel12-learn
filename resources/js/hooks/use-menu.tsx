import { usePage } from '@inertiajs/react';

export function useMenu() {
    const { url } = usePage();

    const clean = (path: string) => {
        return path.split("?")[0].replace(/\/+$/, "");
    };

    const isActive = (href: string): boolean => {
        const current = clean(url);
        const target = clean(href);

        if (current === target) return true;

        return current.startsWith(target + "/");
    };

    return isActive;
}
