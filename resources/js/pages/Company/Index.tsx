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

interface Company {
    id: number;
    code: string;
    name: string;
}

interface Props {
    companies: Company[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Unit Usaha',
        href: '/company',
    },
];

export default function Index({ companies }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    // Form untuk Create
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        code: '',
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
        code: '',
        name: '',
    });

    // Handle Create
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/company', {
            onSuccess: () => {
                setOpenCreate(false);
                resetCreate();
            },
        });
    };

    // Handle Edit - Open Modal
    const handleEditClick = (company: Company) => {
        setSelectedCompany(company);
        setEditData({
            code: company.code,
            name: company.name,
        });
        setOpenEdit(true);
    };

    // Handle Edit - Submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCompany) {
            put(`/company/${selectedCompany.id}`, {
                onSuccess: () => {
                    setOpenEdit(false);
                    resetEdit();
                    setSelectedCompany(null);
                },
            });
        }
    };

    // Handle Delete - Open Modal
    const handleDeleteClick = (company: Company) => {
        setSelectedCompany(company);
        setOpenDelete(true);
    };

    // Handle Delete - Confirm
    const handleDeleteConfirm = () => {
        if (selectedCompany) {
            router.delete(`/company/${selectedCompany.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedCompany(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Unit Usaha" />
            <div className="flex h-full max-w-3xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Button Tambah */}
                <div className="flex justify-end">
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Tambah Unit Usaha</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Unit Usaha</DialogTitle>
                                    <DialogDescription>Masukkan data unit usaha baru. Klik simpan untuk menyimpan data.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_company_code">Kode Unit Usaha</Label>
                                        <Input
                                            id="create_company_code"
                                            value={createData.code}
                                            onChange={(e) => setCreateData('code', e.target.value)}
                                            placeholder="Masukkan kode unit usaha"
                                        />
                                        {createErrors.code && <p className="text-sm text-red-500">{createErrors.code}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_company_name">Nama Unit Usaha</Label>
                                        <Input
                                            id="create_company_name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Masukkan nama unit usaha"
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
                            {/* <TableHead className="w-[100px]">ID</TableHead> */}
                            <TableHead>Kode Unit Usaha</TableHead>
                            <TableHead>Nama Unit Usaha</TableHead>
                            <TableHead className="w-[150px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies.length > 0 ? (
                            companies.map((company) => (
                                <TableRow key={company.id}>
                                    <TableCell>{company.code}</TableCell>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEditClick(company)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(company)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Tidak ada data unit usaha
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
                                <DialogTitle>Edit Unit Usaha</DialogTitle>
                                <DialogDescription>Ubah data unit usaha. Klik simpan untuk menyimpan perubahan.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_company_code">Kode Unit Usaha</Label>
                                    <Input
                                        id="edit_company_code"
                                        value={editData.code}
                                        onChange={(e) => setEditData('code', e.target.value)}
                                        placeholder="Masukkan kode unit usaha"
                                    />
                                    {editErrors.code && <p className="text-sm text-red-500">{editErrors.code}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_company_name">Nama Unit Usaha</Label>
                                    <Input
                                        id="edit_company_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="Masukkan nama unit usaha"
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
                                Tindakan ini tidak dapat dibatalkan. Data unit usaha <strong>{selectedCompany?.name}</strong> akan dihapus secara
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
