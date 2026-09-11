"use client";

import { useLoadUnloadReportQuery } from "@/redux/features/report,features";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    BrickWall,
    Factory,
    Package,
    Warehouse,
} from "lucide-react";

type TLoadUnloadHistory = {
    movement: {
        load: {
            rawEntry: number;
            fieldToChulli: number;
            stockToChulli: number;
            chulliToFinished: number;
            fieldToStock: number;
        };
        unload: {
            rawToField: number;
            fieldToChulli: number;
            stockToChulli: number;
            chulliToFinished: number;
            fieldToStock: number;
        };
    };
    stock: {
        rawBrick: number;
        field: number;
        stock: number;
        chulli: number;
        finished: number;
    };
    damaged: number;
    finished?: {
        good: number;
        damaged: number;
        total: number;
    };
};

const LoadUnloadHistory = () => {
    const { data, isLoading } = useLoadUnloadReportQuery(undefined);

    const report = data?.data as TLoadUnloadHistory;

    const formatNumber = (value?: number) =>
        new Intl.NumberFormat("bn-BD").format(value ?? 0);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="mb-4">
                        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="h-32 animate-pulse rounded-xl border bg-white"
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="h-80 animate-pulse rounded-xl border bg-white" />
                    <div className="h-80 animate-pulse rounded-xl border bg-white" />
                </div>
            </div>
        );
    }

    const stockCards = [
        {
            title: "কাঁচা ইট",
            value: report?.stock?.rawBrick,
            icon: BrickWall,
        },
        {
            title: "মাঠে থাকা ইট",
            value: report?.stock?.field,
            icon: Package,
        },
        {
            title: "বর্তমান স্টক",
            value: report?.stock?.stock,
            icon: Warehouse,
        },
        {
            title: "চুল্লিতে থাকা ইট",
            value: report?.stock?.chulli,
            icon: Factory,
        },
        {
            title: "পাকা ইট",
            value: report?.stock?.finished,
            icon: BrickWall,
        },
    ];

    const loadRows = [
        {
            title: "কাঁচা ইট এন্ট্রি",
            value: report?.movement?.load?.rawEntry,
        },
        {
            title: "মাঠ থেকে চুল্লিতে",
            value: report?.movement?.load?.fieldToChulli,
        },
        {
            title: "স্টক থেকে চুল্লিতে",
            value: report?.movement?.load?.stockToChulli,
        },
        {
            title: "চুল্লি থেকে পাকা ইট",
            value: report?.movement?.load?.chulliToFinished,
        },
        {
            title: "মাঠ থেকে স্টকে",
            value: report?.movement?.load?.fieldToStock,
        },
    ];

    const unloadRows = [
        {
            title: "কাঁচা ইট থেকে মাঠে",
            value: report?.movement?.unload?.rawToField,
        },
        {
            title: "মাঠ থেকে চুল্লিতে",
            value: report?.movement?.unload?.fieldToChulli,
        },
        {
            title: "স্টক থেকে চুল্লিতে",
            value: report?.movement?.unload?.stockToChulli,
        },
        {
            title: "চুল্লি থেকে পাকা ইট",
            value: report?.movement?.unload?.chulliToFinished,
        },
        {
            title: "মাঠ থেকে স্টকে",
            value: report?.movement?.unload?.fieldToStock,
        },
    ];

    const totalUnload =
        (report?.movement?.unload?.rawToField ?? 0) +
        (report?.movement?.unload?.fieldToChulli ?? 0) +
        (report?.movement?.unload?.stockToChulli ?? 0) +
        (report?.movement?.unload?.chulliToFinished ?? 0) +
        (report?.movement?.unload?.fieldToStock ?? 0);

    return (
        <div className="space-y-6">
            <div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        বর্তমান ইটের মজুদ
                    </h2>

                    <p className="text-sm text-gray-500">
                        বিভিন্ন স্থানে বর্তমানে থাকা ইটের পরিমাণ
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {stockCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {card.title}
                                        </p>

                                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                            {formatNumber(card.value)}
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-400">
                                            টি ইট
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                                        <Icon className="h-5 w-5 text-gray-700" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                <ArrowUpFromLine className="h-5 w-5 text-gray-700" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    লোডের হিসাব
                                </h3>

                                <p className="text-sm text-gray-500">
                                    বিভিন্ন ধরনের লোডের পরিমাণ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y">
                        {loadRows.map((row) => (
                            <SummaryRow
                                key={row.title}
                                title={row.title}
                                value={row.value}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                            মোট লোড
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                            {formatNumber(
                                Object.values(
                                    report?.movement?.load ?? {}
                                ).reduce(
                                    (sum, value) => sum + (value ?? 0),
                                    0
                                )
                            )}{" "}
                            টি
                        </span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                <ArrowDownToLine className="h-5 w-5 text-gray-700" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    আনলোডের হিসাব
                                </h3>

                                <p className="text-sm text-gray-500">
                                    সম্পন্ন হওয়া বিভিন্ন আনলোডের পরিমাণ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y">
                        {unloadRows.map((row) => (
                            <SummaryRow
                                key={row.title}
                                title={row.title}
                                value={row.value}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                            মোট আনলোড
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                            {formatNumber(totalUnload)} টি
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                মোট আনলোড
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {formatNumber(totalUnload)}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                টি ইট
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                            <ArrowDownToLine className="h-6 w-6 text-gray-700" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                নষ্ট / ক্ষতিগ্রস্ত ইট
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-red-600">
                                {formatNumber(report?.damaged)}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                টি ইট
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                            <BrickWall className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryRow = ({
    title,
    value,
}: {
    title: string;
    value?: number;
}) => {
    return (
        <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-medium text-gray-700">
                {title}
            </span>

            <div className="text-right">
                <span className="font-semibold text-gray-900">
                    {new Intl.NumberFormat("bn-BD").format(value ?? 0)}
                </span>

                <span className="ml-1 text-xs text-gray-400">
                    টি
                </span>
            </div>
        </div>
    );
};

export default LoadUnloadHistory;