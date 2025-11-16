import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';

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

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="company_id">Unit Usaha</Label>
                            <Select
                                value={data.company_id}
                                onValueChange={(value) => {
                                    setData('company_id', value);
                                    setData('department_id', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Unit Usaha" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company) => (
                                            <SelectItem value={company.id}>{company.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
                            <Select value={data.department_id} onValueChange={(value) => setData('department_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Departemen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {departments
                                            .filter((d) => d.company_id === data.company_id)
                                            .map((department) => (
                                                <SelectItem value={department.id}>{department.name}</SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="birth_date">Tanggal Lahir</Label>
                            <DatePicker
                                value={data.birth_date ? new Date(data.birth_date) : undefined}
                                onChange={(date) => setData('birth_date', date ? format(date, 'yyyy-MM-dd') : '')}
                            />
                            {errors.birth_date && <p className="text-sm text-red-500">{errors.birth_date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="gender">Jenis Kelamin</Label>
                            <Select onValueChange={(value) => setData('gender', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* <SelectLabel>Jenis Kelamin</SelectLabel> */}
                                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input
                                type="tel"
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Masukkan nomor telepon"
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2 border-t pt-6">
                        <Link href="/participant">
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
