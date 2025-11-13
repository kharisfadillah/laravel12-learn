'use client';

import type React from 'react';

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
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Ellipsis, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Province {
    id: number;
    code: string;
    name: string;
}

interface Props {
    provinces: {
        data: Province[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Provinsi',
        href: '/province',
    },
];

export default function Index({ provinces, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    // const [openDropdown, setOpenDropdown] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: number]: boolean }>({});
    const [search, setSearch] = useState(filters.search ?? '');
    const [createData, setCreateData] = useState({ code: '', name: '' });
    const [createErrors, setCreateErrors] = useState({ code: '', name: '' });
    const [createProcessing, setCreateProcessing] = useState(false);
    const [editData, setEditData] = useState({ code: '', name: '' });
    const [editErrors, setEditErrors] = useState({ code: '', name: '' });
    const [editProcessing, setEditProcessing] = useState(false);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/province', { search });
    };

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreateProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setCreateProcessing(false);
            setOpenCreate(false);
            // Reset form data
            setCreateData({ code: '', name: '' });
            setCreateErrors({ code: '', name: '' });
            // Add new province to list
            provinces.data.push(createData as Province);
        }, 2000);
    };

    const handleEditClick = (province: Province) => {
        setOpenDropdowns((prev) => ({ ...prev, [province.id]: false }));
        setSelectedProvince(province);
        setEditData({
            code: province.code,
            name: province.name,
        });
        // setOpenDropdown(false);
        setOpenEdit(true);
    };

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setEditProcessing(false);
            setOpenEdit(false);
            // Update province in list
            const index = provinces.data.findIndex((p) => p.id === selectedProvince?.id);
            if (index !== -1) {
                provinces.data[index] = editData as Province;
            }
        }, 2000);
    };

    const handleDeleteClick = (province: Province) => {
        setOpenDropdowns((prev) => ({ ...prev, [province.id]: false }));
        setSelectedProvince(province);
        // setOpenDropdown(false);
        setOpenDelete(true);
    };

    const handleDeleteConfirm = () => {
        // Simulate API call
        setTimeout(() => {
            setOpenDelete(false);
            // Remove province from list
            const index = provinces.data.findIndex((p) => p.id === selectedProvince?.id);
            if (index !== -1) {
                provinces.data.splice(index, 1);
            }
        }, 2000);
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Province" />
            <div className="flex h-full max-w-3xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Search & Tambah */}
                <div className="flex items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input placeholder="Cari provinsi..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                        <Button type="submit" variant="outline">
                            <Search className="mr-2 h-4 w-4" /> Cari
                        </Button>
                    </form>

                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Tambah Provinsi</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Provinsi</DialogTitle>
                                    <DialogDescription>Masukkan data provinsi baru. Klik simpan untuk menyimpan data.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_province_code">Kode Provinsi</Label>
                                        <Input
                                            id="create_province_code"
                                            value={createData.code}
                                            onChange={(e) => setCreateData({ ...createData, code: e.target.value })}
                                            placeholder="Masukkan kode provinsi"
                                        />
                                        {createErrors.code && <p className="text-sm text-red-500">{createErrors.code}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_province_name">Nama Provinsi</Label>
                                        <Input
                                            id="create_province_name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                                            placeholder="Masukkan nama provinsi"
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

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Nama Provinsi</TableHead>
                            <TableHead className="w-[150px] text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {provinces.data.length > 0 ? (
                            provinces.data.map((province) => (
                                <TableRow key={province.id}>
                                    <TableCell className="py-0.5">{province.code}</TableCell>
                                    <TableCell className="py-0.5">{province.name}</TableCell>
                                    <TableCell className="py-0.5">
                                        <div className="mt-0 flex justify-center">
                                            <DropdownMenu
                                                open={openDropdowns[province.id] || false}
                                                onOpenChange={(open) => setOpenDropdowns((prev) => ({ ...prev, [province.id]: open }))}
                                            >
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost">
                                                        <Ellipsis size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56" align="start">
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditClick(province)}
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
                                                        onSelect={(event) => {
                                                            event.preventDefault();
                                                            handleDeleteClick(province);
                                                        }}
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
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {provinces.total > 10 && (
                    <div className="flex justify-end gap-2">
                        {provinces.links.map((link, i) =>
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
                                <DialogTitle>Edit Provinsi</DialogTitle>
                                <DialogDescription>Ubah data provinsi. Klik simpan untuk menyimpan perubahan.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_province_code">Kode Provinsi</Label>
                                    <Input
                                        id="edit_province_code"
                                        value={editData.code}
                                        onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                                        placeholder="Masukkan kode provinsi"
                                    />
                                    {editErrors.code && <p className="text-sm text-red-500">{editErrors.code}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_province_name">Nama Provinsi</Label>
                                    <Input
                                        id="edit_province_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        placeholder="Masukkan nama provinsi"
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
                                Tindakan ini tidak dapat dibatalkan. Data provinsi <strong>{selectedProvince?.name}</strong> akan dihapus secara
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
