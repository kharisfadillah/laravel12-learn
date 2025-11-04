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

interface Permission {
    id: number;
    name: string;
    notes: string;
}

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hak Akses', href: '/permission' }];

export default function Index({ permissions }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

    // Form Create
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        name: '',
        notes: '',
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
        name: '',
        notes: '',
    });

    // Handle Create
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/permission', {
            onSuccess: () => {
                setOpenCreate(false);
                resetCreate();
            },
        });
    };

    // Handle Edit - Open Modal
    const handleEditClick = (permission: Permission) => {
        setSelectedPermission(permission);
        setEditData({
            name: permission.name,
            notes: permission.notes,
        });
        setOpenEdit(true);
    };

    // Handle Edit - Submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPermission) {
            put(`/permission/${selectedPermission.id}`, {
                onSuccess: () => {
                    setOpenEdit(false);
                    resetEdit();
                    setSelectedPermission(null);
                },
            });
        }
    };

    // Handle Delete - Open Modal
    const handleDeleteClick = (permission: Permission) => {
        setSelectedPermission(permission);
        setOpenDelete(true);
    };

    // Handle Delete - Confirm
    const handleDeleteConfirm = () => {
        if (selectedPermission) {
            router.delete(`/permission/${selectedPermission.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedPermission(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hak Akses" />
            <div className="flex h-full max-w-3xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Tombol Tambah Hak Akses */}
                <div className="flex justify-end">
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Tambah Hak Akses</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Hak Akses</DialogTitle>
                                    <DialogDescription>Masukkan data hak akses baru. Klik simpan untuk menyimpan data.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_permission_name">Nama Hak Akses</Label>
                                        <Input
                                            id="create_permission_name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Masukkan nama hak akses"
                                        />
                                        {createErrors.name && <p className="text-sm text-red-500">{createErrors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_permission_notes">Keterangan</Label>
                                        <Input
                                            id="create_permission_notes"
                                            value={createData.notes}
                                            onChange={(e) => setCreateData('notes', e.target.value)}
                                            placeholder="Masukkan keterangan"
                                        />
                                        {createErrors.notes && <p className="text-sm text-red-500">{createErrors.notes}</p>}
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

                {/* Tabel Permission */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Hak Akses</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead className="w-[150px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.length > 0 ? (
                            permissions.map((permission) => (
                                <TableRow key={permission.id}>
                                    <TableCell>{permission.name}</TableCell>
                                    <TableCell>{permission.notes}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEditClick(permission)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(permission)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    Tidak ada data hak akses
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
                                <DialogTitle>Edit Hak Akses</DialogTitle>
                                <DialogDescription>Ubah data hak akses. Klik simpan untuk menyimpan perubahan.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_permission_name">Nama Hak Akses</Label>
                                    <Input
                                        id="edit_permission_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="Masukkan nama hak akses"
                                    />
                                    {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_permission_notes">Keterangan</Label>
                                    <Input
                                        id="edit_permission_notes"
                                        value={editData.notes}
                                        onChange={(e) => setEditData('notes', e.target.value)}
                                        placeholder="Masukkan keterangan"
                                    />
                                    {editErrors.notes && <p className="text-sm text-red-500">{editErrors.notes}</p>}
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

                {/* Modal Delete */}
                <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Data permission <strong>{selectedPermission?.name}</strong> akan dihapus secara
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
