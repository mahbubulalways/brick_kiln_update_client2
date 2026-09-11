"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  setDate,
  date,
  readonly,
}: {
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  date?: Date;
  readonly?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  // Format date as day/month/year
  const formattedDate = date
    ? (() => {
        const jsDate = new Date(date);
        return `${jsDate.getDate().toString().padStart(2, "0")}/${(
          jsDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${jsDate.getFullYear()}`;
      })()
    : "তারিখ নির্বাচন";

  return (
    <div className="flex flex-col gap-2 ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="rounded border border-gray-300 justify-between font-normal cursor-pointer py-1 h-auto hover:bg-white focus:ring-2 ring-gray-400 "
            disabled={readonly}
          >
            {formattedDate}
            <ChevronDownIcon className="ml-2 h-3 w-3 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date!);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
