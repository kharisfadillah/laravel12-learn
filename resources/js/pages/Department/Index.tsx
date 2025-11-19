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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Company {
    id: string;
    code: string;
    name: string;
}

interface Department {
    id: string;
    company_id: string;
    code: string;
    name: string;
    company?: Company;
}

interface Props {
    companies: Company[];
    departments: Department[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departemen',
        href: '/department',
    },
];

export default function Index({ companies, departments }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    // Form Create
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        company_id: '',
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
        company_id: '',
        code: '',
        name: '',
    });

    // Create
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/department', {
            onSuccess: () => {
                setOpenCreate(false);
                resetCreate();
            },
        });
    };

    // Open Edit
    const handleEditClick = (department: Department) => {
        setSelectedDepartment(department);
        setEditData({
            company_id: department.company_id,
            code: department.code,
            name: department.name,
        });
        setOpenEdit(true);
    };

    // Submit Edit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDepartment) {
            put(`/department/${selectedDepartment.id}`, {
                onSuccess: () => {
                    setOpenEdit(false);
                    resetEdit();
                    setSelectedDepartment(null);
                },
            });
        }
    };

    // Open Delete
    const handleDeleteClick = (department: Department) => {
        setSelectedDepartment(department);
        setOpenDelete(true);
    };

    // Confirm Delete
    const handleDeleteConfirm = () => {
        if (selectedDepartment) {
            router.delete(`/department/${selectedDepartment.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedDepartment(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departemen" />
            <div className="flex h-full max-w-3xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Button Tambah */}
                <div className="flex justify-end">
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Tambah Departemen</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Departemen</DialogTitle>
                                    <DialogDescription>Masukkan data departemen baru. Klik simpan untuk menyimpan data.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {/* Combobox Unit Usaha */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_company_id">Unit Usaha</Label>
                                        <Select value={createData.company_id} onValueChange={(value) => setCreateData('company_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Unit Usaha" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem value={company.id}>{company.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {/* <select
                                            id="create_company_id"
                                            value={createData.company_id}
                                            onChange={(e) => setCreateData('company_id', e.target.value)}
                                            className="rounded-md border p-2"
                                        >
                                            <option value={0}>Pilih Unit Usaha</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select> */}
                                        {createErrors.company_id && <p className="text-sm text-red-500">{createErrors.company_id}</p>}
                                    </div>

                                    {/* Kode Departemen */}
                                    {/* <div className="grid gap-2">
                                        <Label htmlFor="create_department_code">Kode Departemen</Label>
                                        <Input
                                            id="create_department_code"
                                            value={createData.code}
                                            onChange={(e) => setCreateData('code', e.target.value)}
                                            placeholder="Masukkan kode departemen"
                                        />
                                        {createErrors.code && <p className="text-sm text-red-500">{createErrors.code}</p>}
                                    </div> */}

                                    {/* Nama Departemen */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="create_department_name">Nama Departemen</Label>
                                        <Input
                                            id="create_department_name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Masukkan nama departemen"
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
                            <TableHead>Unit Usaha</TableHead>
                            {/* <TableHead>Kode Departemen</TableHead> */}
                            <TableHead>Nama Departemen</TableHead>
                            <TableHead className="w-[150px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.length > 0 ? (
                            departments.map((department) => (
                                <TableRow key={department.id}>
                                    <TableCell>{department.company?.name ?? '-'}</TableCell>
                                    {/* <TableCell>{department.code}</TableCell> */}
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEditClick(department)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(department)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Tidak ada data departemen
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
                                <DialogTitle>Edit Departemen</DialogTitle>
                                <DialogDescription>Ubah data departemen. Klik simpan untuk menyimpan perubahan.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Combobox Unit Usaha */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_company_id">Unit Usaha</Label>
                                    <select
                                        id="edit_company_id"
                                        value={editData.company_id}
                                        onChange={(e) => setEditData('company_id', e.target.value)}
                                        className="rounded-md border p-2"
                                    >
                                        <option value={0}>Pilih Unit Usaha</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editErrors.company_id && <p className="text-sm text-red-500">{editErrors.company_id}</p>}
                                </div>

                                {/* Kode Departemen */}
                                {/* <div className="grid gap-2">
                                    <Label htmlFor="edit_department_code">Kode Departemen</Label>
                                    <Input
                                        id="edit_department_code"
                                        value={editData.code}
                                        onChange={(e) => setEditData('code', e.target.value)}
                                        placeholder="Masukkan kode departemen"
                                    />
                                    {editErrors.code && <p className="text-sm text-red-500">{editErrors.code}</p>}
                                </div> */}

                                {/* Nama Departemen */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_department_name">Nama Departemen</Label>
                                    <Input
                                        id="edit_department_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="Masukkan nama departemen"
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
                                Tindakan ini tidak dapat dibatalkan. Data departemen <strong>{selectedDepartment?.name}</strong> akan dihapus secara
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
