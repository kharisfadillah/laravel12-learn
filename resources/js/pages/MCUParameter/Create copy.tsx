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
            male: { min: "", max: "" },
            female: { min: "", max: "" },
        },
        options: [""],
    });

    const genders: { key: "male" | "female"; label: string }[] = [
        { key: "male", label: "Laki-laki" },
        { key: "female", label: "Perempuan" },
    ];


    const update = (gender: "male" | "female", key: "min" | "max", value: string) => {
        setData("ranges", {
            ...data.ranges,
            [gender]: {
                ...data.ranges[gender],
                [key]: value,
            },
        });
    };

    const addRow = () => {
        setData('options', [...data.options, '']);
    };

    const removeRow = (index: number) => {
        const updated = [...data.options];
        updated.splice(index, 1);
        setData('options', updated);
    };

    const formatDecimal = (value: string) => {
        if (value === "" || isNaN(Number(value))) return "";
        return Number(value).toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mcu-parameter');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Parameter MCU" />

            <div className="max-w-2xl p-6">
                <h2 className="text-xl font-semibold">Tambah Parameter MCU</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data parameter baru. Klik simpan untuk menyimpan data.</p>

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="category_id">Kategori</Label>
                            <Select name="category_id" value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {mcucategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama parameter"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="types">Tipe Input</Label>
                            <Select name="types" value={data.input_type} onValueChange={(value) => {
                                setData('input_type', value);
                                setData('options', ['']);
                                setData("ranges", {
                                    male: { min: "", max: "" },
                                    female: { min: "", max: "" },
                                });
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tipe Input" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {inputtypes.map((inputtype) => (
                                            <SelectItem value={inputtype}>{inputtype}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.input_type && <p className="text-sm text-red-500">{errors.input_type}</p>}
                        </div>

                        <div>
                            <Label htmlFor="unit">Satuan</Label>
                            <Input
                                id="unit"
                                value={data.unit}
                                onChange={(e) => setData('unit', e.target.value)}
                                placeholder="Masukkan satuan, misal mm/Hg"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    {data.input_type === "Angka" && (
                        <div className="mt-3 grid grid-cols-1 gap-4">
                            {/* <h3 className="font-semibold mb-2">Nilai Normal</h3> */}
                            <div>
                                <Label htmlFor="types">Nilai Normal</Label>
                                <div className="border rounded-xl">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-32">Jenis Kelamin</TableHead>
                                                <TableHead>Nilai Minimal</TableHead>
                                                <TableHead>Nilai Maksimal</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {genders.map((g) => (
                                                <TableRow key={g.key}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span>{g.label}</span>

                                                            {/* Checkbox hanya untuk Perempuan */}
                                                            {g.key === "female" && (
                                                                <label className="text-sm flex items-center gap-2 mt-1">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={followMale}
                                                                        onChange={(e) => {
                                                                            setFollowMale(e.target.checked);
                                                                            if (e.target.checked) {
                                                                                // Set female sama dengan male
                                                                                update("female", "min", data.ranges.male.min);
                                                                                update("female", "max", data.ranges.male.max);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span>Sama dengan laki-laki</span>
                                                                </label>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Nilai Minimal */}
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            className="text-right"
                                                            value={data.ranges[g.key].min ?? ""}
                                                            disabled={g.key === "female" && followMale} // disable female jika checkbox aktif
                                                            onChange={(e) => {
                                                                update(g.key, "min", e.target.value);

                                                                // Jika male berubah dan checkbox aktif, update female juga
                                                                if (g.key === "male" && followMale) {
                                                                    update("female", "min", e.target.value);
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                const formatted = formatDecimal(e.target.value);
                                                                update(g.key, "min", formatted);

                                                                if (g.key === "male" && followMale) {
                                                                    update("female", "min", formatted);
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>

                                                    {/* Nilai Maksimal */}
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            className="text-right"
                                                            value={data.ranges[g.key].max ?? ""}
                                                            disabled={g.key === "female" && followMale}
                                                            onChange={(e) => {
                                                                update(g.key, "max", e.target.value);

                                                                if (g.key === "male" && followMale) {
                                                                    update("female", "max", e.target.value);
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                const formatted = formatDecimal(e.target.value);
                                                                update(g.key, "max", formatted);

                                                                if (g.key === "male" && followMale) {
                                                                    update("female", "max", formatted);
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                </div>
                            </div>

                        </div>
                    )}

                    {data.input_type === "Pilihan" && (
                        <div className="mt-3">
                            <Label>Pilihan</Label>

                            <div className="mt-2 space-y-2">
                                {data.options.map((opt, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...data.options];
                                                newOptions[index] = e.target.value;
                                                setData("options", newOptions);
                                            }}
                                            placeholder={`Pilihan ${index + 1}`}
                                        />

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeRow(index)}
                                            disabled={data.options.length === 1}
                                        >
                                            <Trash2 size={16} />
                                        </Button>

                                        {/* Tombol hapus */}
                                        {/* {data.options.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    const newOptions = data.options.filter((_, i) => i !== index);
                                                    setData("options", newOptions);
                                                }}
                                            >
                                                Hapus
                                            </Button>
                                        )} */}
                                    </div>
                                ))}
                            </div>

                            {/* Tambah opsi */}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => addRow()}
                            // onClick={() => setData("options", [...data.options, ""])}
                            >
                                + Tambah Pilihan
                            </Button>

                            {errors.options && (
                                <p className="text-sm text-red-500">{errors.options}</p>
                            )}
                        </div>
                    )}


                    <div className="mt-6 flex justify-end gap-2 border-t pt-6">
                        <Link href="/mcu-parameter">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
