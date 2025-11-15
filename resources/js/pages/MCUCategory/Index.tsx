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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Ellipsis, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MCUCategory {
    id: string;
    name: string;
}

interface Props {
    mcucategories: {
        data: MCUCategory[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori MCU',
        href: '/mcu-category',
    },
];

export default function Index({ mcucategories, filters }: Props) {
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const [search, setSearch] = useState(filters.search ?? '');
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<MCUCategory | null>(null);

    // Form untuk Create
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        name: '',
    });

    // Form untuk Edit
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/mcu-category', { search });
    };

    // Handle Create
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mcu-category', {
            onSuccess: () => {
                setOpenCreate(false);
                resetCreate();
            },
        });
    };

    // Handle Edit - Open Modal
    const handleEditClick = (mcucategory: MCUCategory) => {
        setOpenDropdowns((prev) => ({ ...prev, [mcucategory.id]: false }));
        setSelectedCategory(mcucategory);
        setEditData({
            name: mcucategory.name,
        });
        setOpenEdit(true);
    };

    // Handle Edit - Submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCategory) {
            put(`/mcu-category/${selectedCategory.id}`, {
                onSuccess: () => {
                    setOpenEdit(false);
                    resetEdit();
                    setSelectedCategory(null);
                },
            });
        }
    };

    // Handle Delete - Open Modal
    const handleDeleteClick = (mcucategory: MCUCategory) => {
        setOpenDropdowns((prev) => ({ ...prev, [mcucategory.id]: false }));
        setSelectedCategory(mcucategory);
        setOpenDelete(true);
    };

    // Handle Delete - Confirm
    const handleDeleteConfirm = () => {
        if (selectedCategory) {
            router.delete(`/mcu-category/${selectedCategory.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedCategory(null);
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
            <Head title="Kategori MCU" />
            <div className="flex h-full max-w-2xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Button Tambah */}
                <div className="flex items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input placeholder="Cari provinsi..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                        <Button type="submit" variant="outline">
                            <Search className="mr-2 h-4 w-4" /> Cari
                        </Button>
                    </form>

                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Tambah Kategori MCU</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Kategori MCU</DialogTitle>
                                    <DialogDescription>Masukkan data kategori MCU baru. Klik simpan untuk menyimpan data.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_category_name">Nama Kategori</Label>
                                        <Input
                                            id="create_category_name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Masukkan nama kategori"
                                        />
                                        {createErrors.name && <p className="text-sm text-red-500">{createErrors.name}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={createProcessing}>
                                        {createProcessing ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* <div className="max-w-3xl"> */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Kategori</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mcucategories.data.length > 0 ? (
                            mcucategories.data.map((mcucategory) => (
                                <TableRow key={mcucategory.id}>
                                    <TableCell className="py-0.5">{mcucategory.name}</TableCell>
                                    <TableCell className="py-0.5">
                                        <div className="mt-0 flex justify-end">
                                            <DropdownMenu
                                                open={openDropdowns[mcucategory.id] || false}
                                                onOpenChange={(open) => setOpenDropdowns((prev) => ({ ...prev, [mcucategory.id]: open }))}
                                            >
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost">
                                                        <Ellipsis size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56" align="start">
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditClick(mcucategory)}
                                                        // onSelect={(event) => {
                                                        //     event.preventDefault();
                                                        //     handleEditClick(province);
                                                        // }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(mcucategory)}
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
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Tidak ada data kategori MCU
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* </div> */}
                {/* Table */}

                {/* Pagination */}
                {mcucategories.total > 10 && (
                    <div className="flex justify-end gap-2">
                        {mcucategories.links.map((link, i) =>
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

                {/* Modal Edit */}
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleEditSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Kategori MCU</DialogTitle>
                                <DialogDescription>Ubah data kategori MCU. Klik simpan untuk menyimpan perubahan.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_category_name">Nama Kategori</Label>
                                    <Input
                                        id="edit_category_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="Masukkan nama kategori"
                                    />
                                    {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Delete Confirmation */}
                <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Data provinsi <strong>{selectedCategory?.name}</strong> akan dihapus secara
                                permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-white hover:bg-destructive/90">
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
