"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function MonthPicker() {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(new Date().getMonth());
  const [year, setYear] = React.useState(new Date().getFullYear());

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedMonth = `${months[month]} ${year}`;

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-between cursor-pointer font-medium text-gray-700 hover:bg-gray-100 transition-all"
          >
            {formattedMonth}
            <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className=" p-3 rounded-lg shadow-lg border border-gray-200"
          align="center"
        >
          {/* Year Selector with arrows */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={prevYear}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <span className="font-medium text-gray-800">{year}</span>
            <button
              onClick={nextYear}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-8">
            {months.map((m, idx) => (
              <button
                key={m}
                onClick={() => {
                  setMonth(idx);
                  setOpen(false);
                }}
                className={`rounded-lg  transition-all cursor-pointer ${
                  idx === month
                    ? "bg-blue-200"
                    : "hover:bg-blue-100 text-gray-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
