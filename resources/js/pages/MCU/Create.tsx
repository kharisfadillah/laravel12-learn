import { DatePicker } from '@/components/date-picker';
import FileUpload from '@/components/file-upload';
import ParameterLookup from '@/components/parameter-lookup';
import ParticipantLookup from '@/components/participant-lookup';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDecimal, parseGender, parseToMCUParameters, parseToMCUParamResults } from '@/lib/utils';
import type { BreadcrumbItem, MCUParamResult, Participant, Provider } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Mars, Search, Settings, Trash2, UserPlus, Venus } from 'lucide-react';
import { JSX, useState } from 'react';

type FormValues = {
    company_id: string;
    mcu_type: string;
    mcu_date: string;
    participant_id: string;
    provider_id: string;
    files: File[];
    mcu_param_results: MCUParamResult[];
};

interface Props {
    providers: Provider[];
}

const genderIcons: Record<'male' | 'female', JSX.Element> = {
    male: <Venus className="inline h-4 w-4 text-blue-600" />,
    female: <Mars className="inline h-4 w-4 text-pink-600" />,
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Medical Check Up', href: '/mcu' },
    { title: 'Tambah', href: '/mcu/create' },
];

export default function Create({ providers }: Props) {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [selectedParam, setSelectedParam] = useState<MCUParamResult | null>(null);
    const [openPartiLookup, setOpenPartiLookup] = useState(false);
    const [openParamLookup, setOpenParamLookup] = useState(false);
    const [openDeleteParam, setOpenDeleteParam] = useState(false);
    const { data, setData, post, processing, errors } = useForm<FormValues>({
        company_id: '',
        mcu_type: '',
        mcu_date: '',
        participant_id: '',
        provider_id: '',
        files: [],
        mcu_param_results: [],
    });

    // const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //     onDrop,
    //     multiple: true,
    //     accept: {
    //         "application/pdf": [],
    //         "image/*": []
    //     }
    // });

    // isFocused: boolean;
    //   isDragActive: boolean;
    //   isDragAccept: boolean;
    //   isDragReject: boolean;
    //   isFileDialogActive: boolean;
    //   acceptedFiles: readonly FileWithPath[];
    //   fileRejections: readonly FileRejection[];
    //   rootRef: React.RefObject<HTMLElement>;
    //   inputRef: React.RefObject<HTMLInputElement>;
    //   getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    //   getInputProps: <T extends DropzoneInputProps>(props?: T) => T;

    // const onDrop = (acceptedFiles) => {
    //     setData("files", [...data.files, ...acceptedFiles]);
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mcu');
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
            <Head title="Tambah Medical Check Up" />

            <div className="max-w-7xl p-6">
                <h2 className="text-xl font-semibold">Tambah MCU</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data mcu baru. Klik simpan untuk menyimpan data.</p>

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor="mcu_date">Tanggal MCU</Label>
                            <DatePicker
                                value={data.mcu_date ? new Date(data.mcu_date) : undefined}
                                onChange={(date) => setData('mcu_date', date ? format(date, 'yyyy-MM-dd') : '')}
                            />
                            {errors.mcu_date && <p className="text-sm text-red-500">{errors.mcu_date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="mcu_type">Tipe MCU</Label>
                            <Select name="mcu_type" value={data.mcu_type} onValueChange={(value) => setData('mcu_type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tipe MCU" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="prakerja">Prakerja</SelectItem>
                                        <SelectItem value="berkala">Berkala</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.mcu_type && <p className="text-sm text-red-500">{errors.mcu_type}</p>}
                        </div>

                        <div>
                            <Label>Provider MCU</Label>
                            <Select
                                value={data.provider_id}
                                onValueChange={(value) => {
                                    setData('provider_id', value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {providers.map((provider) => (
                                            <SelectItem key={provider.id} value={provider.id}>
                                                {provider.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.provider_id && <p className="text-sm text-red-500">{errors.provider_id}</p>}
                        </div>
                    </div>

                    <Card className="mt-4 gap-3 py-3">
                        <CardHeader className="px-3">
                            <CardTitle>Kandidat</CardTitle>
                            {/* <CardDescription>Card Description</CardDescription> */}
                        </CardHeader>
                        <CardContent className="grid grid-flow-col grid-rows-2 gap-2 px-3 py-0">
                            <RecordItem label="Nama" value={participant?.name ?? '-'} />
                            <RecordItem label="Jabatan" value={participant?.position ?? '-'} />
                            <RecordItem label="Departemen" value={participant?.department?.name ?? '-'} />
                            <RecordItem label="Tanggal Lahir" value={participant?.birth_date ?? '-'} />
                            <RecordItem label="Jenis Kelamin" value={participant === null ? '-' : parseGender(participant?.gender)} />
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 px-3">
                            {/* <p>Card Footer</p> */}
                            <Button variant="outline" type="button" onClick={() => setOpenPartiLookup(true)}>
                                <Search className="mr-2 h-4 w-4" />
                                Cari Kandidat
                            </Button>

                            <Button type="button">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Kandidat Baru
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="mt-3">
                        <Label>Dokumen MCU</Label>
                        <FileUpload
                            value={data.files}
                            onChange={(files) => setData('files', files)}
                            maxFiles={5}
                            maxSize={2 * 1024 * 1024}
                            error={errors.files}
                            accept={{
                                'application/pdf': [],
                                'image/*': [],
                            }}
                        />
                    </div>

                    <Card className="mt-4 gap-3 py-3">
                        <CardHeader className="flex flex-row justify-between px-3">
                            <CardTitle>Hasil MCU</CardTitle>
                            <Button type="button" onClick={() => setOpenParamLookup(true)} disabled={participant == null}>
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
                                        <TableHead></TableHead>
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
                                                const minValueStr = param_result.ranges?.[participant?.gender === 'female' ? 'female' : 'male']?.min;
                                                const maxValueStr = param_result.ranges?.[participant?.gender === 'female' ? 'female' : 'male']?.max;

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

                    <div className="mt-6 flex justify-end gap-2 border-t pt-6">
                        <Link href="/participant">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
                {openPartiLookup && (
                    <ParticipantLookup
                        open={openPartiLookup}
                        onOpenChange={setOpenPartiLookup}
                        value={participant}
                        onSelect={(p: Participant) => {
                            setData({
                                ...data,
                                mcu_param_results: [],
                            });
                            setParticipant(p);
                            setData('participant_id', p.id);
                            setData('company_id', p.company_id);
                            setOpenPartiLookup(false);
                        }}
                    />
                )}
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

                            // const converted = parseToMCUParamResults(p);

                            // const existingIds = data.mcu_param_results.map((r) => r.id);

                            // const filtered = converted.filter((item) => !existingIds.includes(item.id));

                            // setData({
                            //     ...data,
                            //     mcu_param_results: [...data.mcu_param_results, ...filtered],
                            // });
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
