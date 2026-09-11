"use client";

import { useGetSellReportQuery } from "@/redux/features/report,features";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import TotalReport from "./TotalReport";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";

export type TAreaSale = {
    rank: number;
    area: string;
    totalCustomer: number;
    totalChallan: number;
    totalQuantity: number;
    totalSales: number;
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat("bn-BD").format(value);
};

const MIN_CHART_VALUE = 50000;
const MAX_CHART_VALUE = 5000000;

const chartTicks = [
    50000,
    1000000,
    2000000,
    3000000,
    4000000,
    5000000,
];

const AreaTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: any[];
}) => {
    if (!active || !payload?.length) {
        return null;
    }

    const item = payload[0]?.payload as TAreaSale;

    if (!item) {
        return null;
    }

    return (
        <div className="pointer-events-none min-w-[250px] rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
            <div className="mb-3 border-b border-gray-200 pb-3">
                <p className="font-semibold text-gray-800">
                    📍 {item.area}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    র‍্যাংক #{item.rank}
                </p>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-6">
                    <span className="text-gray-500">
                        মোট কাস্টমার
                    </span>

                    <span className="font-semibold">
                        {formatNumber(
                            Number(item.totalCustomer || 0)
                        )}
                    </span>
                </div>

                <div className="flex justify-between gap-6">
                    <span className="text-gray-500">
                        মোট চালান
                    </span>

                    <span className="font-semibold">
                        {formatNumber(
                            Number(item.totalChallan || 0)
                        )}
                    </span>
                </div>

                <div className="flex justify-between gap-6">
                    <span className="text-gray-500">
                        মোট ইট
                    </span>

                    <span className="font-semibold">
                        {formatNumber(
                            Number(item.totalQuantity || 0)
                        )}
                    </span>
                </div>

                <div className="mt-2 flex justify-between gap-6 border-t border-gray-200 pt-3">
                    <span className="font-medium text-gray-600">
                        মোট টাকা
                    </span>

                    <span className="font-bold text-[#039A63]">
                        ৳{" "}
                        {formatNumber(
                            Number(item.totalSales || 0)
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

const SellReportPage = () => {
    const {
        data,
        isLoading,
        isError,
    } = useGetSellReportQuery(undefined);

    const areaReport: TAreaSale[] = data?.data ?? [];

    if (isLoading) {
        return (
            <CustomLoader cls="h-[70vh]"/>
        );
    }

    if (isError) {
        return (
           <CustomStatus type="error"/>
        );
    }

    if (!areaReport.length) {
        return (
              <CustomStatus type="empty"/>
        );
    }

    const chartData = areaReport.map((item) => ({
        ...item,
        chartQuantity: Math.min(
            Number(item.totalQuantity || 0),
            MAX_CHART_VALUE
        ),
        chartSales: Math.min(
            Number(item.totalSales || 0),
            MAX_CHART_VALUE
        ),
    }));

    return (
        <div className="w-full">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold text-[#039A63]">
                    এরিয়া অনুযায়ী বিক্রির রিপোর্ট
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    এলাকাভিত্তিক মোট ইট ও বিক্রয়ের পরিমাণ
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-gray-800">
                            সর্বোচ্চ বিক্রি হওয়া ১৫টি এরিয়া
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            মোট ইট
                        </p>
                    </div>

                    <div className="h-[500px] w-full overflow-hidden p-5">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 30,
                                    right: 20,
                                    left: 20,
                                    bottom: 70,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="area"
                                    interval={0}
                                    tick={{
                                        fontSize: 14,
                                    }}
                                    angle={-25}
                                    textAnchor="end"
                                    height={70}
                                />

                                <YAxis
                                    type="number"
                                    domain={[
                                        MIN_CHART_VALUE,
                                        MAX_CHART_VALUE,
                                    ]}
                                    ticks={chartTicks}
                                    allowDataOverflow={true}
                                    tick={{
                                        fontSize: 14,
                                    }}
                                    tickFormatter={(value) =>
                                        formatNumber(value)
                                    }
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "rgba(3, 154, 99, 0.05)",
                                    }}
                                    content={<AreaTooltip />}
                                />

                                <Bar
                                    dataKey="chartQuantity"
                                    name="মোট ইট"
                                    fill="#039A63"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    barSize={35}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-gray-800">
                            সর্বোচ্চ বিক্রি হওয়া ১৫টি এরিয়া
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            মোট টাকা
                        </p>
                    </div>

                    <div className="h-[500px] w-full overflow-hidden p-5">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 30,
                                    right: 20,
                                    left: 20,
                                    bottom: 70,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="area"
                                    interval={0}
                                    tick={{
                                        fontSize: 14,
                                    }}
                                    angle={-25}
                                    textAnchor="end"
                                    height={70}
                                />

                                <YAxis
                                    type="number"
                                    domain={[
                                        MIN_CHART_VALUE,
                                        MAX_CHART_VALUE,
                                    ]}
                                    ticks={chartTicks}
                                    allowDataOverflow={true}
                                    tick={{
                                        fontSize: 14,
                                    }}
                                    tickFormatter={(value) =>
                                        formatNumber(value)
                                    }
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "rgba(3, 154, 99, 0.05)",
                                    }}
                                    content={<AreaTooltip />}
                                />

                                <Bar
                                    dataKey="chartSales"
                                    name="মোট টাকা"
                                    fill="#039A63"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    barSize={35}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <TotalReport data={areaReport} />
            </div>
        </div>
    );
};

export default SellReportPage;