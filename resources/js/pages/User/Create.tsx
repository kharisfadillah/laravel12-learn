import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

interface Role {
    id: string;
    name: string;
}

interface Company {
    id: string;
    name: string;
}

interface Props {
    roles: Role[];
    companies: Company[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengguna', href: '/user' },
    { title: 'Tambah', href: '/user/create' },
];

export default function Create({ roles, companies }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        name: '',
        email: '',
        role_company: [{ role_id: '', company_id: '' }],
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
        post('/user');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengguna" />

            <div className="max-w-lg p-6">
                <h2 className="text-xl font-semibold">Tambah Pengguna</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data pengguna baru. Klik simpan untuk menyimpan data.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Masukkan username"
                        />
                        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                    </div>

                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Masukkan nama" />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Masukkan email" />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <Label>Role</Label>
                        <div className="space-y-2">
                            {data.role_company.map((rc, index) => (
                                <div key={index} className="flex items-center gap-2">
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
                                            <SelectValue placeholder="Pilih Company" />
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
                            ))}
                        </div>

                        <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={addRow}>
                            <Plus className="mr-1" size={14} /> Tambah Role
                        </Button>

                        {errors['role_company'] && <p className="text-sm text-red-500">{errors['role_company']}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Link href="/user">
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
