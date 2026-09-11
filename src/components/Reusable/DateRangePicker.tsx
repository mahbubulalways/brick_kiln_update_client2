"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  onChange?: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
}

export default function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  // formatted display
  const formattedDate =
    startDate && endDate
      ? `${startDate.getDate().toString().padStart(2, "0")}/${(
          startDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${startDate.getFullYear()} → ${endDate
          .getDate()
          .toString()
          .padStart(2, "0")}/${(endDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${endDate.getFullYear()}`
      : "শুরু তারিখ → শেষ তারিখ";

  // handle date changes
  const handleSelect = (type: "start" | "end", date?: Date) => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }

    if (onChange) {
      onChange({
        startDate: type === "start" ? date : startDate,
        endDate: type === "end" ? date : endDate,
      });
    }
  };

  return (
    <div className="w-max">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-full flex justify-between gap-2 cursor-pointer items-center px-2 py-1   text-gray-500 border border-gray-300 rounded focus:ring-2 ring-gray-300 text-sm">
            <span>{formattedDate}</span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="flex gap-2 w-auto p-4 " align="center">
          <div>
            <p className=" text-[2px] lg:text-xs text-gray-500 mb-2">
              শুরু তারিখ
            </p>
            <Calendar
              mode="single"
              selected={startDate}
              captionLayout="dropdown"
              onSelect={(date) => handleSelect("start", date)}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">শেষ তারিখ</p>
            <Calendar
              mode="single"
              selected={endDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                handleSelect("end", date);
                setOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
