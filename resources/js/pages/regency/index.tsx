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
    code: string;
    name: string;
}

interface Regency {
    id: number;
    province_id: number;
    code: string;
    name: string;
    province?: Province; // optional to avoid undefined errors
}

interface Props {
    provinces: Province[];
    regencies: Regency[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kabupaten',
        href: '/regency',
    },
];

export default function Index({ provinces, regencies }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedRegency, setSelectedRegency] = useState<Regency | null>(null);

    // Form Create
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        province_id: 0,
        code: '',
        name: '',
    });

    // Form Edit
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        province_id: 0,
        code: '',
        name: '',
    });

    // Create
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/regency', {
            onSuccess: () => {
                setOpenCreate(false);
                resetCreate();
            },
        });
    };

    // Open Edit
    const handleEditClick = (regency: Regency) => {
        setSelectedRegency(regency);
        setEditData({
            province_id: regency.province_id,
            code: regency.code,
            name: regency.name,
        });
        setOpenEdit(true);
    };

    // Submit Edit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRegency) {
            put(`/regency/${selectedRegency.id}`, {
                onSuccess: () => {
                    setOpenEdit(false);
                    resetEdit();
                    setSelectedRegency(null);
                },
            });
        }
    };

    // Open Delete
    const handleDeleteClick = (regency: Regency) => {
        setSelectedRegency(regency);
        setOpenDelete(true);
    };

    // Confirm Delete
    const handleDeleteConfirm = () => {
        if (selectedRegency) {
            router.delete(`/regency/${selectedRegency.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedRegency(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kabupaten" />
            <div className="flex h-full max-w-3xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Button Tambah */}
                <div className="flex justify-end">
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Tambah Kabupaten</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Kabupaten</DialogTitle>
                                    <DialogDescription>Masukkan data kabupaten baru. Klik simpan untuk menyimpan data.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {/* Combobox Provinsi */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_province_id">Provinsi</Label>
                                        <select
                                            id="create_province_id"
                                            value={createData.province_id}
                                            onChange={(e) => setCreateData('province_id', Number(e.target.value))}
                                            className="rounded-md border p-2"
                                        >
                                            <option value={0}>Pilih Provinsi</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.id}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                        {createErrors.province_id && <p className="text-sm text-red-500">{createErrors.province_id}</p>}
                                    </div>

                                    {/* Kode Kabupaten */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_regency_code">Kode Kabupaten</Label>
                                        <Input
                                            id="create_regency_code"
                                            value={createData.code}
                                            onChange={(e) => setCreateData('code', e.target.value)}
                                            placeholder="Masukkan kode kabupaten"
                                        />
                                        {createErrors.code && <p className="text-sm text-red-500">{createErrors.code}</p>}
                                    </div>

                                    {/* Nama Kabupaten */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_regency_name">Nama Kabupaten</Label>
                                        <Input
                                            id="create_regency_name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Masukkan nama kabupaten"
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
                            <TableHead>Provinsi</TableHead>
                            <TableHead>Kode Kabupaten</TableHead>
                            <TableHead>Nama Kabupaten</TableHead>
                            <TableHead className="w-[150px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {regencies.length > 0 ? (
                            regencies.map((regency) => (
                                <TableRow key={regency.id}>
                                    <TableCell>{regency.province?.name ?? '-'}</TableCell>
                                    <TableCell>{regency.code}</TableCell>
                                    <TableCell>{regency.name}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEditClick(regency)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(regency)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Tidak ada data kabupaten
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Modal Edit */}
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleEditSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Kabupaten</DialogTitle>
                                <DialogDescription>Ubah data kabupaten. Klik simpan untuk menyimpan perubahan.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Combobox Provinsi */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_province_id">Provinsi</Label>
                                    <select
                                        id="edit_province_id"
                                        value={editData.province_id}
                                        onChange={(e) => setEditData('province_id', Number(e.target.value))}
                                        className="rounded-md border p-2"
                                    >
                                        <option value={0}>Pilih Provinsi</option>
                                        {provinces.map((province) => (
                                            <option key={province.id} value={province.id}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editErrors.province_id && <p className="text-sm text-red-500">{editErrors.province_id}</p>}
                                </div>

                                {/* Kode Kabupaten */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_regency_code">Kode Kabupaten</Label>
                                    <Input
                                        id="edit_regency_code"
                                        value={editData.code}
                                        onChange={(e) => setEditData('code', e.target.value)}
                                        placeholder="Masukkan kode kabupaten"
                                    />
                                    {editErrors.code && <p className="text-sm text-red-500">{editErrors.code}</p>}
                                </div>

                                {/* Nama Kabupaten */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_regency_name">Nama Kabupaten</Label>
                                    <Input
                                        id="edit_regency_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="Masukkan nama kabupaten"
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
                                Tindakan ini tidak dapat dibatalkan. Data kabupaten <strong>{selectedRegency?.name}</strong> akan dihapus
                                secara permanen.
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
