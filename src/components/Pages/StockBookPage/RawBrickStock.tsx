"use client";

import { useLoadUnloadReportQuery } from "@/redux/features/report,features";
import {
    BrickWall,
    Flame,
    Package,
    Warehouse,
} from "lucide-react";

export interface TRawBrickStock {
    id: string;
    vataId: string;
    rawBrick: number;
    fieldBrick: number;
    stockBrick: number;
    chulliBrick: number;
    createdAt: string;
    updatedAt: string;
}

const RawBrickStock = () => {
    const { data, isLoading } = useLoadUnloadReportQuery(undefined);

    const report = data?.data as TRawBrickStock | undefined;

    const rawBrick = Number(report?.rawBrick ?? 0);
    const fieldBrick = Number(report?.fieldBrick ?? 0);
    const stockBrick = Number(report?.stockBrick ?? 0);
    const chulliBrick = Number(report?.chulliBrick ?? 0);

    const totalRawBrick =
        rawBrick + fieldBrick + stockBrick + chulliBrick;

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat("bn-BD").format(value);
    };

    const stockItems = [
        {
            title: "কাঁচা ইট",
            value: rawBrick,
            icon: BrickWall,
        },
        {
            title: "মাঠে",
            value: fieldBrick,
            icon: Package,
        },
        {
            title: "স্টকে",
            value: stockBrick,
            icon: Warehouse,
        },
        {
            title: "চুল্লিতে",
            value: chulliBrick,
            icon: Flame,
        },
    ];

    if (isLoading) {
        return (
            <div className="w-full rounded-xl border border-gray-200 bg-white p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 w-32 rounded bg-gray-200" />

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="flex items-center justify-between"
                        >
                            <div className="h-8 w-28 rounded bg-gray-200" />
                            <div className="h-4 w-12 rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-emerald-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-emerald-600 px-4 py-2">
                <div>
                    <h2 className="text-base font-semibold text-white">
                        কাঁচা ইটের স্টক
                    </h2>

                    <p className="mt-0.5 text-[11px] text-emerald-100">
                        বর্তমান ইটের হিসাব
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[10px] text-emerald-100">
                        মোট
                    </p>

                    <p className="text-lg font-bold leading-5 text-white">
                        {formatNumber(totalRawBrick)}
                    </p>
                </div>
            </div>

            {/* Stock List */}
            <div className="divide-y divide-gray-100">
                {stockItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="flex items-center justify-between px-4 py-1.5"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50">
                                    <Icon className="h-4 w-4 text-emerald-600" />
                                </div>

                                <span className="text-[13px] font-medium text-gray-700">
                                    {item.title}
                                </span>
                            </div>

                            <span className="text-[13px] font-medium text-gray-900">
                                {formatNumber(item.value)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-emerald-50 px-4 py-2.5">
                <span className="text-[13px] font-medium text-emerald-800">
                    সর্বমোট ইট
                </span>

                <span className="text-base font-bold text-emerald-600">
                    {formatNumber(totalRawBrick)}
                </span>
            </div>
        </div>
    );
};

export default RawBrickStock;