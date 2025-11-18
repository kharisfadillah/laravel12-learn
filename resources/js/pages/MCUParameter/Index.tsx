import { RangeDisplay } from '@/components/range-display';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatRange } from '@/lib/utils';
import type { BreadcrumbItem, MCUParameter } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Ellipsis, Mars, Pencil, Search, Trash2, Venus } from 'lucide-react';
import { JSX, useState } from 'react';

// interface MCUParameter {
//     id: string;
//     category_id: string;
//     name: string;
//     input_type: string;
//     ranges: {
//         male: { min: string; max: string };
//         female: { min: string; max: string };
//     } | null; // kalau bukan Angka
//     options: string[] | null; // kalau bukan Pilihan
//     category?: MCUCategory;
// }

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

const genderLabels: Record<"male" | "female", string> = {
    male: "Laki-laki",
    female: "Perempuan",
};

const genderIcons: Record<"male" | "female", JSX.Element> = {
    male: <Venus className="inline w-4 h-4 text-blue-600" />,
    female: <Mars className="inline w-4 h-4 text-pink-600" />,
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Parameter MCU', href: '/mcu-parameter' }];

export default function Index({ mcuparameters, filters }: Props) {
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const [search, setSearch] = useState(filters.search ?? '');
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedParameter, setSelectedParameter] = useState<MCUParameter | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/mcu-parameter', { search });
    };

    const handleDeleteClick = (param: MCUParameter) => {
        setOpenDropdowns((prev) => ({ ...prev, [param.id]: false }));
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

            <div className="flex h-full max-w-6xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className='bg-gray-100'>
                            <TableRow>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Tipe Input</TableHead>
                                <TableHead>Satuan</TableHead>
                                <TableHead>Nilai Rujukan</TableHead>
                                <TableHead>Pilihan</TableHead>
                                <TableHead className="w-[60px]" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {mcuparameters.data.length > 0 ? (
                                mcuparameters.data.map((parameter) => (
                                    <TableRow key={parameter.id}>
                                        <TableCell className="py-0.5">{parameter.category?.name}</TableCell>
                                        <TableCell className="py-0.5">{parameter.name}</TableCell>
                                        <TableCell className="py-0.5">{parameter.input_type}</TableCell>
                                        <TableCell className="py-0.5">{parameter.unit ?? '-'}</TableCell>
                                        <TableCell className="py-0.5">
                                            <RangeDisplay ranges={parameter.ranges} genderIcons={genderIcons} />
                                        </TableCell>
                                        <TableCell className="py-0.5">{(parameter.options ?? []).join(", ")}</TableCell>
                                        <TableCell className="py-0.5">
                                            <div className="mt-0 flex justify-end">
                                                <DropdownMenu
                                                    open={openDropdowns[parameter.id] || false}
                                                    onOpenChange={(open) => setOpenDropdowns((prev) => ({ ...prev, [parameter.id]: open }))}
                                                >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" variant="ghost">
                                                            <Ellipsis size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56" align="start">
                                                        <DropdownMenuItem>
                                                            <Link
                                                                href={`/mcu-parameter/${parameter.id}/edit`}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Pencil className="mr-2 w-4 h-4" />
                                                                <span>Edit</span>
                                                            </Link>
                                                            {/* Edit */}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(parameter)}
                                                        // onSelect={(event) => {
                                                        //     event.preventDefault();
                                                        //     handleDeleteClick(province);
                                                        // }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                            <div className="text-destructive">Hapus</div>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                </div>

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
