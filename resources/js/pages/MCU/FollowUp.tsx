import { AttachmentList } from '@/components/attachment-list';
import ParameterLookup from '@/components/parameter-lookup';
import { RangeDisplay } from '@/components/range-display';
import { RecordItem } from '@/components/record-item';
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDecimal, parseGender, parseToMCUParameters, parseToMCUParamResults } from '@/lib/utils';
import type { BreadcrumbItem, MCUIHeader, MCUParamResult, Provider } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Mars, Settings, Trash2, Venus } from 'lucide-react';
import { JSX, useState } from 'react';

type FormValues = {
    mcu_date: string;
    provider_id: string;
    files: File[];
    mcu_param_results: MCUParamResult[];
};

interface Props {
    mcu: MCUIHeader;
    providers: Provider[];
}

const genderIcons: Record<'male' | 'female', JSX.Element> = {
    male: <Venus className="inline h-4 w-4 text-blue-600" />,
    female: <Mars className="inline h-4 w-4 text-pink-600" />,
};

export default function FollowUp({ mcu, providers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Medical Check Up', href: '/mcu' },
        { title: 'Tindak Lanjut', href: `/mcu/${mcu.id}/follow-up` },
    ];

    const [openParamLookup, setOpenParamLookup] = useState(false);
    const [openDeleteParam, setOpenDeleteParam] = useState(false);
    const [selectedParam, setSelectedParam] = useState<MCUParamResult | null>(null);

    const { data, setData, post, processing, errors } = useForm<FormValues>({
        mcu_date: '',
        provider_id: '',
        files: [],
        mcu_param_results: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/mcu/${mcu.id}/follow-up`);
    };

    const handleDeleteParamClick = (param: MCUParamResult) => {
        setSelectedParam(param);
        setOpenDeleteParam(true);
    };

    const handleDeleteParamConfirm = () => {
        if (selectedParam) {
            const filtered = data.mcu_param_results.filter((r) => r.id !== selectedParam.id);
            setData('mcu_param_results', filtered);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tindak Lanjut Medical Check Up" />

            <div className="max-w-7xl p-6">
                <h2 className="text-xl font-semibold">Tindak Lanjut Medical Check Up</h2>
                <p className="mt-1 text-sm text-gray-500">Tindak lanjut data mcu. Klik simpan untuk menyimpan data.</p>

                <Card className="mt-4 gap-3 py-3">
                    <CardHeader className="px-3">
                        <CardTitle>Kandidat</CardTitle>
                        {/* <CardDescription>Card Description</CardDescription> */}
                    </CardHeader>
                    <CardContent className="grid grid-flow-row grid-cols-4 gap-2 px-3 py-0">
                        <RecordItem label="Unit Usaha" value={mcu.company?.name ?? ''} />
                        <RecordItem label="Tanggal MCU" value={mcu.mcu_date} />
                        <RecordItem label="Tipe MCU" value={mcu.mcu_type.toUpperCase()} />
                        <RecordItem label="Provider MCU" value={mcu.provider?.name ?? ''} />
                        <RecordItem label="Nama" value={mcu.participant?.name ?? '-'} />
                        <RecordItem label="Jabatan" value={mcu.participant?.position ?? '-'} />
                        <RecordItem label="Departemen" value={mcu.participant?.department?.name ?? '-'} />
                        <RecordItem label="Tanggal Lahir" value={mcu.participant?.birth_date ?? '-'} />
                        <RecordItem label="Jenis Kelamin" value={mcu.participant === null ? '-' : parseGender(mcu.participant?.gender ?? '')} />
                    </CardContent>
                </Card>

                <Card className="mt-4 gap-2 py-3">
                    <CardHeader className="px-3">
                        <CardTitle>Dokumen MCU Awal</CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 py-0">
                        <AttachmentList attachments={mcu.attachments} />
                    </CardContent>
                </Card>

                <Card className="mt-4 gap-3 py-3">
                    <CardHeader className="flex flex-row justify-between px-3">
                        <CardTitle>Hasil MCU Awal</CardTitle>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mcu.items.length > 0 ? (
                                    mcu.items.map((item, index) => {
                                        // console.log(item.ranges);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="px-3 py-1">{item.category?.name}</TableCell>
                                                <TableCell className="py-1">{item.name}</TableCell>
                                                <TableCell className="py-1">{item.unit ?? '-'}</TableCell>
                                                <TableCell className="py-1">
                                                    {/* {item.ranges?.male?.min ?? '--'} */}
                                                    <RangeDisplay ranges={item.ranges} genderIcons={genderIcons} />
                                                </TableCell>
                                                <TableCell className="py-1">{item.result}</TableCell>
                                                <TableCell className="py-1">{item.notes}</TableCell>
                                                {/* <TableCell className="w-[40px] px-3 py-1">
                                                                                <Checkbox
                                                                                    checked={data.selected_items.includes(item.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        if (checked) {
                                                                                            setData('selected_items', [...data.selected_items, item.id]);
                                                                                        } else {
                                                                                            setData(
                                                                                                'selected_items',
                                                                                                data.selected_items.filter((id) => id !== item.id),
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </TableCell> */}
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
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Tidak ada hasil MCU
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="mt-4 gap-2 py-3">
                    <CardHeader className="px-3">
                        <CardTitle>Hasil Review MCU Awal</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-flow-row grid-cols-3 gap-2 px-3 py-0">
                        <RecordItem label="Kesimpulan Awal" value={mcu.conclusion} />
                        <RecordItem label="Rekomendasi Awal" value={mcu.recommendation} />
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="mt-3">
                    <Card className="mt-4 gap-3 py-3">
                        <CardHeader className="flex flex-row justify-between px-3">
                            <CardTitle>Hasil MCU Tindak Lanjut</CardTitle>
                            <Button type="button" onClick={() => setOpenParamLookup(true)}>
                                <Settings className="mr-2 h-4 w-4" />
                                Set Parameter
                            </Button>
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.mcu_param_results.length > 0 ? (
                                        data.mcu_param_results.map((param_result, index) => {
                                            const errs = errors as Record<string, string>;
                                            const handleChange = (value: string) => {
                                                setData(
                                                    'mcu_param_results',
                                                    data.mcu_param_results.map((r, i) => (i === index ? { ...r, result: value } : r)),
                                                );
                                            };
                                            const computeNote = () => {
                                                // 1. Ambil Nilai Batas (Min/Max) berdasarkan Jenis Kelamin
                                                const minValueStr =
                                                    param_result.ranges?.[mcu.participant?.gender === 'female' ? 'female' : 'male']?.min;
                                                const maxValueStr =
                                                    param_result.ranges?.[mcu.participant?.gender === 'female' ? 'female' : 'male']?.max;

                                                // Ambil hasil yang baru saja dimasukkan (sudah ada di state 'result' karena onChange sudah berjalan)
                                                let currentResultStr = param_result.result;

                                                // 2. Konversi ke Angka
                                                const resultValue = parseFloat(currentResultStr);
                                                const minValue = parseFloat(minValueStr ?? '0');
                                                const maxValue = parseFloat(maxValueStr ?? '0');

                                                let note = 'Normal'; // Default Notes

                                                // 3. Logika Penentuan Catatan
                                                if (!isNaN(resultValue) && minValueStr && maxValueStr) {
                                                    // Pastikan nilainya angka dan batasnya tersedia
                                                    if (resultValue < minValue) {
                                                        note = 'Tidak Normal (Rendah)';
                                                    } else if (resultValue > maxValue) {
                                                        note = 'Tidak Normal (Tinggi)';
                                                    } else {
                                                        note = 'Normal';
                                                    }
                                                } else if (!isNaN(resultValue) && minValueStr && !maxValueStr) {
                                                    if (resultValue < minValue) {
                                                        note = 'Tidak Normal (Rendah)';
                                                    } else {
                                                        note = 'Normal';
                                                    }
                                                } else if (!isNaN(resultValue) && !minValueStr && maxValueStr) {
                                                    if (resultValue > maxValue) {
                                                        note = 'Tidak Normal (Tinggi)';
                                                    } else {
                                                        note = 'Normal';
                                                    }
                                                } else if (!currentResultStr) {
                                                    // Jika hasil input kosong, reset note
                                                    note = '';
                                                } else {
                                                    // Jika ranges tidak valid, gunakan catatan default atau kosong
                                                    note = 'Rentang tidak tersedia';
                                                }

                                                currentResultStr = formatDecimal(currentResultStr);

                                                // 4. Update State (result dan notes)
                                                setData(
                                                    'mcu_param_results',
                                                    data.mcu_param_results.map((r, i) =>
                                                        i === index
                                                            ? {
                                                                  ...r,
                                                                  result: currentResultStr,
                                                                  notes: note,
                                                              }
                                                            : r,
                                                    ),
                                                );
                                            };
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="px-3 py-0.5">{param_result.category}</TableCell>
                                                    <TableCell className="py-0.5">{param_result.name}</TableCell>
                                                    <TableCell className="py-0.5">{param_result.unit ?? '-'}</TableCell>
                                                    <TableCell className="py-0.5">
                                                        <RangeDisplay ranges={param_result.ranges} genderIcons={genderIcons} />
                                                    </TableCell>
                                                    <TableCell className="py-0.5">
                                                        {param_result.input_type === 'Angka' && (
                                                            <Input
                                                                type="number"
                                                                className="text-right"
                                                                step="0.1"
                                                                value={param_result.result || ''}
                                                                onChange={(e) => handleChange(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        computeNote();
                                                                    }
                                                                }}
                                                                onBlur={() => computeNote()}
                                                            />
                                                        )}
                                                        {param_result.input_type === 'Teks Bebas' && (
                                                            <Input
                                                                type="text"
                                                                value={param_result.result || ''}
                                                                onChange={(e) => handleChange(e.target.value)}
                                                            />
                                                        )}
                                                        {param_result.input_type === 'Pilihan' && Array.isArray(param_result.options) && (
                                                            <Select value={param_result.result || ''} onValueChange={(value) => handleChange(value)}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih Hasil" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        {param_result.options.map((opt) => (
                                                                            <SelectItem key={opt} value={opt}>
                                                                                {opt}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        {errs[`mcu_param_results.${index}.result`] && (
                                                            <p className="text-sm text-red-500">{errs[`mcu_param_results.${index}.result`]}</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-0.5">{param_result.notes}</TableCell>
                                                    <TableCell className="py-0.5">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteParamClick(param_result)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                Silahkan set parameter
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>{errors.mcu_param_results && <p className="text-sm text-red-500">{errors.mcu_param_results}</p>}</CardFooter>
                    </Card>
                </form>

                {openParamLookup && (
                    <ParameterLookup
                        open={openParamLookup}
                        onOpenChange={setOpenParamLookup}
                        initialSelection={parseToMCUParameters(data.mcu_param_results)}
                        onSelect={(p) => {
                            const newSelectedIds = p.map((item) => item.id);
                            const keptOldResults = data.mcu_param_results.filter((r) => newSelectedIds.includes(r.id));
                            const keptOldIds = keptOldResults.map((r) => r.id); // [2, 3]
                            const trulyNewParameters = p.filter((param) => !keptOldIds.includes(param.id));
                            const convertedNewResults = parseToMCUParamResults(trulyNewParameters);
                            const finalResults = [...keptOldResults, ...convertedNewResults];
                            setData({
                                ...data,
                                mcu_param_results: finalResults,
                            });
                        }}
                    />
                )}
                {/* Modal Konfirmasi Hapus */}
                <AlertDialog open={openDeleteParam} onOpenChange={setOpenDeleteParam}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Parameter</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus parameter <strong>{selectedParam?.name}</strong>? Tindakan ini tidak dapat
                                dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteParamConfirm}
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
