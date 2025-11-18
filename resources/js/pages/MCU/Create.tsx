import { DatePicker } from '@/components/date-picker';
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
import { parseToMCUParameters, parseToMCUParamResults } from '@/lib/utils';
import type { BreadcrumbItem, MCUParamResult, Participant } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Mars, Search, Settings, Trash2, UserPlus, Venus } from 'lucide-react';
import { JSX, useState } from 'react';

// type MCUParamResult = {
//     id: string;
//     // category_id: string;
//     category: string;
//     name: string;
//     input_type: string;
//     unit?: string | null;
//     // ranges: string;
//     ranges?: {
//         male: { min: string; max: string };
//         female: { min: string; max: string };
//     } | null;
//     options?: string[];
//     result: string;
//     notes: string;
// };

type FormValues = {
    company_id: string;
    mcu_type: string;
    mcu_date: string;
    participant_id: string;
    name: string;
    position: string;
    department_id: string;
    department_code: string;
    department_name: string;
    birth_date: string;
    gender: string;
    phone: string;
    provider_id: string;
    mcu_param_results: MCUParamResult[];
};

interface Company {
    id: string;
    name: string;
}

interface Department {
    id: string;
    name: string;
    company_id: string;
}

// interface Participant

interface Props {
    companies: Company[];
    departments: Department[];
}

const genderIcons: Record<'male' | 'female', JSX.Element> = {
    male: <Venus className="inline h-4 w-4 text-blue-600" />,
    female: <Mars className="inline h-4 w-4 text-pink-600" />,
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Medical Check Up', href: '/mcu' },
    { title: 'Tambah', href: '/mcu/create' },
];

export default function Create({ companies }: Props) {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [selectedParam, setSelectedParam] = useState<MCUParamResult | null>(null);
    const [openPartiLookup, setOpenPartiLookup] = useState(false);
    const [openParamLookup, setOpenParamLookup] = useState(false);
    const [openDeleteParam, setOpenDeleteParam] = useState(false);
    const { data, setData, post, processing, errors } = useForm<FormValues>({
        // const form = useForm<FormValues>({
        company_id: '',
        mcu_type: '',
        mcu_date: '',
        participant_id: '',
        name: '',
        position: '',
        department_id: '',
        department_code: '',
        department_name: '',
        birth_date: '',
        gender: '',
        phone: '',
        provider_id: '',
        mcu_param_results: [],
    });

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
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="company_id">Unit Usaha</Label>
                            <Select
                                value={data.company_id}
                                onValueChange={(value) => {
                                    setData('company_id', value);
                                    setData('participant_id', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Unit Usaha" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={company.id}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.company_id && <p className="text-sm text-red-500">{errors.company_id}</p>}
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
                            <Label htmlFor="mcu_date">Tanggal MCU</Label>
                            <DatePicker
                                value={data.mcu_date ? new Date(data.mcu_date) : undefined}
                                onChange={(date) => setData('mcu_date', date ? format(date, 'yyyy-MM-dd') : '')}
                            />
                            {errors.mcu_date && <p className="text-sm text-red-500">{errors.mcu_date}</p>}
                        </div>
                    </div>

                    {/* <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Kandidat</Label>
                            <ParticipantLookup
                                value={null}
                                onSelect={(participant) => {
                                    setData('participant_id', participant.id);
                                    setParticipant(participant);
                                }}
                            />
                        </div>
                    </div> */}

                    <Card className="mt-4 gap-3 py-3">
                        <CardHeader className="px-3">
                            <CardTitle>Kandidat</CardTitle>
                            {/* <CardDescription>Card Description</CardDescription> */}
                        </CardHeader>
                        <CardContent className="grid grid-flow-col grid-rows-2 gap-2 px-3 py-0">
                            {/* <RecordItem label="Unit Usaha" value={participant?.company?.name ?? ''} /> */}
                            <RecordItem label="Nama" value={participant?.name ?? '-'} />
                            <RecordItem label="Jabatan" value={participant?.position ?? '-'} />
                            <RecordItem label="Departemen" value={participant?.department?.name ?? '-'} />
                            <RecordItem label="Tanggal Lahir" value={participant?.birth_date ?? '-'} />
                            <RecordItem label="Jenis Kelamin" value={participant?.gender ?? '-'} />
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 px-3">
                            {/* <p>Card Footer</p> */}
                            <Button variant="outline" onClick={() => setOpenPartiLookup(true)}>
                                <Search className="mr-2 h-4 w-4" />
                                Cari Kandidat
                            </Button>

                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Kandidat Baru
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="mt-4 gap-3 py-3">
                        <CardHeader className="flex flex-row justify-between px-3">
                            <CardTitle>Parameter MCU</CardTitle>

                            <Button onClick={() => setOpenParamLookup(true)}>
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
                                            const handleChange = (value: string) => {
                                                setData(
                                                    'mcu_param_results',
                                                    data.mcu_param_results.map((r, i) => (i === index ? { ...r, result: value } : r)),
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

                                                    {/* <TableCell className="py-0.5">
                                                        {Object.entries(param_result.ranges ?? {}).map(([gender, value]) => (
                                                            <div key={gender} className="flex items-center gap-2">
                                                                {genderIcons[gender as "male" | "female"]}
                                                                <span>{value.min} – {value.max}</span>
                                                            </div>
                                                        ))}
                                                    </TableCell> */}
                                                    <TableCell className="py-0.5">
                                                        {param_result.input_type === 'Angka' && (
                                                            <Input
                                                                type="number"
                                                                value={param_result.result || ''}
                                                                onChange={(e) => handleChange(e.target.value)}
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
                                                                            <SelectItem value={opt}>{opt}</SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-0.5"></TableCell>
                                                    <TableCell className="py-0.5">
                                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteParamClick(param_result)}>
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
                        // companyId={data.company_id} // opsional jika mau filter berdasarkan unit usaha
                        onSelect={(p: Participant) => {
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
