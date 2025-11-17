import { DatePicker } from '@/components/date-picker';
import ParameterLookup from '@/components/parameter-lookup';
import ParticipantLookup from '@/components/participant-lookup';
import { RecordItem } from '@/components/record-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Participant } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Search, Settings, UserPlus } from 'lucide-react';
import { useState } from 'react';

type MCUResult = {
    id: string;
    // category_id: string;
    category: string;
    name: string;
    input_type: string;
    unit: string;
    ranges: string;
    options: string;
    result: string;
    notes: string;
};

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
    results: MCUResult[];
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Medical Check Up', href: '/mcu' },
    { title: 'Tambah', href: '/mcu/create' },
];

export default function Create({ companies }: Props) {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [openPartiLookup, setOpenPartiLookup] = useState(false);
    const [openParamLookup, setOpenParamLookup] = useState(false);
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
        results: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mcu');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Medical Check Up" />

            <div className="max-w-5xl p-6">
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
                        <CardContent className="grid grid-flow-col grid-rows-2 gap-2 px-3 py-0">
                            <Table>
                                <TableHeader>
                                    <TableRow key="rowh">
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Parameter</TableHead>
                                        <TableHead>Nilai Rujukan</TableHead>
                                        <TableHead>Nilai Hasil</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.results.length > 1 ? (
                                        data.results.map((result, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="py-0.5">{result.category}</TableCell>
                                                <TableCell className="py-0.5">{result.name}</TableCell>
                                                <TableCell className="py-0.5"></TableCell>
                                                <TableCell className="py-0.5">
                                                    <Input
                                                        type="number"
                                                        value={result.result || ''}
                                                        onChange={(e) =>
                                                            setData(
                                                                'results',
                                                                data.results.map((r, i) => (i === index ? { ...r, result: e.target.value } : r)),
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="py-0.5"></TableCell>
                                                <TableCell className="py-0.5"></TableCell>
                                            </TableRow>
                                        ))
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
                        onSelect={(p) => {
                            // console.log(p);
                            const converted: MCUResult[] = p.map((item) => ({
                                id: item.id,
                                category: item.category?.name ?? '', // sesuaikan
                                name: item.name,
                                input_type: item.input_type ?? 'text', // default jika tidak ada
                                unit: item.unit ?? '',
                                ranges: item.ranges ?? '',
                                options: item.options ?? '',
                                result: '', // always empty until user inputs
                                notes: '',
                            }));

                            // console.log(converted);

                            const existingIds = data.results.map(r => r.id);

                            const filtered = converted.filter(item => !existingIds.includes(item.id));

                            setData({
                                ...data,
                                results: [...data.results, ...filtered],
                            });

                            // setData((datax) => ({
                            //     ...data,
                            //     results: [...data.results, ...converted],
                            // }));

                            // p.forEach(element => {
                            //     if (data.results.)
                            // });

                            // setData('results', converted);
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
