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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Province {
    id: number;
    province_code: string;
    province_name: string;
}

interface Props {
    provinces: Province[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Province',
        href: '/province',
    },
];

export default function Index({ provinces }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

    // Form untuk Create
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        province_code: '',
        province_name: '',
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
        province_code: '',
        province_name: '',
    });

    // Handle Create
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/province', {
            onSuccess: () => {
                setOpenCreate(false);
                resetCreate();
            },
        });
    };

    // Handle Edit - Open Modal
    const handleEditClick = (province: Province) => {
        setSelectedProvince(province);
        setEditData({
            province_code: province.province_code,
            province_name: province.province_name,
        });
        setOpenEdit(true);
    };

    // Handle Edit - Submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProvince) {
            put(`/province/${selectedProvince.id}`, {
                onSuccess: () => {
                    setOpenEdit(false);
                    resetEdit();
                    setSelectedProvince(null);
                },
            });
        }
    };

    // Handle Delete - Open Modal
    const handleDeleteClick = (province: Province) => {
        setSelectedProvince(province);
        setOpenDelete(true);
    };

    // Handle Delete - Confirm
    const handleDeleteConfirm = () => {
        if (selectedProvince) {
            router.delete(`/province/${selectedProvince.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedProvince(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Province" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 max-w-3xl">
                {/* Button Tambah */}
                <div className="flex justify-end">
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
                                            value={createData.province_code}
                                            onChange={(e) => setCreateData('province_code', e.target.value)}
                                            placeholder="Masukkan kode provinsi"
                                        />
                                        {createErrors.province_code && <p className="text-sm text-red-500">{createErrors.province_code}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_province_name">Nama Provinsi</Label>
                                        <Input
                                            id="create_province_name"
                                            value={createData.province_name}
                                            onChange={(e) => setCreateData('province_name', e.target.value)}
                                            placeholder="Masukkan nama provinsi"
                                        />
                                        {createErrors.province_name && <p className="text-sm text-red-500">{createErrors.province_name}</p>}
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
                                {/* <TableHead className="w-[100px]">ID</TableHead> */}
                                <TableHead>Kode Provinsi</TableHead>
                                <TableHead>Nama Provinsi</TableHead>
                                <TableHead className="w-[150px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {provinces.length > 0 ? (
                                provinces.map((province) => (
                                    <TableRow key={province.id}>
                                        {/* <TableCell>{province.id}</TableCell> */}
                                        <TableCell>{province.province_code}</TableCell>
                                        <TableCell>{province.province_name}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEditClick(province)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(province)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        Tidak ada data provinsi
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                {/* </div> */}
                {/* Table */}

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
                                        value={editData.province_code}
                                        onChange={(e) => setEditData('province_code', e.target.value)}
                                        placeholder="Masukkan kode provinsi"
                                    />
                                    {editErrors.province_code && <p className="text-sm text-red-500">{editErrors.province_code}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_province_name">Nama Provinsi</Label>
                                    <Input
                                        id="edit_province_name"
                                        value={editData.province_name}
                                        onChange={(e) => setEditData('province_name', e.target.value)}
                                        placeholder="Masukkan nama provinsi"
                                    />
                                    {editErrors.province_name && <p className="text-sm text-red-500">{editErrors.province_name}</p>}
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
                                Tindakan ini tidak dapat dibatalkan. Data provinsi <strong>{selectedProvince?.province_name}</strong> akan dihapus
                                secara permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                className="bg-destructive text-white hover:bg-destructive/90"
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
