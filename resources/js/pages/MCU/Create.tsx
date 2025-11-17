import { DatePicker } from '@/components/date-picker';
import ParticipantLookup from '@/components/participant-lookup';
import { RecordItem } from '@/components/record-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Participant } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Search, UserPlus } from 'lucide-react';
import { useState } from 'react';

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

export default function Create({ companies, departments }: Props) {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [openLookup, setOpenLookup] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
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
                                            <SelectItem value={company.id}>{company.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.company_id && <p className="text-sm text-red-500">{errors.company_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="mcu_type">Tipe MCU</Label>
                            <Select value={data.mcu_type} onValueChange={(value) => setData('mcu_type', value)}>
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
                            <Button variant="outline" onClick={() => setOpenLookup(true)}>
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
                        <CardHeader className="flex justify-between px-3">
                            <CardTitle>Hasil MCU</CardTitle>

                            <Button variant="outline" onClick={() => setOpenLookup(true)}>
                                <Search className="mr-2 h-4 w-4" />
                                Cari Kandidat
                            </Button>
                        </CardHeader>
                        <CardContent className="grid grid-flow-col grid-rows-2 gap-2 px-3 py-0"></CardContent>
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
                {openLookup && (
                    <ParticipantLookup
                        open={openLookup}
                        onOpenChange={setOpenLookup}
                        value={participant}
                        // companyId={data.company_id} // opsional jika mau filter berdasarkan unit usaha
                        onSelect={(p: Participant) => {
                            setParticipant(p);
                            setData('participant_id', p.id);
                            setData('company_id', p.company_id);
                            setOpenLookup(false);
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
