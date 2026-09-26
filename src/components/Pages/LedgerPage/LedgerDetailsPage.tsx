"use client";

import React, { useMemo, useRef, useState } from "react";
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
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { useRouter } from "next/navigation";
import renderImage from "@/utils/renderImage";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";
import { formatDateRange } from "@/utils/formatDateRange";
import LedgerDetailsPrint from "@/components/PrintComponent/LedgerDetailsPrint";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import CommonPrint, { TCommonPrintRef } from "@/components/Reusable/CommonPrint";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import VataHeader from "./VataHeader";
import LedgerUserInformation from "./LedgerUserInformation";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";

const LedgerDetailsPage = ({ id, params }: { id: string, params: TQuery }) => {
    const printRef = useRef<TCommonPrintRef>(null);
    const { data: vata } = useGetVataInfoQuery(undefined)
    const [filterDate, setDateFiter] = useState<{
        startDate: Date | null,
        endDate: Date | null,
    }>({
        startDate: new Date(),
        endDate: null,
    });

    const formatDate = formatDateRange({
        start: filterDate.startDate,
        end: filterDate.endDate
    })
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetAllLedgerDetailsQuery({ id, params, date: formatDate }, { refetchOnMountOrArgChange: true });
    const payments = data?.data?.data?.data as TPaymentResponse[] ?? [];
    const meta = data?.data?.meta as TMetaConfig
    const summary = data?.data?.data?.summary;
    return (

        <>
            <VataHeader vata={vata?.data} />
            <LedgerUserInformation ledger={data?.data?.data?.ledger} />
            <div className="bg-white border border-gray-200 rounded-t-md shadow-sm p-2">
                <div className="flex flex-col gap-2">

                    {/* TOP ROW */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2">

                        {/* LEFT */}
                        <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">

                            <Link
                                href="/dashboard/ledger"
                                className="w-full md:w-auto"
                            >
                                <button
                                    type="button"
                                    className="
                            w-full
                            lg:w-max
                            h-[34px]
                            px-4
                            rounded
                            bg-[#039A63]
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            text-[14px]
                            font-normal
                            shadow-sm
                            hover:bg-[#028453]
                            transition-colors
                            cursor-pointer
                            whitespace-nowrap
                            flex-1
                        "
                                >
                                    <FileText size={16} strokeWidth={2} />
                                    খতিয়ান
                                </button>
                            </Link>

                            <button
                                type="button"
                                className="
                        w-full
                        lg:w-max
                        h-[34px]
                        px-4
                        rounded
                        border
                        border-[#039A63]
                        bg-[#F7FFFC]
                        text-[#039A63]
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        text-[14px]
                        font-normal
                        hover:bg-[#E9FFF5]
                        transition-colors
                        cursor-pointer
                        truncate

                    "
                            >
                                <FileText size={16} strokeWidth={2} />

                                <span className="">
                                    {data?.data?.data?.ledger?.name}
                                </span>
                            </button>

                        </div>

                        {/* FILTER + PRINT */}
                        <div className="flex items-center gap-2 w-full md:w-auto">

                            <div className="flex-1 md:w-[250px]">
                                <CustomDateFilter
                                    value={filterDate}
                                    onChange={setDateFiter}
                                    placeholder="তারিখ ফিল্টার করুন"
                                    className="w-full"
                                />
                            </div>

                            <CustomPrintButton
                                onClick={() => printRef.current?.print()}
                                className="shrink-0 w-max"
                            />

                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">

                        {/* মোট পেমেন্ট */}
                        <div className="flex items-center justify-between gap-2 rounded border border-[#B5F1D5] bg-[#E9FFF5] px-2.5 py-1.5">
                            <span className="text-[13px] text-gray-600 whitespace-nowrap">
                                মোট পেমেন্ট
                            </span>
                            <span className="text-[13px] font-medium text-[#039A63] whitespace-nowrap">
                                ৳ {toBanglaNumber(summary?.totalPaymentAmount ?? 0)}
                            </span>
                        </div>

                        {/* বাকি পেমেন্ট */}
                        <div className="flex items-center justify-between gap-2 rounded border border-[#D8D2FF] bg-[#F5F3FF] px-2.5 py-1.5">
                            <span className="text-[13px] text-gray-600 whitespace-nowrap">
                                বাকি পেমেন্ট
                            </span>
                            <span className="text-[13px] font-medium text-[#4B35E8] whitespace-nowrap">
                                ৳ {toBanglaNumber(summary?.totalLoanPayment ?? 0)}
                            </span>
                        </div>

                        {/* পরিমাণ */}
                        <div className="flex items-center justify-between gap-2 rounded border border-[#FFD7A5] bg-[#FFF4E7] px-2.5 py-1.5">
                            <span className="text-[13px] text-gray-600 whitespace-nowrap">
                                পরিমাণ
                            </span>
                            <span className="text-[13px] font-medium text-[#FF8A00] whitespace-nowrap">
                                {toBanglaNumber(summary?.totalQuantity ?? 0)}
                            </span>
                        </div>

                        {/* মোট বিল */}
                        <div className="flex items-center justify-between gap-2 rounded border border-[#B5F1D5] bg-[#E9FFF5] px-2.5 py-1.5">
                            <span className="text-[13px] text-gray-600 whitespace-nowrap">
                                মোট বিল
                            </span>
                            <span className="text-[13px] font-medium text-[#039A63] whitespace-nowrap">
                                ৳ {toBanglaNumber(summary?.totalBill ?? 0)}
                            </span>
                        </div>

                        {/* অগ্রিম */}
                        <div className="flex items-center justify-between gap-2 rounded border border-[#FFD7A5] bg-[#FFF4E7] px-2.5 py-1.5">
                            <span className="text-[13px] text-gray-600 whitespace-nowrap">
                                অগ্রিম
                            </span>
                            <span className="text-[13px] font-medium text-[#FF8A00] whitespace-nowrap">
                                ৳ {toBanglaNumber(summary?.totalAdvance ?? 0)}
                            </span>
                        </div>

                        {/* অগ্রিম বাকি */}
                        <div className="flex items-center justify-between gap-2 rounded border border-[#FFD1D1] bg-[#FFF0F0] px-2.5 py-1.5">
                            <span className="text-[13px] text-gray-600 whitespace-nowrap">
                                অগ্রিম বাকি
                            </span>
                            <span className="text-[13px] font-medium text-[#FF480D] whitespace-nowrap">
                                ৳ {toBanglaNumber(summary?.totalAdvanceDue ?? 0)}
                            </span>
                        </div>

                    </div>

                </div>
            </div>
            <div className="overflow-x-auto  bg-white">
                <table className="min-w-full   text-center border-t">
                    <thead className="bg-[#039A63] text-white">
                        <tr>
                            <TableHead th="তারিখ" />
                            <TableHead th="পেমেন্টের বিবরণ" />
                            <TableHead th="পেমেন্টের ধরণ" />
                            <TableHead th="পরিমাণ" />
                            <TableHead th="রেট" />
                            <TableHead th="মোট বিল" />
                            <TableHead th="অগ্রিম" />
                            <TableHead th="কর্তন" />
                            <TableHead th="পেমেন্ট" />
                            <TableHead th="কম/বেশি" />
                            <TableHead th="ডক" />
                        </tr>
                    </thead>
                    <tbody>

                        {isLoading || isFetching ? (
                            <TableLazyLoading
                                smallColumns={11}
                                largeColumns={11}
                                rows={6}
                            />
                        ) : isError ? (
                            <tr>
                                <td colSpan={11} >
                                    <CustomStatus
                                        type="error"
                                        description={SERVER_ERROR_MESSAGE}
                                    />
                                </td>
                            </tr>
                        ) : !payments?.length ? (
                            <tr>
                                <td colSpan={11} >
                                    <CustomStatus
                                        type="error"
                                        description={data?.message}
                                    />
                                </td>
                            </tr>
                        ) : (payments?.map((row, index) => (
                            <React.Fragment key={row.id}>
                                <tr
                                    className="hover:bg-gray-50 h-[40]"
                                //   onClick={() => toggleRow(row.id)}
                                >
                                    <TableData td={formatBanglaDate({ date: row?.paymentDate })} />
                                    <TableData
                                        td={row?.paymentDetails as string}

                                    />
                                    <TableData
                                        td={row?.paymentType}

                                    />
                                    <TableData td={row?.quantity} />
                                    <TableData
                                        td={`৳ ${row?.rate}`}

                                    />
                                    <TableData
                                        td={`৳ ${row?.totalBill}`}

                                    />

                                    <TableData
                                        td={
                                            row?.paymentType === "অগ্রিম পেমেন্ট"
                                                ? `৳ ${row?.payment}`
                                                : "৳ 0"
                                        }
                                        cls="border p-2 text-red-500 "
                                    />
                                    <TableData
                                        cls="border p-2 text-green-600 "
                                        td={`৳ ${row?.cutting}`}
                                    />
                                    <TableData
                                        cls="border p-2 text-green-600"
                                        td={`৳ ${row?.payment}`}
                                    />
                                    <TableData
                                        cls={`border  p-2 ${row?.paymentDifference < 0
                                            ? "text-red-500"
                                            : row?.paymentDifference > 0
                                                ? "text-green-600"
                                                : "text-gray-600 "
                                            }`}
                                        td={`৳ ${row?.paymentDifference}`}
                                    />

                                    <td
                                        className={`border  p-1 lg:p-2 text-center whitespace-nowrap text-sm lg:text-[15px] text-green-600`}
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

            <CommonPrint
                ref={printRef}
                title="ledgers"
            >

                <LedgerDetailsPrint
                    payments={payments}
                    ledger={data?.data?.data?.ledger}
                    vataInformation={vata?.data}
                    startDate={filterDate.startDate}
                    endDate={filterDate.endDate}
                />
            </CommonPrint>

        </>

    );
};

export default LedgerDetailsPage;