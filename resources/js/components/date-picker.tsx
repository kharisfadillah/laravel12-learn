// 'use client';

// import { format } from 'date-fns';
// import { Calendar as CalendarIcon } from 'lucide-react';
// import * as React from 'react';

// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';

// export function DatePicker({ value, onChange }: { value?: Date; onChange?: (date: Date | undefined) => void }) {
//     const [date, setDate] = React.useState<Date | undefined>(value);

//     function handleSelect(selectedDate: Date | undefined) {
//         setDate(selectedDate);
//         onChange?.(selectedDate);
//     }

//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button variant={'outline'} className={cn('w-full flex justify-start text-left font-normal', !date && 'text-muted-foreground')}>
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {date ? format(date, 'PPP') : <span>Pilih tanggal</span>}
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//                 <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
//             </PopoverContent>
//         </Popover>
//     );
// }

"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ value, onChange }: { value?: Date; onChange?: (date: Date | undefined) => void }) {
  const [open, setOpen] = React.useState(false)
//   const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [date, setDate] = React.useState<Date | undefined>(value)

  return (
    // <div className="flex flex-col gap-3">
    //   <Label htmlFor="date" className="px-1">
    //     Date of birth
    //   </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full flex justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Pilih Tanggal"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            // className="w-full"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
              onChange?.(date)
            }}
          />
        </PopoverContent>
      </Popover>
    // </div>
  )
}

