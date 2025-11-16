import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Loader2, User } from "lucide-react";

interface Participant {
    id: string;
    name: string;
    position?: string;
}

interface Props {
    value: Participant | null;
    onSelect: (participant: Participant) => void;
}

export default function ParticipantLookup({ value, onSelect }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Participant[]>([]);

    // Debounce search
    useEffect(() => {
        if (!search) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);

            fetch(`/participant/search?q=${encodeURIComponent(search)}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                })
                .finally(() => setLoading(false));
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div>
                    <Input
                        value={value ? value.name : search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setOpen(true);
                        }}
                        placeholder="Cari kandidat..."
                    />
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup heading="Hasil Pencarian">

                            {loading && (
                                <div className="p-3 flex items-center gap-2 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Mencari...
                                </div>
                            )}

                            {!loading && results.length === 0 && search !== "" && (
                                <div className="p-3 text-sm text-muted-foreground">
                                    Tidak ada hasil
                                </div>
                            )}

                            {!loading &&
                                results.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.id}
                                        onSelect={() => {
                                            onSelect(item);
                                            setSearch("");
                                            setOpen(false);
                                        }}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        {item.name}
                                        {item.position && (
                                            <span className="ml-auto text-xs text-gray-500">{item.position}</span>
                                        )}
                                    </CommandItem>
                                ))}

                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
