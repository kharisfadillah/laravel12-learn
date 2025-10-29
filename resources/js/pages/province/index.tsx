import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Province {
    id: number;
    province_code: string;
    province_name: string;
}

interface Props {
    provinces: Province[],
    flash?: {
        success?: string;
        error?: string;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Province',
        href: '/province',
    },
];

export default function Index({ provinces, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
        }
    });

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
