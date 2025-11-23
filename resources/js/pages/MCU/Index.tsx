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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, MCUIHeader } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Ellipsis, Pencil, ScanSearch, Search, TimerReset, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Stat {
    stat: string;
    total: number;
    color: string;
}
interface Props {
    mcus: {
        data: MCUIHeader[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: Stat[];
    filters: {
        conclusion?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Medical Check Up', href: '/mcu' }];

export default function Index({ mcus, stats, filters }: Props) {
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const [conclusion, setConclusion] = useState(filters.conclusion ?? '');
    const [search, setSearch] = useState(filters.search ?? '');
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedMCU, setSelectedMCU] = useState<MCUIHeader | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/mcu', { conclusion, search });
    };

    const handleDeleteClick = (param: MCUIHeader) => {
        setOpenDropdowns((prev) => ({ ...prev, [param.id]: false }));
        setSelectedMCU(param);
        setOpenDelete(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedMCU) {
            router.delete(`/mcu/${selectedMCU.id}`, {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedMCU(null);
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
            <Head title="Medical Check Up" />

            <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Select name="conclusion" value={conclusion} onValueChange={(value) => setConclusion(value)}>
                            {/* <Select name="conclusion" value={data.conclusion} onValueChange={(value) => setData('conclusion', value)}> */}
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Kesimpulan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="FIT UNTUK BEKERJA">FIT UNTUK BEKERJA</SelectItem>
                                    <SelectItem value="FIT DENGAN CATATAN">FIT DENGAN CATATAN</SelectItem>
                                    <SelectItem value="TEMPORARY UNFIT">TEMPORARY UNFIT</SelectItem>
                                    <SelectItem value="UNFIT">UNFIT</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input id="query" placeholder="Cari mcu..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                        <Button type="submit" variant="outline">
                            <Search className="mr-2 h-4 w-4" /> Cari
                        </Button>
                        <Link href="/mcu">
                            <Button type="button">
                                <TimerReset className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </Link>
                    </form>

                    {/* Header */}
                    <div className="flex justify-end">
                        <Link href="/mcu/create">
                            <Button>Tambah MCU</Button>
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                    {stats.map((item) => {
                        return (
                            <Card key={item.stat} className={`gap-2 ${item.color}`}>
                                <CardHeader className="px-3">
                                    <CardTitle>{item.stat}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-3 py-0">{item.total}</CardContent>
                            </Card>
                        );
                    })}

                    {/* <Card className="gap-2 bg-yellow-400">
                        <CardHeader className="px-3">
                            <CardTitle>FIT DENGAN CATATAN</CardTitle>
                        </CardHeader>
                        <CardContent className="px-3 py-0">1.234</CardContent>
                    </Card>
                    <Card className="gap-2 bg-red-400">
                        <CardHeader className="px-3">
                            <CardTitle>TEMPORARY UNFIT</CardTitle>
                        </CardHeader>
                        <CardContent className="px-3 py-0">1.234</CardContent>
                    </Card>
                    <Card className="gap-2 bg-gray-400">
                        <CardHeader className="px-3">
                            <CardTitle>UNFIT</CardTitle>
                        </CardHeader>
                        <CardContent className="px-3 py-0">1.234</CardContent>
                    </Card> */}
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit Usaha</TableHead>
                            <TableHead>Tanggal MCU</TableHead>
                            <TableHead>Waktu Input</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead>Departemen</TableHead>
                            <TableHead>Jenis Kelamin</TableHead>
                            <TableHead>Provider MCU</TableHead>
                            <TableHead>Kesimpulan Awal</TableHead>
                            <TableHead>Kesimpulan Akhir</TableHead>
                            <TableHead className="w-[60px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {mcus.data.length > 0 ? (
                            mcus.data.map((mcu) => (
                                <TableRow key={mcu.id}>
                                    <TableCell className="py-0.5">{mcu.company?.name}</TableCell>
                                    <TableCell className="py-0.5">{mcu.mcu_date}</TableCell>
                                    <TableCell className="py-0.5">
                                        {new Date(mcu.created_at).toLocaleString('en-CA', { hour12: false }).replace(',', '')}
                                    </TableCell>
                                    <TableCell className="py-0.5">{mcu.name}</TableCell>
                                    <TableCell className="py-0.5">{mcu.position}</TableCell>
                                    <TableCell className="py-0.5">{mcu.department_name}</TableCell>
                                    <TableCell className="py-0.5">{mcu.gender == 'male' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                                    <TableCell className="py-0.5">{mcu.provider?.name}</TableCell>
                                    <TableCell className="py-0.5">{mcu.conclusion}</TableCell>
                                    <TableCell className="py-0.5">{mcu.followup?.conclusion ?? '-'}</TableCell>

                                    <TableCell className="py-0.5">
                                        <div className="mt-0 flex justify-end">
                                            <DropdownMenu
                                                open={openDropdowns[mcu.id] || false}
                                                onOpenChange={(open) => setOpenDropdowns((prev) => ({ ...prev, [mcu.id]: open }))}
                                            >
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost">
                                                        <Ellipsis size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56" align="start">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/mcu/${mcu.id}/edit`} className="flex items-center gap-2">
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </Link>
                                                        {/* Edit */}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/mcu/${mcu.id}/review`} className="flex items-center gap-2">
                                                            <ScanSearch className="mr-2 h-4 w-4" />
                                                            <span>Review</span>
                                                        </Link>
                                                        {/* Edit */}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/mcu/${mcu.id}/follow-up`} className="flex items-center gap-2">
                                                            <ScanSearch className="mr-2 h-4 w-4" />
                                                            <span>Tindak Lanjut</span>
                                                        </Link>
                                                        {/* Edit */}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/mcu/${mcu.id}/review-follow-up`} className="flex items-center gap-2">
                                                            <ScanSearch className="mr-2 h-4 w-4" />
                                                            <span>Review</span>
                                                        </Link>
                                                        {/* Edit */}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(mcu)}>
                                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                        <div className="text-destructive">Hapus</div>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        {/* <div className="flex justify-end gap-2">
                                            <Link href={`/mcu-parameter/${parameter.id}/edit`}>
                                                <Button size="sm" variant="outline">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(parameter)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground">
                                    Tidak ada data MCU.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {mcus.total > 10 && (
                    <div className="flex justify-end gap-2">
                        {mcus.links.map((link, i) =>
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
                            <AlertDialogTitle>Hapus MCU</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus mcu <strong>{selectedMCU?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
