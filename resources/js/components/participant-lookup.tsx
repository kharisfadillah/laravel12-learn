import { Participant } from '@/types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { parseGender } from '@/lib/utils';

interface Props {
    value: Participant | null;
    onSelect: (participant: Participant) => void;

    open: boolean;
    onOpenChange: (v: boolean) => void;
}

export default function ParticipantLookup({ value, onSelect, open, onOpenChange }: Props) {
    const [inputValue, setInputValue] = useState(value?.name ?? '');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Participant[]>([]);

    const search = async (keyword: string) => {
        if (!keyword) return;

        setLoading(true);
        onOpenChange(true);

        const res = await fetch(`/participant/search?q=${encodeURIComponent(keyword)}`);
        const data = await res.json();

        setResults(data);
        setLoading(false);
    };

    return (
        <div>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[1000px]">
                    <DialogHeader>
                        <DialogTitle>Hasil Pencarian</DialogTitle>
                        <DialogDescription>Pilih salah satu peserta.</DialogDescription>
                    </DialogHeader>

                    <Input
                        value={inputValue}
                        placeholder="Ketik nama kandidat lalu tekan Enter..."
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                search(inputValue);
                            }
                        }}
                    />

                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <Table className="w-full text-sm">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit Usaha</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Posisi</TableHead>
                                    <TableHead>Departemen</TableHead>
                                    <TableHead>Tanggal Lahir</TableHead>
                                    <TableHead>Jenis Kelamin</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {results.length > 0 ? (
                                    results.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => {
                                                onSelect(item);
                                                setInputValue(item.name);
                                                onOpenChange(false);
                                            }}
                                        >
                                            <TableCell>{item.company?.name}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.position}</TableCell>
                                            <TableCell>{item.department?.name}</TableCell>
                                            <TableCell>{item.birth_date}</TableCell>
                                            <TableCell>{parseGender(item.gender)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Tidak ada hasil
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Participant } from '@/types';
// import { Loader2 } from 'lucide-react';
// import { useState } from 'react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

// interface Props {
//     value: Participant | null;
//     onSelect: (participant: Participant) => void;
// }

// export default function ParticipantLookup({ value, onSelect }: Props) {
//     const [inputValue, setInputValue] = useState(value?.name ?? '');
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [results, setResults] = useState<Participant[]>([]);

//     const search = async (keyword: string) => {
//         if (!keyword) return;

//         setLoading(true);
//         setOpen(true);

//         const res = await fetch(`/participant/search?q=${encodeURIComponent(keyword)}`);
//         const data = await res.json();

//         // Batasi 10 hasil
//         setResults(data);

//         setLoading(false);
//     };

//     return (
//         <div>
//             {/* <Input
//                 value={inputValue}
//                 placeholder="Ketik nama kandidat lalu tekan Enter..."
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                         search(inputValue);
//                     }
//                 }}
//             /> */}

//             <Input
//                 value={inputValue}
//                 placeholder="Ketik nama kandidat lalu tekan Enter..."
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                         e.preventDefault(); // ← Mencegah form submit / blur
//                         e.stopPropagation(); // ← Tambahan agar dialog tidak tertutup
//                         search(inputValue);
//                     }
//                 }}
//             />

//             <Dialog open={open} onOpenChange={setOpen}>
//                 {/* <DialogContent className="w-full max-w-screen-md"> */}
//                 <DialogContent className="sm:max-w-[1000px]">
//                     <DialogHeader>
//                         <DialogTitle>Hasil Pencarian</DialogTitle>
//                         <DialogDescription>Berikut data hasil pencarian (max. 10).</DialogDescription>
//                     </DialogHeader>

//                     {loading ? (
//                         <div className="flex items-center justify-center py-10">
//                             <Loader2 className="h-6 w-6 animate-spin" />
//                         </div>
//                     ) : (
//                         // <div className="overflow-hidden rounded-md border">
//                         <Table className="w-full text-sm">
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Unit Usaha</TableHead>
//                                     <TableHead>Nama</TableHead>
//                                     <TableHead>Posisi</TableHead>
//                                     <TableHead>Departemen</TableHead>
//                                     <TableHead>Tanggal Lahir</TableHead>
//                                     <TableHead>Jenis Kelamin</TableHead>
//                                 </TableRow>
//                             </TableHeader>

//                             <TableBody>
//                                 {results.length > 0 ? (
//                                     results.map((item) => (
//                                         <TableRow
//                                             key={item.id}
//                                             className="cursor-pointer hover:bg-gray-50"
//                                             onClick={() => {
//                                                 onSelect(item);
//                                                 setInputValue(item.name);
//                                                 setOpen(false);
//                                             }}
//                                         >
//                                             <TableCell>{item.company?.name}</TableCell>
//                                             <TableCell>{item.name}</TableCell>
//                                             <TableCell>{item.position}</TableCell>
//                                             <TableCell>{item.department?.name}</TableCell>
//                                             <TableCell>{item.birth_date}</TableCell>
//                                             <TableCell>{item.gender}</TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={4} className="text-center text-muted-foreground">
//                                             Tidak ada hasil
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                         // </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }
