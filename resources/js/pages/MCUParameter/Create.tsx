import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MCUCategory {
    id: string;
    name: string;
}

interface Props {
    mcucategories: MCUCategory[];
    inputtypes: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Parameter MCU', href: '/mcu-parameter' },
    { title: 'Tambah', href: '/mcu-parameter/create' },
];

export default function Create({ mcucategories, inputtypes }: Props) {
    const [followMale, setFollowMale] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        input_type: '',
        unit: '',
        ranges: {
            male: { min: '', max: '' },
            female: { min: '', max: '' },
        },
        options: [''],
    });

    const genders: { key: 'male' | 'female'; label: string }[] = [
        { key: 'male', label: 'Laki-laki' },
        { key: 'female', label: 'Perempuan' },
    ];

    const updateRange = (gender: 'male' | 'female', key: 'min' | 'max', value: string) => {
        setData(prev => ({
            ...prev,
            ranges: {
                ...prev.ranges,
                [gender]: { ...prev.ranges[gender], [key]: value },
            },
        }));
    };

    const addOption = () => setData(prev => ({ ...prev, options: [...prev.options, ''] }));
    const removeOption = (index: number) =>
        setData(prev => {
            const opts = [...prev.options];
            opts.splice(index, 1);
            return { ...prev, options: opts };
        });

    const formatDecimal = (value: string) => {
        if (value === '' || isNaN(Number(value))) return '';
        return Number(value).toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mcu-parameter');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Parameter MCU" />

            <div className="max-w-3xl p-6">
                <h2 className="text-xl font-semibold">Tambah Parameter MCU</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data parameter baru. Klik simpan untuk menyimpan data.</p>

                <form onSubmit={handleSubmit} className="mt-3 space-y-4">
                    {/* --- Pilih kategori dan nama --- */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Kategori</Label>
                            <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {mcucategories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                        </div>

                        <div>
                            <Label>Nama Parameter</Label>
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Masukkan nama parameter"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label>Tipe Input</Label>
                            <Select
                                value={data.input_type}
                                onValueChange={val => {
                                    setData(prev => ({
                                        ...prev,
                                        input_type: val,
                                        ranges: { male: { min: '', max: '' }, female: { min: '', max: '' } },
                                        options: [''],
                                    }));
                                    setFollowMale(false);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tipe Input" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {inputtypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.input_type && <p className="text-sm text-red-500">{errors.input_type}</p>}
                        </div>

                        <div>
                            <Label>Satuan</Label>
                            <Input
                                value={data.unit}
                                onChange={e => setData('unit', e.target.value)}
                                placeholder="Misal mm/Hg"
                            />
                        </div>
                    </div>

                    {/* --- Input Angka --- */}
                    {data.input_type === 'Angka' && (
                        <div>
                            <Label>Nilai Normal</Label>
                            <div className="border rounded-xl p-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Jenis Kelamin</TableHead>
                                            <TableHead>Minimal</TableHead>
                                            <TableHead>Maksimal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {genders.map(g => (
                                            <TableRow key={g.key}>
                                                {/* <TableCell className="font-medium flex flex-col gap-1">
                                                    <span>{g.label}</span>
                                                    {g.key === 'female' && (
                                                        <label className="text-sm flex items-center gap-2 mt-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={followMale}
                                                                onChange={e => {
                                                                    setFollowMale(e.target.checked);
                                                                    if (e.target.checked) {
                                                                        updateRange('female', 'min', data.ranges.male.min);
                                                                        updateRange('female', 'max', data.ranges.male.max);
                                                                    }
                                                                }}
                                                            />
                                                            <span>Sama dengan laki-laki</span>
                                                        </label>
                                                    )}
                                                </TableCell> */}

                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{g.label}</span>

                                                        {/* Checkbox hanya untuk Perempuan */}
                                                        {g.key === "female" && (
                                                            <label className="text-sm flex items-center gap-2 mt-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={followMale}
                                                                    onChange={e => {
                                                                        setFollowMale(e.target.checked);
                                                                        if (e.target.checked) {
                                                                            updateRange('female', 'min', data.ranges.male.min);
                                                                            updateRange('female', 'max', data.ranges.male.max);
                                                                        }
                                                                    }}
                                                                />
                                                                <span>Sama dengan laki-laki</span>
                                                            </label>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        className="text-right"
                                                        value={data.ranges[g.key].min}
                                                        disabled={g.key === 'female' && followMale}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            updateRange(g.key, 'min', val);
                                                            if (g.key === 'male' && followMale) updateRange('female', 'min', val);
                                                        }}
                                                        onBlur={e => {
                                                            const val = formatDecimal(e.target.value);
                                                            updateRange(g.key, 'min', val);
                                                            if (g.key === 'male' && followMale) updateRange('female', 'min', val);
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        className="text-right"
                                                        value={data.ranges[g.key].max}
                                                        disabled={g.key === 'female' && followMale}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            updateRange(g.key, 'max', val);
                                                            if (g.key === 'male' && followMale) updateRange('female', 'max', val);
                                                        }}
                                                        onBlur={e => {
                                                            const val = formatDecimal(e.target.value);
                                                            updateRange(g.key, 'max', val);
                                                            if (g.key === 'male' && followMale) updateRange('female', 'max', val);
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* --- Input Teks Bebas --- */}
                    {data.input_type === 'Teks Bebas' && (
                        <div>
                            <Label>Input Teks</Label>
                            <Input
                                value={data.options[0]}
                                onChange={e => setData('options', [e.target.value])}
                                placeholder="Masukkan teks bebas"
                            />
                        </div>
                    )}

                    {/* --- Input Pilihan --- */}
                    {data.input_type === 'Pilihan' && (
                        <div>
                            <Label>Pilihan</Label>
                            <div className="space-y-2 mt-2">
                                {data.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Input
                                            value={opt}
                                            onChange={e => {
                                                const newOpts = [...data.options];
                                                newOpts[i] = e.target.value;
                                                setData('options', newOpts);
                                            }}
                                            placeholder={`Pilihan ${i + 1}`}
                                        />
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeOption(i)} disabled={data.options.length === 1}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addOption}>+ Tambah Pilihan</Button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2 border-t pt-6">
                        <Link href="/mcu-parameter">
                            <Button type="button" variant="outline">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
