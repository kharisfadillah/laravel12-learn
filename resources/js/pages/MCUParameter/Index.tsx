import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MCUCategory {
    id: string;
    name: string;
}

interface MCUParameter {
    id: string;
    category_id: string;
    name: string;
    input_type: string;
    l_min_value: number;
    p_min_value: number;
    l_max_value: number;
    p_max_value: number;
    category?: MCUCategory;
}

interface Props {
    mcuparameters: {
        data: MCUParameter[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Parameter MCU', href: '/mcu-parameter' }];

export default function Index({ mcuparameters, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedParameter, setSelectedParameter] = useState<MCUParameter | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/mcu-parameter', { search });
    };

    const handleDeleteClick = (param: MCUParameter) => {
        setSelectedParameter(param);
        setOpenDelete(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedParameter) {
            router.delete(`/mcu-parameter/${selectedParameter.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedParameter(null);
                },
            });
        }
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Parameter MCU" />

            <div className="flex h-full max-w-3xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input placeholder="Cari parameter..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                        <Button type="submit" variant="outline">
                            <Search className="mr-2 h-4 w-4" /> Cari
                        </Button>
                    </form>

                    {/* Header */}
                    <div className="flex justify-end">
                        <Link href="/mcu-parameter/create">
                            <Button>Tambah Parameter MCU</Button>
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Tipe Input</TableHead>
                            <TableHead>Nilai Rujukan</TableHead>
                            <TableHead className="w-[60px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {mcuparameters.data.length > 0 ? (
                            mcuparameters.data.map((parameter) => (
                                <TableRow key={parameter.id}>
                                    <TableCell>{parameter.name}</TableCell>
                                    <TableCell>{parameter.name}</TableCell>
                                    <TableCell>{parameter.input_type}</TableCell>
                                    <TableCell></TableCell>

                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/mcu-parameter/${parameter.id}/edit`}>
                                                <Button size="sm" variant="outline">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(parameter)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    Tidak ada data parameter MCU.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {mcuparameters.total > 10 && (
                    <div className="flex justify-end gap-2">
                        {mcuparameters.links.map((link, i) =>
                            link.url ? (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    onClick={() => handlePageChange(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <Button key={i} variant="ghost" disabled>
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ),
                        )}
                    </div>
                )}

                {/* Modal Konfirmasi Hapus */}
                <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Parameter MCU</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus parameter <strong>{selectedParameter?.name}</strong>? Tindakan ini tidak dapat
                                dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>

                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
