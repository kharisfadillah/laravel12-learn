import { User } from '@/types';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

interface AuthProps extends PageProps {
    auth: {
        user: User;
        permissions: string[];
    };
}

// export function useCan(permission: string | string[]) {
//     const { auth } = usePage<AuthProps>().props;

//     if (Array.isArray(permission)) {
//         return permission.some((p) => auth.permissions.includes(p));
//     }

//     return auth.permissions.includes(permission);
// }

export function useCan() {
    const { auth } = usePage<AuthProps>().props;
    const sa = auth.user.is_sa;
    const permissions = auth.permissions;

    const can = (permission: string): boolean => {
        if (sa) return true;

        return permissions.includes(permission);
    };

    can.all = (permission: string[]): boolean => {
        if (sa) return true;

        return permission.every((p) => permissions.includes(p));
    };

    can.any = (permission: string[]): boolean => {
        if (sa) return true;

        return permission.some((p) => permissions.includes(p));
    };

    return can;
}

// export function useCan() {
//     const { auth } = usePage<AuthProps>().props;

//     const can = (permission: string | string[]): boolean => {
//         if (auth.user.is_sa) {
//             return true;
//         }
//         if (Array.isArray(permission)) {
//             return permission.some((p) => auth.permissions.includes(p));
//         }

//         return auth.permissions.includes(permission);
//     };

//     return can;
// }
