import { User } from '@/types';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

interface AuthProps extends PageProps {
    auth: {
        user: User;
        permissions: string[];
    };
}

export function useCan(permission: string) {
    const { auth } = usePage<AuthProps>().props;

    // return auth;

    // if (Array.isArray(permission)) {
    //     return permission.some((p) => permissions.includes(p));
    // }

    return auth.permissions.includes(permission);
    // return auth;
}
