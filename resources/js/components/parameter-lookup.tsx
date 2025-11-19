import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MCUParameter } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

type GroupedParameters = Record<string, MCUParameter[]>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (selected: MCUParameter[]) => void;
    initialSelection: MCUParameter[];
}

export default function ParameterLookup({ open, onOpenChange, onSelect, initialSelection }: Props) {
    const [categories, setCategories] = useState<string[]>([]);
    const [groupedParameters, setGroupedParameters] = useState<GroupedParameters | null>(null);
    const [selected, setSelected] = useState<MCUParameter[]>(initialSelection);
    const [loading, setLoading] = useState(false);

    // FETCH SAAT MODAL DIBUKA
    useEffect(() => {
        if (open) {
            // setSelected(initialSelection);
            setLoading(true);
            axios
                .get('/mcu-parameter/search')
                .then((res) => {
                    console.log(res.data);
                    const groupedParameters: GroupedParameters = res.data.reduce(
                        (acc: { [x: string]: unknown[] }, item: { category: { name: string } }) => {
                            const cat = item.category?.name ?? 'Tanpa Kategori';

                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(item);

                            return acc;
                        },
                        {},
                    );

                    const categories = Array.from(
                        new Set<string>(
                            res.data
                                .map((item: { category: { name: string } }) => item.category?.name) // ambil category name
                                .filter(Boolean), // buang null/undefined
                        ),
                    );
                    setCategories(categories);
                    setGroupedParameters(groupedParameters);
                })
                .finally(() => setLoading(false));
        } else {
            setSelected([]); // reset saat modal ditutup
        }
    }, [open]);

    const toggleSelect = (param: MCUParameter) => {
        setSelected((prev) => {
            const exists = prev.find((p) => p.id === param.id);
            if (exists) {
                return prev.filter((p) => p.id !== param.id);
            }
            return [...prev, param];
        });
    };

    const applySelection = () => {
        onSelect(selected);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px] sm:max-h-[1200px] overflow-y-auto" aria-description='Pilih Parameter MCU'>
                <DialogHeader>
                    <DialogTitle>Pilih Parameter MCU</DialogTitle>
                </DialogHeader>

                <div className="mt-2 max-h-80 space-y-3 overflow-y-auto">
                    {loading && <div className="py-4 text-center text-muted-foreground">Memuat parameter...</div>}

                    {!loading &&
                        categories.map((cat, index) => {
                            const params = groupedParameters === null ? [] : groupedParameters[cat];

                            return (
                                <div key={index} className="grid">
                                    <p className="text-sm font-bold">{cat}</p>
                                    <div className="grid auto-rows-auto grid-cols-5 gap-2 px-3">
                                        {params.map((param) => {
                                            const checked = selected.some((p) => p.id === param.id);
                                            return (
                                                <Label key={param.id} className="flex items-center gap-2">
                                                    <Checkbox checked={checked} onCheckedChange={() => toggleSelect(param)} />
                                                    {/* <Input
                                                        type="checkbox"
                                                        value={param.id}
                                                        // checked={selectedIds.includes(param.id)}
                                                        onChange={(e) => {
                                                            // if (e.target.checked) {
                                                            //     setSelectedIds([...selectedIds, param.id]);
                                                            // } else {
                                                            //     setSelectedIds(selectedIds.filter((id) => id !== param.id));
                                                            // }
                                                        }}
                                                    /> */}
                                                    <span className="text-sm">{param.name}</span>
                                                </Label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                    {/* {!loading &&
                        parameters.map((param) => {
                            const checked = selected.some((p) => p.id === param.id);

                            return (
                                <div key={param.id} className="flex items-center space-x-3 rounded border p-2">
                                    <Checkbox checked={checked} onCheckedChange={() => toggleSelect(param)} />

                                    <div className="text-sm">
                                        <div className="font-medium">{param.name}</div>
                                        <div className="text-xs text-muted-foreground">{param.category?.name}</div>
                                    </div>
                                </div>
                            );
                        })} */}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button onClick={applySelection} disabled={selected.length === 0}>
                        Pilih ({selected.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
