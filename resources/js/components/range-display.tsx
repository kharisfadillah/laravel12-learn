import React from "react";
import { formatRange } from "@/lib/utils";

// Sesuaikan struktur tipe agar aman
type GenderRange = {
    min?: string;
    max?: string;
};

type Ranges = {
    male?: GenderRange;
    female?: GenderRange;
} | null;

type Props = {
    ranges?: Ranges | null;
    genderIcons?: {
        male: React.ReactNode;
        female: React.ReactNode;
    };
};

export function RangeDisplay({ ranges, genderIcons }: Props) {
    if (!ranges) return null;

    const male = ranges.male;
    const female = ranges.female;

    const maleFormatted = male ? formatRange(male) : null;
    const femaleFormatted = female ? formatRange(female) : null;

    // Jika sama → tampilkan sekali aja
    const sameRange =
        male &&
        female &&
        male.min === female.min &&
        male.max === female.max;

    if (sameRange && male) {
        return (
            <div className="flex items-center gap-2">
                <span>{formatRange(male)}</span>
            </div>
        );
    }

    return (
        <>
            {male && (
                <div className="flex items-center gap-2">
                    {genderIcons?.male}
                    <span>{maleFormatted}</span>
                </div>
            )}

            {female && (
                <div className="flex items-center gap-2">
                    {genderIcons?.female}
                    <span>{femaleFormatted}</span>
                </div>
            )}
        </>
    );
}
