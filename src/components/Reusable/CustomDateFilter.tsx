"use client";

import { useEffect, useRef, useState } from "react";

import {
    CalendarDays,
    ChevronDown,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";

export type DateRange = {
    startDate: Date | null;
    endDate: Date | null;
};

type Preset =
    | "today"
    | "last7"
    | "last30"
    | "thisMonth"
    | "lastMonth"
    | "thisYear"
    | "lastYear"
    | "custom";

interface CustomDateFilterProps {
    value?: DateRange;
    onChange: (range: DateRange) => void;
    placeholder?: string;
    className?: string;
}

/* =========================================================
   PRESETS
========================================================= */

const presets: {
    label: string;
    value: Preset;
}[] = [
        {
            label: "আজ",
            value: "today",
        },
        {
            label: "গত ৭ দিন",
            value: "last7",
        },
        {
            label: "গত ৩০ দিন",
            value: "last30",
        },
        {
            label: "এই মাস",
            value: "thisMonth",
        },
        {
            label: "গত মাস",
            value: "lastMonth",
        },
        {
            label: "এই বছর",
            value: "thisYear",
        },
        {
            label: "গত বছর",
            value: "lastYear",
        },
        {
            label: "কাস্টম তারিখ",
            value: "custom",
        },
    ];

/* =========================================================
   BANGLA NUMBER
========================================================= */

const toBanglaNumber = (
    value: string,
) => {
    const banglaDigits = [
        "০",
        "১",
        "২",
        "৩",
        "৪",
        "৫",
        "৬",
        "৭",
        "৮",
        "৯",
    ];

    return value.replace(
        /\d/g,
        (digit) =>
            banglaDigits[
            Number(digit)
            ],
    );
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (
    date: Date | null,
) => {
    if (!date) {
        return "";
    }

    const day = String(
        date.getDate(),
    ).padStart(2, "0");

    const month = String(
        date.getMonth() + 1,
    ).padStart(2, "0");

    const year =
        date.getFullYear();

    return toBanglaNumber(
        `${day}/${month}/${year}`,
    );
};

/* =========================================================
   START OF DAY
========================================================= */

const startOfDay = (
    date: Date,
) => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0,
    );
};

/* =========================================================
   END OF DAY
========================================================= */

const endOfDay = (
    date: Date,
) => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999,
    );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CustomDateFilter({
    value = {
        startDate: null,
        endDate: null,
    },
    onChange,
    placeholder = "তারিখ নির্বাচন করুন",
    className = "",
}: CustomDateFilterProps) {
    /* =====================================================
       STATES
    ===================================================== */

    const [open, setOpen] =
        useState(false);

    const [showCalendar, setShowCalendar] =
        useState(false);

    /* Applied date */
    const [startDate, setStartDate] =
        useState<Date | null>(
            value.startDate,
        );

    const [endDate, setEndDate] =
        useState<Date | null>(
            value.endDate,
        );

    /* Temporary custom date */
    const [tempRange, setTempRange] =
        useState<{
            from?: Date;
            to?: Date;
        }>({
            from: undefined,
            to: undefined,
        });

    /* Hover date */
    const [hoverDate, setHoverDate] =
        useState<Date>();

    /* Active preset */
    const [activePreset, setActivePreset] =
        useState<Preset | null>(null);

    /* Wrapper */
    const wrapperRef =
        useRef<HTMLDivElement>(null);

    /* =====================================================
       TODAY
    ===================================================== */

    const today = new Date();

    /* =====================================================
       MONTH STATE
    ===================================================== */

    const initialMonth =
        value.startDate ?? today;

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

    /* =====================================================
       SYNC VALUE
    ===================================================== */

    useEffect(() => {
        setStartDate(
            value.startDate,
        );

        setEndDate(
            value.endDate,
        );
    }, [value]);

    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent,
        ) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(
                    event.target as Node,
                )
            ) {
                setOpen(false);
                setShowCalendar(false);
                setHoverDate(undefined);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
        };
    }, []);

    /* =====================================================
       APPLY PRESET
    ===================================================== */

    const applyPresetRange = (
        start: Date,
        end: Date,
        preset: Preset,
    ) => {
        const range: DateRange = {
            startDate:
                startOfDay(start),
            endDate:
                endOfDay(end),
        };

        setStartDate(
            range.startDate,
        );

        setEndDate(
            range.endDate,
        );

        setActivePreset(preset);

        onChange(range);

        setOpen(false);
        setShowCalendar(false);
        setHoverDate(undefined);
    };

    /* =====================================================
       HANDLE PRESET
    ===================================================== */

    const handlePreset = (
        preset: Preset,
    ) => {
        const current =
            new Date();

        /* ================================================
           TODAY
        ================================================= */

        if (preset === "today") {
            applyPresetRange(
                current,
                current,
                preset,
            );

            return;
        }

        /* ================================================
           LAST 7 DAYS
        ================================================= */

        if (preset === "last7") {
            const start =
                new Date(current);

            start.setDate(
                current.getDate() - 6,
            );

            applyPresetRange(
                start,
                current,
                preset,
            );

            return;
        }

        /* ================================================
           LAST 30 DAYS
        ================================================= */

        if (preset === "last30") {
            const start =
                new Date(current);

            start.setDate(
                current.getDate() - 29,
            );

            applyPresetRange(
                start,
                current,
                preset,
            );

            return;
        }

        /* ================================================
           THIS MONTH
        ================================================= */

        if (preset === "thisMonth") {
            const start = new Date(
                current.getFullYear(),
                current.getMonth(),
                1,
            );

            const end = new Date(
                current.getFullYear(),
                current.getMonth() + 1,
                0,
            );

            applyPresetRange(
                start,
                end,
                preset,
            );

            return;
        }

        /* ================================================
           LAST MONTH
        ================================================= */

        if (preset === "lastMonth") {
            const start = new Date(
                current.getFullYear(),
                current.getMonth() - 1,
                1,
            );

            const end = new Date(
                current.getFullYear(),
                current.getMonth(),
                0,
            );

            applyPresetRange(
                start,
                end,
                preset,
            );

            return;
        }

        /* ================================================
           THIS YEAR
        ================================================= */

        if (preset === "thisYear") {
            const start = new Date(
                current.getFullYear(),
                0,
                1,
            );

            const end = new Date(
                current.getFullYear(),
                11,
                31,
            );

            applyPresetRange(
                start,
                end,
                preset,
            );

            return;
        }

        /* ================================================
           LAST YEAR
        ================================================= */

        if (preset === "lastYear") {
            const year =
                current.getFullYear() - 1;

            const start = new Date(
                year,
                0,
                1,
            );

            const end = new Date(
                year,
                11,
                31,
            );

            applyPresetRange(
                start,
                end,
                preset,
            );

            return;
        }

        /* ================================================
           CUSTOM
        ================================================= */

        if (preset === "custom") {
            setActivePreset(
                "custom",
            );

            /* Clear temporary selection */
            setTempRange({
                from: undefined,
                to: undefined,
            });

            setHoverDate(undefined);

            /* Start current month */
            const baseMonth =
                new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    1,
                );

            setLeftMonth(
                baseMonth,
            );

            setRightMonth(
                new Date(
                    current.getFullYear(),
                    current.getMonth() + 1,
                    1,
                ),
            );

            /* Hide menu */
            setShowCalendar(true);

            setOpen(true);
        }
    };

    /* =====================================================
       CUSTOM DATE CLICK
    ===================================================== */

    const handleDateClick = (
        date: Date,
    ) => {
        /* ================================================
           FIRST DATE
        ================================================= */

        if (
            !tempRange.from ||
            tempRange.to
        ) {
            setTempRange({
                from: date,
                to: undefined,
            });

            setHoverDate(
                undefined,
            );

            return;
        }

        /* ================================================
           SECOND DATE
        ================================================= */

        let from =
            tempRange.from;

        let to = date;

        /* If second date is before first */
        if (
            date.getTime() <
            from.getTime()
        ) {
            from = date;
            to = tempRange.from;
        }

        setTempRange({
            from,
            to,
        });

        setHoverDate(
            undefined,
        );
    };

    /* =====================================================
       HOVER DATE
    ===================================================== */

    const handleDayMouseEnter = (
        date: Date,
    ) => {
        if (
            tempRange.from &&
            !tempRange.to
        ) {
            setHoverDate(date);
        }
    };

    /* =====================================================
       PREVIEW RANGE
    ===================================================== */

    const previewRange =
        tempRange.from &&
            !tempRange.to &&
            hoverDate
            ? {
                from:
                    hoverDate <
                        tempRange.from
                        ? hoverDate
                        : tempRange.from,

                to:
                    hoverDate <
                        tempRange.from
                        ? tempRange.from
                        : hoverDate,
            }
            : tempRange;

    /* =====================================================
       APPLY CUSTOM RANGE
    ===================================================== */

    const handleApplyCustomRange =
        () => {
            if (
                !tempRange.from ||
                !tempRange.to
            ) {
                return;
            }

            const range: DateRange = {
                startDate:
                    startOfDay(
                        tempRange.from,
                    ),

                endDate:
                    endOfDay(
                        tempRange.to,
                    ),
            };

            setStartDate(
                range.startDate,
            );

            setEndDate(
                range.endDate,
            );

            setActivePreset(
                "custom",
            );

            /* Parent update only on Apply */
            onChange(range);

            setHoverDate(
                undefined,
            );

            setShowCalendar(false);
            setOpen(false);
        };

    /* =====================================================
       CANCEL CUSTOM
    ===================================================== */

    const handleCancel = () => {
        setTempRange({
            from: undefined,
            to: undefined,
        });

        setHoverDate(
            undefined,
        );

        setShowCalendar(false);
        setOpen(true);
    };

    /* =====================================================
       PREVIOUS MONTH
    ===================================================== */

    const handlePreviousMonth =
        () => {
            const newLeftMonth =
                new Date(
                    leftMonth.getFullYear(),
                    leftMonth.getMonth() - 1,
                    1,
                );

            const newRightMonth =
                new Date(
                    newLeftMonth.getFullYear(),
                    newLeftMonth.getMonth() + 1,
                    1,
                );

            setLeftMonth(
                newLeftMonth,
            );

            setRightMonth(
                newRightMonth,
            );
        };

    /* =====================================================
       NEXT MONTH
    ===================================================== */

    const handleNextMonth =
        () => {
            const newLeftMonth =
                new Date(
                    leftMonth.getFullYear(),
                    leftMonth.getMonth() + 1,
                    1,
                );

            const newRightMonth =
                new Date(
                    newLeftMonth.getFullYear(),
                    newLeftMonth.getMonth() + 1,
                    1,
                );

            setLeftMonth(
                newLeftMonth,
            );

            setRightMonth(
                newRightMonth,
            );
        };

    /* =====================================================
       CALENDAR CLASS
    ===================================================== */

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

    /* =====================================================
       OPEN / CLOSE
    ===================================================== */

    const handleOpen = () => {
        if (open) {
            setOpen(false);
            setShowCalendar(false);
            return;
        }

        /* Every fresh click opens menu */
        setShowCalendar(false);
        setOpen(true);
    };

    /* =====================================================
       DISPLAY VALUE
    ===================================================== */

    const displayValue = (() => {
        /* ================================================
           TODAY
        ================================================= */

        if (
            activePreset === "today" &&
            startDate
        ) {
            return formatDate(
                startDate,
            );
        }

        /* ================================================
           RANGE
        ================================================= */

        if (
            startDate &&
            endDate
        ) {
            return `${formatDate(
                startDate,
            )} - ${formatDate(
                endDate,
            )}`;
        }

        /* ================================================
           ONLY START
        ================================================= */

        if (startDate) {
            return `${formatDate(
                startDate,
            )} -`;
        }

        return placeholder;
    })();

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            ref={wrapperRef}
            className={`relative w-full ${className}`}
        >
            {/* =================================================
                TRIGGER
            ================================================= */}

            <button
                type="button"
                onClick={handleOpen}
                className="
                    flex
                    min-w-[200px]
                    h-9
                    w-full
                    items-center
                    justify-between
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    transition
                    hover:border-gray-300
                "
            >
                <div className="flex items-center gap-2">
                    <CalendarDays
                        size={18}
                        className="text-gray-500"
                    />

                    <span
                        className={`
                            text-sm
                            ${startDate
                                ? "text-gray-800"
                                : "text-gray-400"
                            }
                        `}
                    >
                        {displayValue}
                    </span>
                </div>

                <ChevronDown
                    size={18}
                    className={`
                        text-gray-400
                        transition
                        ${open
                            ? "rotate-180"
                            : ""
                        }
                    `}
                />
            </button>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            {open && (
                <div
                    className="
                        absolute
                        right-0
                        top-[calc(100%+8px)]
                        z-[9999]
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#039A63]
                        bg-white
                       
                    "
                >
                    {/* =================================================
                        PRESET MENU
                    ================================================= */}

                    {!showCalendar && (
                        <div className="w-[240px] p-3">
                            <p
                                className="
                                    mb-2
                                    px-2
                                    text-xs
                                    font-semibold
                                    text-gray-400
                                "
                            >
                                তারিখের পরিসর
                            </p>

                            <div className="space-y-1">
                                {presets.map(
                                    (
                                        preset,
                                    ) => (
                                        <button
                                            key={
                                                preset.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                handlePreset(
                                                    preset.value,
                                                )
                                            }
                                            className={`
                                                w-full
                                                rounded-lg
                                                px-3
                                                py-1.5
                                                text-left
                                                text-sm
                                                transition
                                                ${activePreset ===
                                                    preset.value
                                                    ? "bg-[#E8F5F0] font-medium text-[#006A4E]"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }
                                            `}
                                        >
                                            {
                                                preset.label
                                            }
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        CUSTOM CALENDAR
                    ================================================= */}

                    {showCalendar && (
                        <div className="bg-white p-2">
                            <div className="flex gap-2">
                                {/* =====================================
                                    LEFT CALENDAR
                                ===================================== */}

                                <Calendar
                                    mode="range"
                                    selected={
                                        previewRange as any
                                    }
                                    onSelect={() => { }}
                                    onDayClick={
                                        handleDateClick
                                    }
                                    onDayMouseEnter={
                                        handleDayMouseEnter
                                    }
                                    month={
                                        leftMonth
                                    }
                                    onMonthChange={(
                                        month,
                                    ) => {
                                        setLeftMonth(
                                            month,
                                        );

                                        setRightMonth(
                                            new Date(
                                                month.getFullYear(),
                                                month.getMonth() +
                                                1,
                                                1,
                                            ),
                                        );
                                    }}
                                    classNames={
                                        calendarClassNames
                                    }
                                />

                                {/* =====================================
                                    RIGHT CALENDAR
                                ===================================== */}

                                <Calendar
                                    mode="range"
                                    selected={
                                        previewRange as any
                                    }
                                    onSelect={() => { }}
                                    onDayClick={
                                        handleDateClick
                                    }
                                    onDayMouseEnter={
                                        handleDayMouseEnter
                                    }
                                    month={
                                        rightMonth
                                    }
                                    onMonthChange={(
                                        month,
                                    ) => {
                                        setRightMonth(
                                            month,
                                        );

                                        setLeftMonth(
                                            new Date(
                                                month.getFullYear(),
                                                month.getMonth() -
                                                1,
                                                1,
                                            ),
                                        );
                                    }}
                                    classNames={
                                        calendarClassNames
                                    }
                                />
                            </div>

                            {/* =================================================
                                BOTTOM
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    border-t
                                    border-gray-100
                                    pt-2
                                "
                            >
                                {/* CANCEL */}

                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    className="
                                        mr-2
                                        rounded-md
                                        px-3
                                        py-1
                                        text-xs
                                        text-gray-500
                                        transition
                                        hover:bg-gray-100
                                    "
                                >
                                    বাতিল
                                </button>

                                {/* APPLY */}

                                <button
                                    type="button"
                                    disabled={
                                        !tempRange.from ||
                                        !tempRange.to
                                    }
                                    onClick={
                                        handleApplyCustomRange
                                    }
                                    className="
                                        rounded-md
                                        bg-[#006A4E]
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-[#00563F]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}