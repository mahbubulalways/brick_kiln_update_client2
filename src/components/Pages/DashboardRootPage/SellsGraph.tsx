"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export interface TClassGraph {
    class: string;
    quantity: number;
}

interface ClassWiseSellChartProps {
    data: TClassGraph[];
}

const ClassWiseSellChart = ({ data }: ClassWiseSellChartProps) => {
    const chartData = [...data]
        .map((item) => ({
            class: item.class,
            quantity: Number(item.quantity) || 0,
        }))
        .sort((a, b) => b.quantity - a.quantity);

    const totalQuantity = chartData.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return (
        <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-bold text-slate-800">
                        শ্রেণিভিত্তিক বিক্রয়
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                        প্রতিটি শ্রেণির মোট বিক্রয়ের পরিমাণ
                    </p>
                </div>

                <div className="shrink-0 rounded-lg bg-[#039A63]/10 px-3 py-1.5 text-right">
                    <p className="text-[10px] text-slate-500">
                        মোট বিক্রয়
                    </p>

                    <p className="text-sm font-bold text-[#039A63]">
                        {totalQuantity.toLocaleString("bn-BD")} টি
                    </p>
                </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 ? (
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            {/* Class */}
                            <XAxis
                                dataKey="class"
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    fontSize: 12,
                                    fill: "#64748b",
                                }}
                                interval={0}
                            />

                            {/* Quantity */}
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={45}
                                tick={{
                                    fontSize: 11,
                                    fill: "#64748b",
                                }}
                                tickFormatter={(value) =>
                                    Number(value).toLocaleString("bn-BD")
                                }
                            />

                            {/* Tooltip */}
                            <Tooltip
                                cursor={{
                                    fill: "rgba(3, 154, 99, 0.06)",
                                }}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    backgroundColor: "#ffffff",
                                    boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.08)",
                                }}
                                labelStyle={{
                                    color: "#334155",
                                    fontWeight: 600,
                                    marginBottom: "4px",
                                }}
                                formatter={(value) => [
                                    `${Number(value).toLocaleString(
                                        "bn-BD",
                                    )} টি`,
                                    "বিক্রয়",
                                ]}
                                labelFormatter={(label) =>
                                    `শ্রেণি: ${label}`
                                }
                            />

                            {/* Bars */}
                            <Bar
                                dataKey="quantity"
                                fill="#039A63"
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                                name="বিক্রয়"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex h-[320px] items-center justify-center">
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-500">
                            কোনো বিক্রয় তথ্য পাওয়া যায়নি
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            বিক্রয় তথ্য পাওয়া গেলে এখানে চার্ট দেখা যাবে
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassWiseSellChart;