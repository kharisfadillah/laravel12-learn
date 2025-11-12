import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Company {
    id: string;
    name: string;
}

interface Department {
    id: string;
    name: string;
    company_id: string;
}

interface Props {
    companies: Company[];
    departments: Department[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kandidat', href: '/participant' },
    { title: 'Tambah', href: '/participant/create' },
];

export default function Create({ companies, departments }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: '',
        name: '',
        position: '',
        department_id: '',
        birth_date: '',
        gender: '',
        phone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/participant');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kandidat" />

            <div className="max-w-5xl p-6">
                <h2 className="text-xl font-semibold">Tambah Kandidat</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data kandidat baru. Klik simpan untuk menyimpan data.</p>

                {/* <form onSubmit={handleSubmit} className="mt-3 space-y-4"> */}
                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="company_id">Unit Usaha</Label>
                            <select
                                id="company_id"
                                value={data.company_id}
                                // onChange={(e) => console.log(e.target.value)}
                                onChange={(e) => {
                                    setData('company_id', e.target.value);
                                    setData('department_id', '');
                                }}
                                className="w-full rounded-md border p-2"
                            >
                                <option value="">Pilih Unit Usaha</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            {errors.company_id && <p className="text-sm text-red-500">{errors.company_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama kandidat"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="position">Jabatan</Label>
                            <Input
                                id="position"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                                placeholder="Masukkan jabatan"
                            />
                            {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                        </div>

                        <div>
                            <Label htmlFor="department_id">Departemen</Label>
                            <select
                                id="department_id"
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                                className="w-full rounded-md border p-2"
                                disabled={data.company_id == '0'} // nonaktif kalau belum pilih unit usaha
                            >
                                <option value="">Pilih Departemen</option>
                                {departments
                                    .filter((d) => d.company_id === data.company_id)
                                    .map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                            </select>
                            {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="birth_date">Tanggal Lahir</Label>
                            <input
                                type="date"
                                id="birth_date"
                                value={data.birth_date}
                                onChange={(e) => setData('birth_date', e.target.value)}
                                className="w-full rounded-md border p-2"
                            />
                            {errors.birth_date && <p className="text-sm text-red-500">{errors.birth_date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="gender">Jenis Kelamin</Label>
                            <select
                                id="gender"
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="w-full rounded-md border p-2"
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <input
                                type="tel"
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Masukkan nomor telepon"
                                className="w-full rounded-md border p-2"
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2 border-t pt-6">
                        <Link href="/role">
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
