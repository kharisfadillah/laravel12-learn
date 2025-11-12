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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Participant {
    id: number;
    name: string;
    position: string;
    birth_date: string;
    gender: string;
    phone: string;
    company?: Company;
    department?: Department;
}

interface Company {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
}

interface Props {
    participants: Participant[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kandidat', href: '/participant' }];

export default function Index({ participants }: Props) {
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

    const handleDeleteClick = (participant: Participant) => {
        setSelectedParticipant(participant);
        setOpenDelete(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedParticipant) {
            router.delete(`/participant/${selectedParticipant.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedParticipant(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kandidat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-end">
                    <Link href="/participant/create">
                        <Button>Tambah Kandidat</Button>
                    </Link>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit Usaha</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead>Departemen</TableHead>
                            <TableHead>Tanggal Lahir</TableHead>
                            <TableHead>Jenis Kelamin</TableHead>
                            <TableHead>Telepon</TableHead>
                            <TableHead className="w-[120px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participants.length > 0 ? (
                            participants.map((participant) => (
                                <TableRow key={participant.id}>
                                    <TableCell>{participant.company?.name}</TableCell>
                                    <TableCell>{participant.name}</TableCell>
                                    <TableCell>{participant.position}</TableCell>
                                    <TableCell>{participant.department?.name ?? '-'}</TableCell>
                                    <TableCell>{participant.birth_date}</TableCell>
                                    <TableCell>{participant.gender}</TableCell>
                                    <TableCell>{participant.phone}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/participant/${participant.id}/edit`}>
                                                <Button size="sm" variant="outline">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(participant)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    Tidak ada data kandidat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Modal Konfirmasi Hapus */}
                <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kandidat</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus kandidat <strong>{selectedParticipant?.name}</strong>? Tindakan ini tidak dapat
                                dibatalkan.
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
