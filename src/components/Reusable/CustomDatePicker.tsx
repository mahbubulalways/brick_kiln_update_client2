"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
    Controller,
    FieldError,
    RegisterOptions,
} from "react-hook-form";

import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type TCustomDatePickerProps = {
    name: string;
    control: any;
    label?: string;
    placeholder?: string;
    rules?: RegisterOptions;
    error?: FieldError;

    disablePastDates?: boolean;
    maxFutureDays?: number;

    minDate?: Date;
    maxDate?: Date;

    border?: boolean;
};

const CustomDatePicker = ({
    name,
    control,
    label,
    placeholder = "Select a date",
    rules,
    error,

    disablePastDates = false,
    maxFutureDays,

    minDate,
    maxDate,

    border = true,
}: TCustomDatePickerProps) => {
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
    // NORMALIZE DATE
    // ==========================================

    const normalizeDate = (date?: Date) => {
        if (!date) return undefined;

        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );
    };

    const normalizedMinDate = normalizeDate(minDate);
    const normalizedMaxDate = normalizeDate(maxDate);

    // ==========================================
    // RESOLVED MIN DATE
    // ==========================================

    let resolvedMinDate: Date | undefined;

    if (disablePastDates && normalizedMinDate) {
        // Take the later date
        resolvedMinDate =
            today > normalizedMinDate
                ? today
                : normalizedMinDate;
    } else if (disablePastDates) {
        resolvedMinDate = today;
    } else {
        resolvedMinDate = normalizedMinDate;
    }

    // ==========================================
    // RESOLVED MAX DATE
    // ==========================================

    let resolvedMaxDate: Date | undefined;

    if (maxFutureDays !== undefined) {
        const futureDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + maxFutureDays,
        );

        if (normalizedMaxDate) {
            // Take the earlier date
            resolvedMaxDate =
                futureDate < normalizedMaxDate
                    ? futureDate
                    : normalizedMaxDate;
        } else {
            resolvedMaxDate = futureDate;
        }
    } else {
        resolvedMaxDate = normalizedMaxDate;
    }

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
    // RENDER
    // ==========================================

    return (
        <div className="w-full">
            {/* ==========================================
                LABEL
            ========================================== */}

            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-600">
                    {label}

                    {rules && (
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    )}
                </label>
            )}

            {/* ==========================================
                CONTROLLER
            ========================================== */}

            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field }) => {
                    // ==========================================
                    // SELECTED DATE
                    // ==========================================

                    const selectedDate =
                        field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                            ? field.value
                            : field.value
                                ? new Date(field.value)
                                : undefined;

                    return (
                        <div className="relative w-full">
                            <Popover
                                open={open}
                                onOpenChange={setOpen}
                            >
                                {/* ==================================
                                    TRIGGER
                                ================================== */}

                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        onBlur={field.onBlur}
                                        className={`relative flex h-9 w-full items-center rounded-lg bg-white text-left transition-colors ${border
                                            ? "border px-4 py-2"
                                            : ""
                                            } ${error
                                                ? "border-2 border-red-500"
                                                : border
                                                    ? "border-gray-300 focus:ring-2 focus:ring-[#006A4E]"
                                                    : ""
                                            }`}
                                    >
                                        <span
                                            className={`w-full truncate pr-8 text-sm ${selectedDate
                                                ? "text-black"
                                                : "text-black/50"
                                                }`}
                                        >
                                            {selectedDate
                                                ? formatDate(
                                                    selectedDate,
                                                )
                                                : placeholder}
                                        </span>

                                        {border && (
                                            <CalendarIcon
                                                size={18}
                                                className="pointer-events-none absolute right-3 text-gray-400"
                                            />
                                        )}
                                    </button>
                                </PopoverTrigger>

                                {/* ==================================
                                    CALENDAR
                                ================================== */}

                                <PopoverContent
                                    align="start"
                                    className="w-auto p-2"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        captionLayout="dropdown"

                                        fromYear={
                                            resolvedMinDate?.getFullYear() ??
                                            2000
                                        }

                                        toYear={
                                            resolvedMaxDate?.getFullYear() ??
                                            new Date().getFullYear() + 10
                                        }

                                        onSelect={(date) => {
                                            if (!date) {
                                                field.onChange(
                                                    undefined,
                                                );
                                                return;
                                            }

                                            // ==========================================
                                            // KEEP ONLY CALENDAR DATE
                                            // ==========================================

                                            const selected =
                                                new Date(
                                                    date.getFullYear(),
                                                    date.getMonth(),
                                                    date.getDate(),
                                                );

                                            // ==========================================
                                            // EXTRA SAFETY CHECK
                                            // ==========================================

                                            if (
                                                resolvedMinDate &&
                                                selected <
                                                resolvedMinDate
                                            ) {
                                                return;
                                            }

                                            if (
                                                resolvedMaxDate &&
                                                selected >
                                                resolvedMaxDate
                                            ) {
                                                return;
                                            }

                                            field.onChange(
                                                selected,
                                            );

                                            setOpen(false);
                                        }}

                                        // ==========================================
                                        // DISABLE DATES
                                        // ==========================================

                                        disabled={(date) => {
                                            const currentDate =
                                                new Date(
                                                    date.getFullYear(),
                                                    date.getMonth(),
                                                    date.getDate(),
                                                );

                                            // Before minimum date
                                            if (
                                                resolvedMinDate &&
                                                currentDate <
                                                resolvedMinDate
                                            ) {
                                                return true;
                                            }

                                            // After maximum date
                                            if (
                                                resolvedMaxDate &&
                                                currentDate >
                                                resolvedMaxDate
                                            ) {
                                                return true;
                                            }

                                            return false;
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>

                            {/* ==========================================
                                ERROR
                            ========================================== */}

                            {error && (
                                <p className="mt-1 text-sm text-red-600">
                                    {error.message}
                                </p>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default CustomDatePicker;