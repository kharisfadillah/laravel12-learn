import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    notes?: string;
}

// interface Permission {
//     id: number;
//     name: string;
//     notes?: string;
// }

interface Props {
    roles: Role[];
    flash: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Role', href: '/role' }];

export default function Index({ roles, flash }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Apakah kamu yakin ingin menghapus role ini?')) {
            destroy(`/role/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Role" />

            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Daftar Role</h2>
                <Link href="/role/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Role
                    </Button>
                </Link>
            </div>

            {flash.success && <div className="mb-4 rounded bg-green-100 p-3 text-green-700">{flash.success}</div>}
            {flash.error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{flash.error}</div>}

            <div className="overflow-x-auto rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nama</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keterangan</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {roles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-gray-500">
                                    Belum ada data role.
                                </td>
                            </tr>
                        )}

                        {roles.map((role, index) => (
                            <tr key={role.id}>
                                <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{role.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{role.notes || '-'}</td>
                                <td className="space-x-2 px-4 py-3 text-right">
                                    <Link href={`/role/${role.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" disabled={processing} onClick={() => handleDelete(role.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
