import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Company {
    id: number;
    name: string;
}

interface RoleCompany {
    role_id: string;
    company_id: string;
}

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    role_company: RoleCompany[];
}

interface Props {
    roles: Role[];
    companies: Company[];
    user: User;
}

export default function Edit({ roles, companies, user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pengguna', href: '/user' },
        { title: 'Edit', href: `/user/${user.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        username: user.username || '',
        name: user.name || '',
        email: user.email || '',
        role_company: user.role_company.length
            ? user.role_company.map((rc) => ({
                  role_id: rc.role_id.toString(),
                  company_id: rc.company_id.toString(),
              }))
            : [{ role_id: '', company_id: '' }],
    });

    const addRow = () => {
        setData('role_company', [...data.role_company, { role_id: '', company_id: '' }]);
    };

    const removeRow = (index: number) => {
        const updated = [...data.role_company];
        updated.splice(index, 1);
        setData('role_company', updated);
    };

    const handleChange = (index: number, field: 'role_id' | 'company_id', value: string) => {
        const updated = [...data.role_company];
        updated[index][field] = value;
        setData('role_company', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/user/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pengguna" />

            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
                <h2 className="mb-1 text-2xl font-semibold">Edit Pengguna</h2>
                <p className="mb-6 text-sm text-gray-500">Perbarui data pengguna. Klik simpan untuk menyimpan perubahan.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Masukkan username"
                        />
                        {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                    </div>

                    {/* Nama */}
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Masukkan nama" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Masukkan email" />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Role dan Company */}
                    <div>
                        <Label>Role</Label>
                        <div className="mt-2 space-y-4">
                            {data.role_company.map((rc, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Select value={rc.role_id} onValueChange={(v) => handleChange(index, 'role_id', v)}>
                                            <SelectTrigger className="w-1/2">
                                                <SelectValue placeholder="Pilih Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id.toString()}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select value={rc.company_id} onValueChange={(v) => handleChange(index, 'company_id', v)}>
                                            <SelectTrigger className="w-1/2">
                                                <SelectValue placeholder="Pilih Unit Usaha" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={company.id.toString()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeRow(index)}
                                            disabled={data.role_company.length === 1}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>

                                    {errors[`role_company.${index}.role_id`] && (
                                        <p className="mt-1 text-sm text-red-500">{errors[`role_company.${index}.role_id`]}</p>
                                    )}
                                    {errors[`role_company.${index}.company_id`] && (
                                        <p className="mt-1 text-sm text-red-500">{errors[`role_company.${index}.company_id`]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Error array kosong */}
                        {errors['role_company'] && <p className="mt-1 text-sm text-red-500">{errors['role_company']}</p>}

                        <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={addRow}>
                            <Plus className="mr-1" size={14} /> Tambah Role
                        </Button>
                    </div>

                    {/* Tombol aksi */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Link href="/user">
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
