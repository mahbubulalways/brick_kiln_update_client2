"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
    useGetVatasSubscriptionPaymentHistoryQuery,
} from "@/redux/features/subscription_payment";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

const SoftwarePaymentHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;

    const {
        data,
        isLoading,
        isFetching,
    } = useGetVatasSubscriptionPaymentHistoryQuery(undefined);

    const payments = data?.data ?? [];

    const totalPages = Math.ceil(
        payments.length / itemsPerPage
    );

    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentPayments = payments.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const getPaymentMethod = (method: string) => {
        switch (method?.toLowerCase()) {
            case "bkash":
                return "বিকাশ";
            case "nagad":
                return "নগদ";
            case "rocket":
                return "রকেট";
            default:
                return method || "-";
        }
    };

    const getStatus = (status: string) => {
        switch (status) {
            case "PAID":
                return (
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        পরিশোধিত
                    </span>
                );

            case "PENDING":
                return (
                    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                        পেন্ডিং
                    </span>
                );

            case "REJECTED":
                return (
                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        বাতিল
                    </span>
                );

            default:
                return (
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {status || "-"}
                    </span>
                );
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <div className="w-full p-4">
            <div className="mb-5 rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">
                    সফটওয়্যার পেমেন্ট হিস্টোরি
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    আপনার সকল সাবস্ক্রিপশন পেমেন্টের তথ্য এখানে দেখতে পারবেন।
                </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1250px] text-left text-sm">
                        <thead className="bg-[#039A63] text-white">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    #
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    প্ল্যানের মূল্য
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    পরিশোধের পরিমাণ
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    পেমেন্ট মাধ্যম
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    ফোন নম্বর
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    Transaction ID
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    শুরু
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    শেষ
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    পেমেন্ট তারিখ
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    স্ট্যাটাস
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading || isFetching ? (
                                Array.from({ length: itemsPerPage }).map(
                                    (_, index) => (
                                        <tr key={index}>
                                            {Array.from({ length: 10 }).map(
                                                (_, cellIndex) => (
                                                    <td
                                                        key={cellIndex}
                                                        className="px-4 py-4"
                                                    >
                                                        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    )
                                )
                            ) : currentPayments.length > 0 ? (
                                currentPayments.map(
                                    (payment: any, index: number) => (
                                        <tr
                                            key={payment.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                                {toBanglaNumber(
                                                    startIndex + index + 1
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-800">
                                                ৳{" "}
                                                {toBanglaNumber(
                                                    Number(
                                                        payment.subscriptionPlan?.price || 0
                                                    )
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-800">
                                                ৳{" "}
                                                {toBanglaNumber(
                                                    Number(payment.amount || 0)
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                                {getPaymentMethod(
                                                    payment.paymentMethod
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                                {payment.phoneNumber || "-"}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-700">
                                                {payment.transactionId || "-"}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                                {payment.startDate
                                                    ? formatBanglaDate({
                                                        date: payment.startDate,
                                                    })
                                                    : "-"}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                                {payment.endDate
                                                    ? formatBanglaDate({
                                                        date: payment.endDate,
                                                    })
                                                    : "-"}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                                {payment.paidAt
                                                    ? formatBanglaDate({
                                                        date: payment.paidAt,
                                                    })
                                                    : "-"}
                                            </td>

                                            <td className="px-4 py-4">
                                                {getStatus(payment.status)}
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={10}
                                        className="py-12 text-center text-gray-500"
                                    >
                                        কোনো পেমেন্ট হিস্টোরি পাওয়া যায়নি।
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && !isFetching && (
                    <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            মোট{" "}
                            <span className="font-semibold text-[#039A63]">
                                {toBanglaNumber(payments.length)}
                            </span>{" "}
                            টি পেমেন্ট
                        </p>

                        {totalPages > 0 && (
                            <div className="flex items-center justify-center gap-1">
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#039A63] text-[#039A63] transition hover:bg-[#039A63] hover:text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition ${currentPage === page
                                                ? "bg-[#039A63] text-white"
                                                : "border border-[#039A63] bg-white text-[#039A63] hover:bg-[#039A63] hover:text-white"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#039A63] text-[#039A63] transition hover:bg-[#039A63] hover:text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SoftwarePaymentHistory;