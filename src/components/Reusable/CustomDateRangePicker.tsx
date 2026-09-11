"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type TCustomDateRangePickerProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    disablePastDates?: boolean;
    maxFutureDays?: number;
    minDate?: Date;
    maxDate?: Date;
    border?: boolean;
};

type TDateRange = {
    from?: Date;
    to?: Date;
};

const CustomDateRangePicker = ({
    value = "",
    onChange,
    placeholder = "শুরু তারিখ → শেষ তারিখ",
    label,
    disablePastDates = false,
    maxFutureDays,
    minDate,
    maxDate,
    border = true,
}: TCustomDateRangePickerProps) => {
    const [open, setOpen] = useState(false);

    const [range, setRange] = useState<TDateRange>({});

    const [hoverDate, setHoverDate] = useState<Date>();

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
    // FORMAT DATE
    // ==========================================

    const formatDate = (date: Date) => {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1,
        ).padStart(2, "0");

        const day = String(
            date.getDate(),
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // ==========================================
    // PARSE DATE
    // ==========================================

    const parseDate = (date?: string) => {
        if (!date) return undefined;

        const [year, month, day] = date
            .split("-")
            .map(Number);

        if (!year || !month || !day) {
            return undefined;
        }

        return new Date(
            year,
            month - 1,
            day,
        );
    };

    // ==========================================
    // VALUE DATE
    // ==========================================

    const [startValue, endValue] =
        value.split("_");

    const valueStartDate =
        parseDate(startValue);

    const valueEndDate =
        parseDate(endValue);

    // ==========================================
    // DISPLAY RANGE
    // ==========================================

    const selectedRange =
        range.from || range.to
            ? range
            : {
                  from: valueStartDate,
                  to: valueEndDate,
              };

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
                  today.getDate() +
                      maxFutureDays,
              )
            : maxDate;

    // ==========================================
    // MONTH STATE
    // ==========================================

    const initialMonth =
        selectedRange.from ?? today;

    const [leftMonth, setLeftMonth] =
        useState(
            new Date(
                initialMonth.getFullYear(),
                initialMonth.getMonth(),
                1,
            ),
        );

    const [rightMonth, setRightMonth] =
        useState(
            new Date(
                initialMonth.getFullYear(),
                initialMonth.getMonth() + 1,
                1,
            ),
        );

    // ==========================================
    // DISPLAY DATE
    // ==========================================

    const formatDisplayDate = (
        date?: Date,
    ) => {
        if (!date) return "";

        const day = String(
            date.getDate(),
        ).padStart(2, "0");

        const month = String(
            date.getMonth() + 1,
        ).padStart(2, "0");

        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const displayValue =
        selectedRange.from &&
        selectedRange.to
            ? `${formatDisplayDate(
                  selectedRange.from,
              )} → ${formatDisplayDate(
                  selectedRange.to,
              )}`
            : selectedRange.from
              ? `${formatDisplayDate(
                    selectedRange.from,
                )} →`
              : placeholder;

    // ==========================================
    // DISABLED DATE
    // ==========================================

    const isDateDisabled = (
        date: Date,
    ) => {
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
    };

    // ==========================================
    // RANGE SELECT
    // ==========================================

    const handleDateClick = (
        date: Date,
    ) => {
        // ======================================
        // FIRST DATE
        // ======================================

        if (
            !selectedRange.from ||
            selectedRange.to
        ) {
            const newRange = {
                from: date,
                to: undefined,
            };

            setRange(newRange);

            onChange?.(
                `${formatDate(date)}_`,
            );

            setHoverDate(undefined);

            // Keep calendar OPEN
            return;
        }

        // ======================================
        // SECOND DATE
        // ======================================

        let start = selectedRange.from;

        let end = date;

        // If second date is before first date
        if (date < start) {
            start = date;
            end = selectedRange.from;
        }

        const newRange = {
            from: start,
            to: end,
        };

        setRange(newRange);

        onChange?.(
            `${formatDate(start)}_${formatDate(end)}`,
        );

        setHoverDate(undefined);

        // Close after END DATE
        setOpen(false);
    };

    // ==========================================
    // HOVER DATE
    // ==========================================

    const handleDayMouseEnter = (
        date: Date,
    ) => {
        if (
            selectedRange.from &&
            !selectedRange.to
        ) {
            setHoverDate(date);
        }
    };

    // ==========================================
    // PREVIEW RANGE
    // ==========================================

    const previewRange: TDateRange =
        selectedRange.from &&
        !selectedRange.to &&
        hoverDate
            ? {
                  from:
                      hoverDate <
                      selectedRange.from
                          ? hoverDate
                          : selectedRange.from,

                  to:
                      hoverDate <
                      selectedRange.from
                          ? selectedRange.from
                          : hoverDate,
              }
            : selectedRange;

    // ==========================================
    // CALENDAR CLASS NAMES
    // ==========================================

    const calendarClassNames = {
        day_button:
            "h-8 w-8 rounded-md p-0 font-normal " +
            "aria-selected:!bg-[#006A4E] " +
            "aria-selected:!text-white " +
            "aria-selected:hover:!bg-[#00563F] " +
            "aria-selected:hover:!text-white",

        day_selected:
            "!bg-[#006A4E] " +
            "!text-white " +
            "hover:!bg-[#00563F] " +
            "hover:!text-white",

        day_range_start:
            "!bg-[#006A4E] " +
            "!text-white " +
            "!rounded-l-md " +
            "!rounded-r-none",

        day_range_end:
            "!bg-[#006A4E] " +
            "!text-white " +
            "!rounded-r-md " +
            "!rounded-l-none",

        day_range_middle:
            "!bg-[#E8F5F0] " +
            "!text-[#006A4E] " +
            "!rounded-none",

        day_today:
            "text-[#006A4E] font-semibold " +
            "aria-selected:!bg-[#006A4E] " +
            "aria-selected:!text-white",

        day_disabled:
            "!text-gray-300 !opacity-50",

        day_outside:
            "!text-gray-300 !opacity-50",
    };

    // ==========================================
    // OPEN HANDLER
    // ==========================================

    const handleOpenChange = (
        nextOpen: boolean,
    ) => {
        setOpen(nextOpen);

        if (nextOpen) {
            const baseDate =
                valueStartDate ?? today;

            setLeftMonth(
                new Date(
                    baseDate.getFullYear(),
                    baseDate.getMonth(),
                    1,
                ),
            );

            setRightMonth(
                new Date(
                    baseDate.getFullYear(),
                    baseDate.getMonth() + 1,
                    1,
                ),
            );
        }
    };

    // ==========================================
    // CALENDAR PROPS
    // ==========================================

    const commonCalendarProps = {
        mode: "range" as const,

        selected: previewRange as any,

        onSelect: () => {},

        onDayClick: handleDateClick,

        onDayMouseEnter:
            handleDayMouseEnter,

        disabled: isDateDisabled,

        captionLayout: "dropdown" as const,

        fromYear:
            resolvedMinDate?.getFullYear() ??
            2000,

        toYear:
            resolvedMaxDate?.getFullYear() ??
            today.getFullYear() + 10,

        classNames: calendarClassNames,
    };

    return (
        <div className="w-full">
            {/* ==================================
                LABEL
            ================================== */}

            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-600">
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <Popover
                    open={open}
                    onOpenChange={
                        handleOpenChange
                    }
                >
                    {/* ==================================
                        TRIGGER
                    ================================== */}

                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className={`relative flex h-9 w-full items-center rounded-lg bg-transparent text-left transition-colors ${
                                border
                                    ? "border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#006A4E]"
                                    : ""
                            }`}
                        >
                            <span
                                className={`w-full truncate pr-8 text-sm ${
                                    selectedRange.from
                                        ? "text-black"
                                        : "text-black/50"
                                }`}
                            >
                                {displayValue}
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
                        TWO CALENDARS
                    ================================== */}

                    <PopoverContent
                        align="start"
                        className="w-auto p-3"
                    >
                        <div className="flex gap-4">
                            {/* ==================================
                                LEFT CALENDAR
                            ================================== */}

                            <Calendar
                                {...commonCalendarProps}
                                month={leftMonth}
                                onMonthChange={
                                    setLeftMonth
                                }
                            />

                            {/* ==================================
                                RIGHT CALENDAR
                            ================================== */}

                            <Calendar
                                {...commonCalendarProps}
                                month={rightMonth}
                                onMonthChange={
                                    setRightMonth
                                }
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default CustomDateRangePicker;