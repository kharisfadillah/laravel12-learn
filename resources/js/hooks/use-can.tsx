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

    const can = (permission: string | string[]): boolean => {
        if (auth.user.is_sa) {
            return true;
        }
        if (Array.isArray(permission)) {
            return permission.some((p) => auth.permissions.includes(p));
        }

        return auth.permissions.includes(permission);
    };

    return can;
}
