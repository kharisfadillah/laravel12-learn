import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Province {
    id: number;
    province_code: string;
    province_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Province',
        href: '/province',
    },
];

export default function Province() {
    // const { provinces } = usePage<PageProps<{ provinces: Province[] }>>().props;
    const { provinces } = usePage<{ provinces: Province[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Province" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end mb-4">
                    <Link href="/province/create">
                        <Button>Tambah Provinsi</Button>
                    </Link>
                </div>
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Kode Provinsi</TableHead>
                            <TableHead>Nama Provinsi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {provinces.map((province) => (
                            <TableRow key={province.id}>
                                <TableCell>{province.id}</TableCell>
                                <TableCell>{province.province_code}</TableCell>
                                <TableCell>{province.province_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
