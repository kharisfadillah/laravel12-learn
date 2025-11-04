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

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Role', href: '/roles' },
    { title: 'Tambah', href: '/roles/create' },
];

export default function Create({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as number[],
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
        post('/roles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Role" />

            <div className="max-w-lg rounded bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Tambah Role</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data role baru. Klik simpan untuk menyimpan data.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* Input nama role */}
                    <div>
                        <Label htmlFor="name">Nama Role</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Masukkan nama role" />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Daftar permission */}
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

                    {/* Tombol aksi */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Link href="/roles">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
