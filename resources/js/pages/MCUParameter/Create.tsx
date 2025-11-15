import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface MCUCategory {
    id: string;
    name: string;
}

interface Props {
    mcucategories: MCUCategory[];
    inputtypes: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Parameter MCU', href: '/mcu-parameter' },
    { title: 'Tambah', href: '/mcu-parameter/create' },
];

export default function Create({ mcucategories, inputtypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        input_type: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mcu-parameter');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Parameter MCU" />

            <div className="max-w-5xl p-6">
                <h2 className="text-xl font-semibold">Tambah Parameter MCU</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data parameter baru. Klik simpan untuk menyimpan data.</p>

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="category_id">Kategori</Label>
                            <Select name="category_id" value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {mcucategories.map((category) => (
                                            <SelectItem value={category.id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama parameter"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="types">Tipe Input</Label>
                            <Select name="types" value={data.input_type} onValueChange={(value) => setData('input_type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tipe Input" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {inputtypes.map((inputtype) => (
                                            <SelectItem value={inputtype}>{inputtype}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.input_type && <p className="text-sm text-red-500">{errors.input_type}</p>}
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
