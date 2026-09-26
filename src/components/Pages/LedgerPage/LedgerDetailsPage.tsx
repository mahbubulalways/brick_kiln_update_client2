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
            <div className="bg-white p-2 rounded-t-md border border-gray-200 shadow-sm">
                <div className="flex gap-2 items-center justify-between mb-2 flex-col w-full md:flex-row">

                    {/* LEFT */}

                    <div className="flex items-center gap-2 w-full">
                        {/* <Link href={`/dashboard/ledger`} className="w-full md:w-max">

                            <button

                                type="button"
                                className="
                            w-full
                flex-1
                py-1.5
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
                        </Link> */}

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
                flex-wrap
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

                            {data?.data?.data?.ledger?.name}
                        </button>

                    </div>


                    <div className="hidden md:block">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#B5F1D5] bg-[#E9FFF5] px-3 py-1 text-[14px] font-normal text-[#039A63]">
                                <span>মোট পেমেন্ট:</span>
                                <span>
                                    ৳ {toBanglaNumber(summary?.totalPaymentAmount ?? 0)}
                                </span>
                            </div>
                            {/* <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#FFD1D1] bg-[#fbfff0] px-3 py-1 text-[14px] font-normal text-[#290dff]">
                                <span>বাকি পেমেন্ট:</span>
                                <span>
                                    ৳ {toBanglaNumber(summary?.totalLoanPayment ?? 0)}
                                </span>
                            </div> */}
                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#FFD7A5] bg-[#FFF4E7] px-3 py-1 text-[14px] font-normal text-[#FF8A00]">
                                <span>পরিমাণ:</span>
                                <span>
                                    {toBanglaNumber(summary?.totalQuantity ?? 0)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#B5F1D5] bg-[#E9FFF5] px-3 py-1 text-[14px] font-normal text-[#039A63]">
                                <span>মোট বিল:</span>
                                <span>
                                    ৳ {toBanglaNumber(summary?.totalBill ?? 0)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#FFD7A5] bg-[#FFF4E7] px-3 py-1 text-[14px] font-normal text-[#FF8A00]">
                                <span>অগ্রিম:</span>
                                <span>
                                    ৳ {toBanglaNumber(summary?.totalAdvance ?? 0)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 whitespace-nowrap rounded border border-[#FFD1D1] bg-[#FFF0F0] px-3 py-1 text-[14px] font-normal text-[#FF480D]">
                                <span>অগ্রিম বাকি:</span>
                                <span>
                                    ৳ {toBanglaNumber(summary?.totalAdvanceDue ?? 0)}
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="w-full md:w-[280px] md:shrink-0">
                        <CustomDateFilter
                            value={filterDate}
                            onChange={setDateFiter}
                            placeholder="তারিখ ফিল্টার করুন"
                            className="w-full lg:w-auto"
                        />
                    </div>

                    <CustomPrintButton
                        onClick={() => printRef.current?.print()}
                        className="shrink-0 w-max"
                    />
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