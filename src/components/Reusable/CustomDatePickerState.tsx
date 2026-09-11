"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import {
    Dispatch,
    SetStateAction,
    useState,
} from "react";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type TCustomDatePickerStateProps = {
    label?: string;
    placeholder?: string;
    value: Date | undefined;
    onChange: Dispatch<SetStateAction<Date | undefined>>;
    disablePastDates?: boolean;
    maxFutureDays?: number;
    minDate?: Date;
    maxDate?: Date;
    error?: string;
    height?: string;
};

const CustomDatePickerState = ({
    label,
    placeholder = "Select a date",
    value,
    onChange,
    disablePastDates = false,
    maxFutureDays,
    minDate,
    maxDate,
    error,
    height = "10",
}: TCustomDatePickerStateProps) => {
    const [open, setOpen] = useState(false);

    // ==========================================
    // TODAY
    // ==========================================

    const now = new Date();

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );

    // ==========================================
    // MIN DATE
    // ==========================================

    const resolvedMinDate = disablePastDates
        ? today
        : minDate;

    // ==========================================
    // MAX DATE
    // ==========================================

    const resolvedMaxDate =
        maxFutureDays !== undefined
            ? new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + maxFutureDays,
              )
            : maxDate;

    // ==========================================
    // SAFE DATE
    // ==========================================

    const safeDate =
        value instanceof Date &&
        !isNaN(value.getTime())
            ? value
            : undefined;

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date: Date) => {
        const day = date
            .getDate()
            .toString()
            .padStart(2, "0");

        const month = (date.getMonth() + 1)
            .toString()
            .padStart(2, "0");

        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    // ==========================================
    // DATE CHANGE
    // ==========================================

    const handleDateChange = (
        date: Date | undefined,
    ) => {
        if (!date) {
            onChange(undefined);
            return;
        }

        const selectedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );

        onChange(selectedDate);
        setOpen(false);
    };

    return (
        <div>
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-600">
                    {label}
                </label>
            )}

            <div className="relative w-full max-w-[350px]">
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                >
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className={`relative flex ${height} w-full items-center overflow-hidden rounded-lg border bg-white px-4 py-2 text-left transition-colors ${
                                error
                                    ? "border-2 border-red-500"
                                    : "border-gray-300 focus-within:ring-2 focus-within:ring-[#006A4E]"
                            }`}
                        >
                            <span
                                className={`w-full truncate pr-8 text-sm ${
                                    safeDate
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                }`}
                            >
                                {safeDate
                                    ? formatDate(safeDate)
                                    : placeholder}
                            </span>

                            <CalendarIcon
                                size={18}
                                className="pointer-events-none absolute right-3 shrink-0 text-gray-400"
                            />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="start"
                        className="w-[320px] p-2"
                    >
                        <Calendar
                            mode="single"
                            selected={safeDate}
                            captionLayout="dropdown"
                            onSelect={handleDateChange}
                            startMonth={new Date(2020, 0)}
                            endMonth={new Date(2035, 11)}
                            disabled={(date) => {
                                if (
                                    resolvedMinDate &&
                                    date < resolvedMinDate
                                ) {
                                    return true;
                                }

                                if (
                                    resolvedMaxDate &&
                                    date > resolvedMaxDate
                                ) {
                                    return true;
                                }

                                return false;
                            }}
                            className="w-full"
                           
                        />
                    </PopoverContent>
                </Popover>

                {error && (
                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CustomDatePickerState;