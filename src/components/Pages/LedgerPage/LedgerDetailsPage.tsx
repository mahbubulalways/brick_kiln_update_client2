"use client";

import React, { useMemo, useState } from "react";
import {
    FileText,
} from "lucide-react";
import { useGetAllLedgerDetailsQuery } from "@/redux/features/ledger.features";
import { TPaymentResponse } from "@/interface/payment";
import TableHead from "@/components/Reusable/TableHead";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import TableData from "@/components/Reusable/TableData";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import CustomDateRangePicker from "@/components/Reusable/CustomDateRangePicker";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { useRouter } from "next/navigation";
import renderImage from "@/utils/renderImage";

const LedgerDetailsPage = ({ id, params }: { id: string, params: TQuery }) => {
    const [dateRange, setDateRange] = useState("");
    const router = useRouter()
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error
    } = useGetAllLedgerDetailsQuery({ id, params, date: dateRange }, { refetchOnMountOrArgChange: true });
    const payments = data?.data?.data?.data as TPaymentResponse[] ?? [];

    const meta = data?.data?.meta as TMetaConfig;
    console.log(meta);
    // ========================================
    // SUMMARY
    // ========================================
    const totalAdvance = useMemo(() => {
        return payments.reduce((sum, row) => {
            if (row?.paymentType === "অগ্রিম পেমেন্ট") {
                return sum + Number(row?.payment || 0);
            }

            return sum;
        }, 0);
    }, [payments]);

    const totalPayment = useMemo(() => {
        return payments.reduce((sum, row) => {
            if (row?.paymentType !== "অগ্রিম পেমেন্ট") {
                return sum + Number(row?.payment || 0);
            }

            return sum;
        }, 0);
    }, []);

    const totalAdvanceDue = useMemo(() => {
        return payments.reduce((sum, row) => {
            if (row?.paymentType === "অগ্রিম পেমেন্ট") {
                const difference = Number(
                    row?.paymentDifference || 0
                );

                return sum + Math.max(difference, 0);
            }

            return sum;
        }, 0);
    }, [payments]);

    const totalDue = useMemo(() => {
        return payments.reduce((sum, row) => {
            const totalBill = Number(
                row?.totalBill || 0
            );

            const cutting = Number(
                row?.cutting || 0
            );

            const payment = Number(
                row?.payment || 0
            );

            const due =
                totalBill -
                cutting -
                payment;

            return sum + Math.max(due, 0);
        }, 0);
    }, [payments]);
    const totalQuantity = useMemo(() => {
        return payments.reduce((sum, row) => {
            return sum + Number(row?.quantity || 0);
        }, 0);
    }, [payments]);

    const totalBill = useMemo(() => {
        return payments.reduce((sum, row) => {
            return sum + Number(row?.totalBill || 0);
        }, 0);
    }, [payments]);

    const totalPaymentAmount = useMemo(() => {
        return payments.reduce((sum, row) => {
            return sum + Number(row?.payment || 0);
        }, 0);
    }, [payments]);

    // const totalCutting = useMemo(() => {
    //     return payments.reduce((sum, row) => {
    //         return sum + Number(row?.cutting || 0);
    //     }, 0);
    // }, [payments]);

    return (
        <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm">
            <div className="flex gap-2 items-center justify-between mb-2 flex-col w-full md:flex-row">

                {/* LEFT */}

                <div className="flex items-center gap-2 w-full">

                    {/* খতিয়ান */}

                    <Link href={`/dashboard/ledger`} className="w-full md:w-max">

                        <button

                            type="button"
                            className="
                            w-full
                flex-1
                py-1
                cursor-pointer
                px-4
                rounded
                bg-[#039A63]
                text-white
                flex
                items-center
                justify-center
                gap-2
                text-[14px]
                font-normal
                shadow-sm
                hover:bg-[#028453]
                transition-all
            "
                        >
                            <FileText
                                size={17}
                                strokeWidth={2}
                            />

                            খতিয়ান
                        </button>
                    </Link>
                    {/* লেজার নং */}

                    <button
                        type="button"
                        className="
                        w-full
                        md:w-max

                px-4
                py-1
                rounded
                border
                border-[#039A63]
                bg-white
                text-[#039A63]
                flex
                items-center
                justify-center
                gap-2
                text-[14px]
                font-normal
                hover:bg-[#F0FBF7]
                transition-all
            "
                    >
                        <FileText size={16} />

                        {data?.data?.data?.ledger}
                    </button>

                </div>


                <div className="flex w-full items-center justify-between gap-2">
                    {/* Summary */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2">
                            {/* মোট পেমেন্ট */}
                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#B5F1D5] bg-[#E9FFF5] px-3 py-1 text-[14px] font-normal text-[#039A63]">
                                <span>মোট পেমেন্ট:</span>
                                <span>৳ {toBanglaNumber(totalPaymentAmount)}</span>
                            </div>

                            {/* পরিমাণ */}
                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#FFD7A5] bg-[#FFF4E7] px-3 py-1 text-[14px] font-normal text-[#FF8A00]">
                                <span>পরিমাণ:</span>
                                <span>{toBanglaNumber(totalQuantity)}</span>
                            </div>

                            {/* মোট বিল */}
                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#B5F1D5] bg-[#E9FFF5] px-3 py-1 text-[14px] font-normal text-[#039A63]">
                                <span>মোট বিল:</span>
                                <span>৳ {toBanglaNumber(totalBill)}</span>
                            </div>

                            {/* অগ্রিম */}
                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#FFD7A5] bg-[#FFF4E7] px-3 py-1 text-[14px] font-normal text-[#FF8A00]">
                                <span>অগ্রিম:</span>
                                <span>৳ {toBanglaNumber(totalAdvance)}</span>
                            </div>

                            {/* অগ্রিম বাকি */}
                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#FFD1D1] bg-[#FFF0F0] px-3 py-1 text-[14px] font-normal text-[#FF480D]">
                                <span>অগ্রিম বাকি:</span>
                                <span>৳ {toBanglaNumber(totalAdvanceDue)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="w-full md:w-[280px] md:shrink-0">
                        <CustomDateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto pt-2">
                <table className="min-w-full   text-center border-t">
                    <thead className="bg-[#039A63] text-white">
                        <tr>
                            <TableHead th="তারিখ" />
                            <TableHead th="পেমেন্টের বিবরণ" />
                            <TableHead th="পেমেন্টের ধরণ" />
                            <TableHead th="পরিমাণ" />
                            <TableHead th="রেট" />
                            <TableHead th="মোট বিল" cls="hidden lg:table-cell" />
                            <TableHead th="অগ্রিম" cls="hidden lg:table-cell" />
                            <TableHead th="কর্তন" cls="hidden lg:table-cell" />
                            <TableHead th="পেমেন্ট" />
                            <TableHead th="কম/বেশি" cls="hidden lg:table-cell" />
                            <TableHead th="ডক" cls="hidden lg:table-cell" />
                        </tr>
                    </thead>
                    <tbody>

                        {isLoading || isFetching ? (
                            <tr>
                                <td colSpan={11}>
                                    <CustomLoader cls="h-[30vh]" />
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={11} className="py-8">{SERVER_ERROR_MESSAGE}</td>
                            </tr>
                        ) : !payments?.length ? (
                            <tr>
                                <td colSpan={11} className="py-8 text-gray-600">
                                    {data?.message}
                                </td>
                            </tr>
                        ) : (payments?.map((row, index) => (
                            <React.Fragment key={row.id}>
                                <tr
                                    className="hover:bg-gray-50"
                                //   onClick={() => toggleRow(row.id)}
                                >
                                    <TableData td={formatBanglaDate({ date: row?.paymentDate })} />
                                    <TableData
                                        td={row?.paymentDetails as string}
                                        cls="hidden lg:table-cell"
                                    />
                                    <TableData
                                        td={row?.paymentType}
                                        cls="hidden lg:table-cell"
                                    />
                                    <TableData td={row?.quantity} />
                                    <TableData
                                        td={`৳ ${row?.rate}`}
                                        cls="hidden lg:table-cell"
                                    />
                                    <TableData
                                        td={`৳ ${row?.totalBill}`}
                                        cls="hidden lg:table-cell"
                                    />

                                    <TableData
                                        td={
                                            row?.paymentType === "অগ্রিম পেমেন্ট"
                                                ? `৳ ${row?.payment}`
                                                : "৳ 0"
                                        }
                                        cls="border p-2 text-red-500 hidden lg:table-cell"
                                    />
                                    <TableData
                                        cls="border p-2 text-green-600 hidden lg:table-cell"
                                        td={`৳ ${row?.cutting}`}
                                    />
                                    <TableData
                                        cls="border p-2 text-green-600"
                                        td={`৳ ${row?.payment}`}
                                    />
                                    <TableData
                                        cls={`border hidden lg:table-cell p-2 ${row?.paymentDifference < 0
                                            ? "text-red-500"
                                            : row?.paymentDifference > 0
                                                ? "text-green-600"
                                                : "text-gray-600 "
                                            }`}
                                        td={`৳ ${row?.paymentDifference}`}
                                    />

                                    <td
                                        className={`border hidden lg:table-cell p-1 lg:p-2 text-center whitespace-nowrap text-sm lg:text-[15px] text-green-600`}
                                    >
                                        {
                                            row?.document ? <Link
                                                href={renderImage(row?.document)}
                                                target="_blank"
                                            >
                                                <IoDocumentTextOutline size={18} />
                                            </Link> : "-"
                                        }

                                    </td>

                                </tr>

                            </React.Fragment>
                        )))}

                    </tbody>
                </table>

            </div>
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={payments?.length}
                title="পেমেন্ট"
            />
        </div>
    );
};

export default LedgerDetailsPage;