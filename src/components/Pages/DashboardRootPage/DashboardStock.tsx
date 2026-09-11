"use client";

import { BrickWall, Flame, Package, Warehouse } from "lucide-react";

export interface TDashboardStock {
    id: string;
    vataId: string;
    rawBrick: number;
    fieldBrick: number;
    stockBrick: number;
    chulliBrick: number;
    createdAt: string;
    updatedAt: string;
}

const DashboardStock = ({ report }: { report: TDashboardStock }) => {
    const rawBrick = Number(report?.rawBrick ?? 0);
    const fieldBrick = Number(report?.fieldBrick ?? 0);
    const stockBrick = Number(report?.stockBrick ?? 0);
    const chulliBrick = Number(report?.chulliBrick ?? 0);

    const total = rawBrick + fieldBrick + stockBrick + chulliBrick;

    const formatNumber = (value: number) =>
        new Intl.NumberFormat("bn-BD").format(value);

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

    return (
        <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-emerald-600 px-4 py-3">
                <div>
                    <h2 className="text-base font-semibold text-white">
                        ইটের স্টক
                    </h2>

                    <p className="mt-0.5 text-[11px] text-emerald-100">
                        বর্তমান ইটের হিসাব
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[10px] text-emerald-100">
                        সর্বমোট
                    </p>

                    <p className="text-lg font-bold leading-5 text-white">
                        {formatNumber(total)}
                    </p>
                </div>
            </div>

            {/* Stock List */}
            <div className="divide-y divide-gray-100 bg-[#F8FFFB]">
                {stockItems.map(({ title, value, icon: Icon }) => (
                    <div
                        key={title}
                        className="flex items-center justify-between px-4 py-2"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                                <Icon className="h-4 w-4 text-emerald-600" />
                            </div>

                            <span className="text-[13px] font-medium text-gray-700">
                                {title}
                            </span>
                        </div>

                        <span className="text-[13px] font-semibold text-gray-900">
                            {formatNumber(value)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-emerald-50 px-4 py-3">
                <span className="text-[13px] font-semibold text-emerald-800">
                    সর্বমোট ইট
                </span>

                <span className="text-base font-bold text-emerald-600">
                    {formatNumber(total)}
                </span>
            </div>
        </div>
    );
};

export default DashboardStock;