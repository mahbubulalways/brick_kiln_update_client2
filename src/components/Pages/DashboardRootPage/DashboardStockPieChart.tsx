"use client";

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import {
    BrickWall,
    Flame,
    Package,
    Warehouse,
} from "lucide-react";

export interface TDashboardStockPieChart {
    id: string;
    vataId: string;
    rawBrick: number;
    fieldBrick: number;
    stockBrick: number;
    chulliBrick: number;
    createdAt: string;
    updatedAt: string;
}

interface DashboardStockPieChartProps {
    report: TDashboardStockPieChart;
}

const DashboardStockPieChart = ({
    report,
}: DashboardStockPieChartProps) => {
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
            color: "#10B981",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
        },
        {
            title: "মাঠে",
            value: fieldBrick,
            icon: Package,
            color: "#3B82F6",
            bg: "bg-blue-50",
            text: "text-blue-600",
        },
        {
            title: "স্টকে",
            value: stockBrick,
            icon: Warehouse,
            color: "#8B5CF6",
            bg: "bg-violet-50",
            text: "text-violet-600",
        },
        {
            title: "চুল্লিতে",
            value: chulliBrick,
            icon: Flame,
            color: "#F59E0B",
            bg: "bg-amber-50",
            text: "text-amber-600",
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
                        বর্তমান ইটের অবস্থাভিত্তিক হিসাব
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

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
                {stockItems.map((item) => {
                    const percentage =
                        total > 0 ? (item.value / total) * 100 : 0;

                    const chartData = [
                        {
                            name: item.title,
                            value: item.value,
                        },
                        {
                            name: "অবশিষ্ট",
                            value: Math.max(total - item.value, 0),
                        },
                    ];

                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-xl border border-gray-100 bg-[#FAFFFC] p-3"
                        >
                            {/* Title */}
                            <div className="flex items-center gap-2.5">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${item.text}`}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-[13px] font-semibold text-gray-700">
                                        {item.title}
                                    </p>

                                    <p className="text-[10px] text-gray-400">
                                        মোটের {percentage.toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            {/* Donut Chart */}
                            <div className="relative mx-auto mt-2 h-[180px] w-full">
                                {total > 0 ? (
                                    <>
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={73}
                                                    startAngle={90}
                                                    endAngle={-270}
                                                    paddingAngle={1}
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                >
                                                    <Cell
                                                        fill={item.color}
                                                    />

                                                    <Cell
                                                        fill="#E5E7EB"
                                                    />
                                                </Pie>

                                                <Tooltip
                                                    formatter={(value) =>
                                                        `${formatNumber(
                                                            Number(value),
                                                        )} টি`
                                                    }
                                                    contentStyle={{
                                                        borderRadius: "8px",
                                                        border: "1px solid #E5E7EB",
                                                        backgroundColor:
                                                            "#ffffff",
                                                        fontSize: "11px",
                                                        boxShadow:
                                                            "0 4px 12px rgba(0,0,0,0.08)",
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        {/* Center Value */}
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-lg font-bold leading-5 text-gray-800">
                                                    {formatNumber(
                                                        item.value,
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[10px] text-gray-400">
                                                    টি
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-[11px] text-gray-400">
                                            কোনো তথ্য নেই
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Info */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                                <span className="text-[11px] text-gray-500">
                                    পরিমাণ
                                </span>

                                <span
                                    className={`text-[13px] font-bold ${item.text}`}
                                >
                                    {formatNumber(item.value)} টি
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-emerald-50 px-4 py-3">
                <span className="text-[13px] font-semibold text-emerald-800">
                    সর্বমোট ইট
                </span>

                <span className="text-base font-bold text-emerald-600">
                    {formatNumber(total)} টি
                </span>
            </div>
        </div>
    );
};

export default DashboardStockPieChart;