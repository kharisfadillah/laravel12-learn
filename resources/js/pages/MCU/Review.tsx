import { RangeDisplay } from '@/components/range-display';
import { RecordItem } from '@/components/record-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { parseGender } from '@/lib/utils';
import type { BreadcrumbItem, MCUIHeader } from '@/types';
import { Head } from '@inertiajs/react';
import { Mars, Venus } from 'lucide-react';
import { JSX } from 'react';
interface Props {
    mcu: MCUIHeader;
}

const genderIcons: Record<'male' | 'female', JSX.Element> = {
    male: <Venus className="inline h-4 w-4 text-blue-600" />,
    female: <Mars className="inline h-4 w-4 text-pink-600" />,
};

export default function Review({ mcu }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Medical Check Up', href: '/mcu' },
        { title: 'Review', href: `/mcu/${mcu.id}/review` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Medical Check Up" />

            <div className="max-w-7xl p-6">
                <h2 className="text-xl font-semibold">Review Medical Check Up</h2>
                <p className="mt-1 text-sm text-gray-500">Review data mcu. Klik simpan untuk menyimpan data.</p>

                {/* <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <RecordItem label="Tanggal MCU" value={mcu.mcu_date} />
                    <RecordItem label="Tipe MCU" value={mcu.mcu_type} />
                    <RecordItem label="Provider MCU" value={mcu.provider?.name ?? ''} />
                </div> */}

                <Card className="mt-4 gap-3 py-3">
                    <CardHeader className="px-3">
                        <CardTitle>Kandidat</CardTitle>
                        {/* <CardDescription>Card Description</CardDescription> */}
                    </CardHeader>
                    <CardContent className="grid grid-flow-row grid-cols-4 gap-2 px-3 py-0">
                        <RecordItem label="Unit Usaha" value={mcu.company?.name ?? ''} />
                        <RecordItem label="Tanggal MCU" value={mcu.mcu_date} />
                        <RecordItem label="Tipe MCU" value={mcu.mcu_type} />
                        <RecordItem label="Provider MCU" value={mcu.provider?.name ?? ''} />
                        <RecordItem label="Nama" value={mcu.participant?.name ?? '-'} />
                        <RecordItem label="Jabatan" value={mcu.participant?.position ?? '-'} />
                        <RecordItem label="Departemen" value={mcu.participant?.department?.name ?? '-'} />
                        <RecordItem label="Tanggal Lahir" value={mcu.participant?.birth_date ?? '-'} />
                        <RecordItem label="Jenis Kelamin" value={mcu.participant === null ? '-' : parseGender(mcu.participant?.gender ?? '')} />
                    </CardContent>
                </Card>

                <Card className="mt-4 gap-3 py-3">
                        <CardHeader className="flex flex-row justify-between px-3">
                            <CardTitle>Hasil MCU</CardTitle>
                        </CardHeader>
                        <CardContent className="gap-2 px-0 py-0">
                            <Table>
                                <TableHeader className="bg-gray-100">
                                    <TableRow key="rowh">
                                        <TableHead className="px-3">Kategori</TableHead>
                                        <TableHead>Parameter</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>Nilai Rujukan</TableHead>
                                        <TableHead>Hasil</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        {/* <TableHead></TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mcu.items.length > 0 ? (
                                        mcu.items.map((item, index) => {
                                            // console.log(item.ranges);
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="px-3 py-0.5">{item.category?.name}</TableCell>
                                                    <TableCell className="py-0.5">{item.name}</TableCell>
                                                    <TableCell className="py-0.5">{item.unit ?? '-'}</TableCell>
                                                    <TableCell className="py-0.5">
                                                        {/* {item.ranges?.male?.min ?? '--'} */}
                                                        <RangeDisplay ranges={item.ranges} genderIcons={genderIcons} />
                                                    </TableCell>
                                                    <TableCell className="py-0.5">{item.result}</TableCell>
                                                    <TableCell className="py-0.5">{item.notes}</TableCell>
                                                    {/* <TableCell className="py-0.5">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteParamClick(param_result)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell> */}
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                Tidak ada hasil MCU
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
            </div>
        </AppLayout>
    );
}
