
"use client";

import React, { useMemo, useRef, useState } from "react";
import { FileText } from "lucide-react";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";

import { useGetAllLedgerDetailsQuery } from "@/redux/features/ledger.features";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";

import { TPaymentResponse } from "@/interface/payment";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import CommonPrint, {
    TCommonPrintRef,
} from "@/components/Reusable/CommonPrint";
import { TablePagination } from "@/components/Reusable/TablePagination";

import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";

import LedgerDetailsPrint from "@/components/PrintComponent/LedgerDetailsPrint";

import { SERVER_ERROR_MESSAGE } from "@/constant";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatDateRange } from "@/utils/formatDateRange";
import renderImage from "@/utils/renderImage";

import VataHeader from "./VataHeader";
import LedgerUserInformation from "./LedgerUserInformation";

type TPaymentFilter =
    | "সব"
    | "রেগুলার পেমেন্ট"
    | "বাকি পেমেন্ট"
    | "অগ্রিম পেমেন্ট";

const paymentFilters: {
    label: string;
    value: TPaymentFilter;
}[] = [
        { label: "সব", value: "সব" },
        { label: "রেগুলার পেমেন্ট", value: "রেগুলার পেমেন্ট" },
        { label: "বাকি পেমেন্ট", value: "বাকি পেমেন্ট" },
        { label: "অগ্রিম পেমেন্ট", value: "অগ্রিম পেমেন্ট" },
    ];

const paymentTypes: Record<Exclude<TPaymentFilter, "সব">, string> = {
    "রেগুলার পেমেন্ট": "রেগুলার পেমেন্ট",
    "বাকি পেমেন্ট": "বাকি পেমেন্ট",
    "অগ্রিম পেমেন্ট": "অগ্রিম পেমেন্ট",
};

const LedgerDetailsPage = ({
    id,
    params,
}: {
    id: string;
    params: TQuery;
}) => {
    const printRef = useRef<TCommonPrintRef>(null);

    const { data: vata } = useGetVataInfoQuery(undefined);

    const [paymentFilter, setPaymentFilter] =
        useState<TPaymentFilter>("সব");

    const [filterDate, setDateFiter] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: new Date(),
        endDate: null,
    });

    const formatDate = formatDateRange({
        start: filterDate.startDate,
        end: filterDate.endDate,
    });

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetAllLedgerDetailsQuery(
        { id, params, date: formatDate, search: paymentFilter },
        { refetchOnMountOrArgChange: true }
    );

    const payments =
        (data?.data?.data?.data as TPaymentResponse[]) ?? [];

    const ledger = data?.data?.data?.ledger;

    const meta = data?.data?.meta as TMetaConfig;

    // Filter payments
    const filteredPayments = useMemo(() => {
        if (paymentFilter === "সব") {
            return payments;
        }

        return payments.filter(
            (payment) =>
                payment.paymentType === paymentTypes[paymentFilter]
        );
    }, [payments, paymentFilter]);

    // Opening balance
    const openingBalance = Number(ledger?.openingBalance ?? 0);

    const openingBalanceType = ledger?.openingBalanceType ?? "";

    // পাওনা হলে Positive, দেনা হলে Negative
    const signedOpeningBalance =
        openingBalanceType === "দেনা"
            ? -openingBalance
            : openingBalance;

    // Advance payment
    const ogrimPayment = filteredPayments
        .filter((p) => p.paymentType === "অগ্রিম পেমেন্ট")
        .reduce((sum, p) => sum + Number(p.payment || 0), 0);

    // Due payment
    const bakiPayment = filteredPayments
        .filter((p) => p.paymentType === "বাকি পেমেন্ট")
        .reduce((sum, p) => sum + Number(p.payment || 0), 0);

    // Regular payment
    const regularPayment = filteredPayments
        .filter((p) => p.paymentType === "রেগুলার পেমেন্ট")
        .reduce((sum, p) => sum + Number(p.payment || 0), 0);

    // Selected category total
    const totalPayment =
        ogrimPayment + bakiPayment + regularPayment;

    // Final balance
    const finalBalance = signedOpeningBalance + totalPayment;

    const balanceAmount = Math.abs(finalBalance);



    return (
        <>
            <VataHeader vata={vata?.data} />

            <div className="rounded-t-md  bg-white p-2 shadow-sm">
                <div className="flex flex-col gap-2">

                    {/* TOP ROW */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">

                        {/* LEFT */}
                        <div className="flex w-full items-center gap-2 md:w-auto md:flex-1">
                            <Link
                                href="/dashboard/ledger"
                                className="w-full md:w-auto"
                            >
                                <button
                                    type="button"
                                    className="flex h-[34px] w-full flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded bg-[#039A63] px-4 text-[14px] font-normal text-white shadow-sm transition-colors hover:bg-[#028453] lg:w-max"
                                >
                                    <FileText size={16} strokeWidth={2} />
                                    খতিয়ান
                                </button>
                            </Link>

                            <button
                                type="button"
                                className="flex h-[34px]  cursor-pointer items-center justify-center gap-1.5 truncate rounded border border-[#039A63] bg-[#F7FFFC] px-4 text-[14px] font-normal text-[#039A63] transition-colors hover:bg-[#E9FFF5]"
                            >
                                <FileText size={16} strokeWidth={2} />
                                <span>
                                    {ledger?.name}
                                </span>
                            </button>
                        </div>

                        {/* FILTER + PRINT */}
                        <div className="flex w-full items-center gap-2 md:w-auto">
                            <div className="w-full flex-1 md:w-[250px]">
                                <CustomDateFilter
                                    value={filterDate}
                                    onChange={setDateFiter}
                                    placeholder="তারিখ ফিল্টার করুন"
                                    className="w-full"
                                />
                            </div>

                            <CustomPrintButton
                                onClick={() =>
                                    printRef.current?.print()
                                }
                                className="w-max shrink-0"
                            />
                        </div>
                    </div>

                    {/* LEDGER INFORMATION + SUMMARY */}
                    <div className="my-2 grid grid-cols-1 gap-4 lg:grid-cols-2">

                        <LedgerUserInformation ledger={ledger} />

                        {/* PAYMENT SUMMARY */}
                        <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
                            <h3 className="mb-3 text-base font-semibold text-gray-800">
                                চূড়ান্ত দেনা-পাওনা হিসাব
                            </h3>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-600">
                                        প্রারম্ভিক ব্যালেন্স ({openingBalanceType || "-"})
                                    </span>

                                    <span className="font-medium text-blue-600">
                                        ৳ {toBanglaNumber(signedOpeningBalance)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-600">
                                        রেগুলার পেমেন্ট
                                    </span>

                                    <span className="font-medium text-green-600">
                                        ৳ {toBanglaNumber(regularPayment)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-600">
                                        অগ্রিম পেমেন্ট
                                    </span>

                                    <span className="font-medium text-orange-600">
                                        ৳ {toBanglaNumber(ogrimPayment)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-600">
                                        বাকি পেমেন্ট
                                    </span>

                                    <span className="font-medium text-violet-600">
                                        ৳ {toBanglaNumber(bakiPayment)}
                                    </span>
                                </div>

                                {/* TOTAL PAYMENT */}
                                <div className="flex justify-between gap-3 border-t border-dashed border-gray-300 pt-3">
                                    <span className="font-semibold text-gray-800">
                                        মোট পেমেন্ট
                                    </span>

                                    <span className="text-base font-bold ">
                                        ৳ {toBanglaNumber(balanceAmount)}
                                    </span>
                                </div>

                                {/* FINAL BALANCE */}
                                {/* <div className="flex items-center justify-between gap-3 rounded bg-gray-50 px-3 py-2">
                                    <span className="font-semibold text-gray-800">
                                        চূড়ান্ত ব্যালেন্স ({balanceLabel})
                                    </span>

                                    <span
                                        className={`text-lg font-bold ${finalBalance < 0
                                            ? "text-red-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        ৳ {toBanglaNumber(balanceAmount)}
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT TABLE */}


            <div className="flex flex-wrap items-center gap-2 py-2 bg-white px-5">
                {paymentFilters.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                            setPaymentFilter(item.value)
                        }
                        className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${paymentFilter === item.value
                            ? "border-[#039A63] bg-[#039A63] text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-[#039A63] hover:text-[#039A63]"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>


            <div className="overflow-x-auto bg-white">
                <table className="min-w-full border-t text-center">
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
                                <td colSpan={11}>
                                    <CustomStatus
                                        type="error"
                                        description={SERVER_ERROR_MESSAGE}
                                    />
                                </td>
                            </tr>
                        ) : !filteredPayments.length ? (
                            <tr>
                                <td colSpan={11}>
                                    <CustomStatus
                                        type="error"
                                        description="এই ক্যাটাগরিতে কোনো পেমেন্ট পাওয়া যায়নি"
                                    />
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((row) => (
                                <React.Fragment key={row.id}>
                                    <tr className="h-[40px] hover:bg-gray-50">

                                        <TableData
                                            td={formatBanglaDate({
                                                date: row?.paymentDate,
                                            })}
                                        />

                                        <TableData
                                            td={row?.paymentDetails as string}
                                        />

                                        <TableData
                                            td={row?.paymentType}
                                        />

                                        <TableData
                                            td={row?.quantity || "0"}
                                        />

                                        <TableData
                                            td={`৳ ${row?.rate || "0"}`}
                                        />

                                        <TableData
                                            td={`৳ ${row?.totalBill || "0"}`}
                                        />

                                        <TableData
                                            td={
                                                row?.paymentType === "অগ্রিম পেমেন্ট"
                                                    ? `৳ ${row?.payment || "0"}`
                                                    : "৳ 0"
                                            }
                                            cls="border p-2 text-red-500"
                                        />

                                        <TableData
                                            cls="border p-2 text-green-600"
                                            td={`৳ ${row?.cutting || "0"}`}
                                        />

                                        <TableData
                                            cls="border p-2 text-green-600"
                                            td={`৳ ${row?.payment || "0"}`}
                                        />

                                        <TableData
                                            cls={`border p-2 ${row?.paymentDifference < 0
                                                ? "text-red-500"
                                                : row?.paymentDifference > 0
                                                    ? "text-green-600"
                                                    : "text-gray-600"
                                                }`}
                                            td={`৳ ${row?.paymentDifference || "0"}`}
                                        />

                                        <td className="whitespace-nowrap border p-1 text-center text-sm text-green-600 lg:p-2 lg:text-[15px]">
                                            {row?.document ? (
                                                <Link
                                                    href={renderImage(row.document)}
                                                    target="_blank"
                                                >
                                                    <IoDocumentTextOutline size={18} />
                                                </Link>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={filteredPayments.length}
                title="পেমেন্ট"
            />

            {/* PRINT */}
            <CommonPrint
                ref={printRef}
                title="ledgers"
            >
                <LedgerDetailsPrint
                    payments={payments}
                    ledger={ledger}
                    vataInformation={vata?.data}
                    startDate={filterDate.startDate}
                    endDate={filterDate.endDate}
                    paymentType={paymentFilter}
                />
            </CommonPrint>
        </>
    );
};

export default LedgerDetailsPage;
