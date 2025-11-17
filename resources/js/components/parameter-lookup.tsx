import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MCUParameter } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (selected: MCUParameter[]) => void;
}

export default function ParameterLookup({ open, onOpenChange, onSelect }: Props) {
    const [parameters, setParameters] = useState<MCUParameter[]>([]);
    const [selected, setSelected] = useState<MCUParameter[]>([]);
    const [loading, setLoading] = useState(false);

    // FETCH SAAT MODAL DIBUKA
    useEffect(() => {
        if (open) {
            setLoading(true);
            axios
                .get('/mcu-parameter/search')
                .then((res) => {
                    setParameters(res.data);
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
        onOpenChange(false); // TUTUP MODAL
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Pilih Parameter MCU</DialogTitle>
                </DialogHeader>

                <div className="mt-2 max-h-80 space-y-3 overflow-y-auto">
                    {loading && <div className="py-4 text-center text-muted-foreground">Memuat parameter...</div>}

                    {!loading &&
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
                        })}
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
