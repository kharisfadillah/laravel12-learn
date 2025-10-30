import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Province', href: '/province' },
    { title: 'Tambah', href: '/province/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        provinces: [{ province_code: '', province_name: '' }],
    });

    const handleChange = (index: number, field: 'province_code' | 'province_name', value: string) => {
        const updated = [...data.provinces];
        updated[index][field] = value;
        setData('provinces', updated);
    };

    const addRow = () => {
        setData('provinces', [...data.provinces, { province_code: '', province_name: '' }]);
    };

    const removeRow = (index: number) => {
        setData(
            'provinces',
            data.provinces.filter((_, i) => i !== index),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/province');
    };

    const getError = (key: string): string | undefined => {
        return Object.hasOwn(errors, key) ? (errors as Record<string, string>)[key] : undefined;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Provinsi" />

            <div className="mx-auto max-w-3xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Provinsi (Tabel)</CardTitle>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">Kode Provinsi</TableHead>
                                            <TableHead>Nama Provinsi</TableHead>
                                            <TableHead className="w-[100px] text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.provinces.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Input
                                                        value={item.province_code}
                                                        onChange={(e) => handleChange(index, 'province_code', e.target.value)}
                                                        placeholder="Contoh: ID-JB"
                                                    />
                                                    {getError(`provinces.${index}.province_code`) && (
                                                        <div className="mt-1 text-sm text-red-500">
                                                            {getError(`provinces.${index}.province_code`)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={item.province_name}
                                                        onChange={(e) => handleChange(index, 'province_name', e.target.value)}
                                                        placeholder="Contoh: Jawa Barat"
                                                    />
                                                    {getError(`provinces.${index}.province_name`) && (
                                                        <div className="mt-1 text-sm text-red-500">
                                                            {getError(`provinces.${index}.province_name`)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {data.provinces.length > 1 && (
                                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeRow(index)}>
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <Button type="button" variant="outline" onClick={addRow}>
                                    + Tambah Baris
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end space-x-2">
                            <Link href="/province">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
