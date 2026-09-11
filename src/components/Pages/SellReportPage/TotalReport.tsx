"use client";

import { useMemo, useState } from "react";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";

type TAreaSale = {
    rank: number;
    area: string;
    totalCustomer: number;
    totalChallan: number;
    totalQuantity: number;
    totalSales: number;
};

interface Props {
    data: TAreaSale[];
}

const formatNumber = (value: number) => {
    return new Intl.NumberFormat("bn-BD").format(value);
};

const TotalReport = ({ data }: Props) => {
    const [search, setSearch] = useState("");

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredData = useMemo(() => {
        if (!search.trim()) {
            return data;
        }

        return data.filter((item) =>
            item?.area
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [data, search]);

    // =====================================================
    // TOTAL
    // =====================================================

    const totalCustomer = data.reduce(
        (sum, item) =>
            sum + Number(item?.totalCustomer || 0),
        0
    );

    const totalChallan = data.reduce(
        (sum, item) =>
            sum + Number(item?.totalChallan || 0),
        0
    );

    const totalQuantity = data.reduce(
        (sum, item) =>
            sum + Number(item?.totalQuantity || 0),
        0
    );

    const totalSales = data.reduce(
        (sum, item) =>
            sum + Number(item?.totalSales || 0),
        0
    );

    return (
        <div className="space-y-5 mt-8">

            {/* =================================================
                TOTAL SUMMARY
            ================================================= */}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* TOTAL AREA */}

                <div className="rounded-lg border bg-white p-5 text-center shadow-sm">
                    <p className="text-xl font-semibold">
                        মোট এরিয়া
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-[#039A63]">
                        {formatNumber(data.length)}
                    </h2>
                </div>

                {/* TOTAL CUSTOMER */}

                <div className="rounded-lg border bg-white p-5 text-center shadow-sm">
                    <p className="text-xl font-semibold">
                        মোট কাস্টমার
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-[#039A63]">
                        {formatNumber(totalCustomer)}
                    </h2>
                </div>

                {/* TOTAL BRICKS */}

                <div className="rounded-lg border bg-white p-5 text-center shadow-sm">
                    <p className="text-xl font-semibold">
                        মোট ইট
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-[#039A63]">
                        {formatNumber(totalQuantity)}
                    </h2>
                </div>

                {/* TOTAL SALES */}

                <div className="rounded-lg border bg-white p-5 text-center shadow-sm">
                    <p className="text-xl font-semibold">
                        মোট বিক্রি
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-[#039A63]">
                        ৳ {formatNumber(totalSales)}
                    </h2>
                </div>

            </div>

            {/* =================================================
                TABLE CARD
            ================================================= */}

            <div className="rounded-md border bg-white shadow-sm pb-8">
                <div className="overflow-x-auto rounded-t-md">
                    <table className="min-w-full border-collapse">

                        <thead>
                            <tr className="bg-[#039A63] text-center text-white">

                                <TableHead th="#" />

                                <TableHead th="এরিয়া" />

                                <TableHead th="মোট কাস্টমার" />

                                <TableHead th="মোট চালান" />

                                <TableHead th="মোট ইট" />

                                <TableHead th="মোট টাকা" />

                            </tr>
                        </thead>

                        <tbody className="text-center">

                            {!filteredData?.length ? (

                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-8 text-gray-600"
                                    >
                                        কোনো ডাটা পাওয়া যায়নি
                                    </td>
                                </tr>

                            ) : (

                                filteredData.map(
                                    (
                                        row: TAreaSale,
                                        index: number
                                    ) => (

                                        <tr
                                            key={`${row?.area}-${index}`}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <TableData
                                                td={index + 1}
                                            />
                                            <TableData
                                                td={
                                                    row?.area ||
                                                    "N/A"
                                                }
                                            />
                                            <TableData
                                                td={formatNumber(
                                                    row?.totalCustomer || 0
                                                )}
                                            />
                                            <TableData
                                                td={formatNumber(
                                                    row?.totalChallan || 0
                                                )}
                                            />
                                            <TableData
                                                td={formatNumber(
                                                    row?.totalQuantity || 0
                                                )}
                                            />

                                            <TableData
                                                td={`৳ ${formatNumber(
                                                    row?.totalSales || 0
                                                )}`}
                                            />

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                        {/* =================================================
                            TOTAL ROW
                        ================================================= */}

                        {filteredData?.length > 0 && (
                            <tfoot>

                                <tr className="bg-gray-50 text-center font-semibold">

                                    <TableData td="মোট" />

                                    <TableData
                                        td={`${formatNumber(
                                            data.length
                                        )} টি এরিয়া`}
                                    />

                                    <TableData
                                        td={formatNumber(
                                            totalCustomer
                                        )}
                                    />

                                    <TableData
                                        td={formatNumber(
                                            totalChallan
                                        )}
                                    />

                                    <TableData
                                        td={formatNumber(
                                            totalQuantity
                                        )}
                                    />

                                    <TableData
                                        td={`৳ ${formatNumber(
                                            totalSales
                                        )}`}
                                    />

                                </tr>

                            </tfoot>
                        )}

                    </table>
                </div>
            </div>
        </div>
    );
};

export default TotalReport;