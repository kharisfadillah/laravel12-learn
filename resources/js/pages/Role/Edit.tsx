import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    notes: string | null;
    permissions: number[];
}

interface Props {
    role: Role;
    permissions: Permission[];
}

export default function Edit({ role, permissions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Role', href: '/role' },
        { title: 'Edit', href: `/role/${role.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        notes: role.notes || '',
        permissions: role.permissions || [],
    });

    const handleCheckboxChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, id]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((pid) => pid !== id),
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/role/${role.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role - ${role.name}`} />

            <div className="max-w-lg bg-white p-6">
                <h2 className="text-xl font-semibold">Edit Role</h2>
                <p className="mt-1 text-sm text-gray-500">Ubah data role yang sudah ada. Klik simpan untuk menyimpan perubahan.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <Label htmlFor="name">Nama Role</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Masukkan nama role" />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="notes">Keterangan</Label>
                        <Input
                            id="notes"
                            value={data.notes || ''}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Masukkan keterangan"
                        />
                        {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                    </div>

                    <div>
                        <Label>Hak Akses</Label>
                        <div className="max-h-40 overflow-y-auto rounded border p-2">
                            {permissions.map((perm) => (
                                <label key={perm.id} className="flex items-center gap-2 py-1">
                                    <input
                                        type="checkbox"
                                        checked={data.permissions.includes(perm.id)}
                                        onChange={(e) => handleCheckboxChange(perm.id, e.target.checked)}
                                    />
                                    <span>{perm.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Link href="/role">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
