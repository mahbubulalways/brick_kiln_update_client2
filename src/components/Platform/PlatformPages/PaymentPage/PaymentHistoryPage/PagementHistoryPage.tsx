"use client";

import React from "react";

import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

import {
    useGetOtherPaymentHistoryAdminQuery,
} from "@/redux/features/subscription_payment";

import { TSubscriptionPayment } from "@/interface/sub_payment";

export default function PagementHistoryPage() {
    const {
        data,
        isLoading,
        isFetching,
    } = useGetOtherPaymentHistoryAdminQuery(undefined);

    const payments =
        (data?.data as TSubscriptionPayment[]) || [];

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
                return {
                    label: "পরিশোধিত",
                    className:
                        "bg-green-100 text-green-700 border border-green-200",
                };

            case "PENDING":
                return {
                    label: "পেন্ডিং",
                    className:
                        "bg-yellow-100 text-yellow-700 border border-yellow-200",
                };

            case "CANCELLED":
                return {
                    label: "বাতিল",
                    className:
                        "bg-red-100 text-red-700 border border-red-200",
                };

            default:
                return {
                    label: status || "-",
                    className:
                        "bg-gray-100 text-gray-700 border border-gray-200",
                };
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-gray-800">
                    পেমেন্ট হিস্টোরি
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    সকল সাবস্ক্রিপশন পেমেন্টের ইতিহাস
                </p>
            </div>

            {/* Table Card */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left">
                        <thead>
                            <tr className="bg-[#039A63] text-white">
                                <th className="px-4 py-3 text-sm font-semibold">
                                    #
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    ভাটা
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    মালিক
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    সাবস্ক্রিপশন
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    পরিমাণ
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    পেমেন্ট মাধ্যম
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    ফোন নম্বর
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    ট্রানজেকশন ID
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    স্ট্যাটাস
                                </th>

                                <th className="px-4 py-3 text-sm font-semibold">
                                    তারিখ
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading || isFetching ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <tr key={index}>
                                        {Array.from({ length: 10 }).map(
                                            (_, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className="px-4 py-4"
                                                >
                                                    <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-gray-200" />
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))
                            ) : payments.length > 0 ? (
                                payments.map((payment, index) => {
                                    const status = getStatus(payment.status);

                                    return (
                                        <tr
                                            key={payment.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            {/* Serial */}
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {toBanglaNumber(index + 1)}
                                            </td>

                                            {/* Vata */}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {payment.vata?.nameBangla ||
                                                            payment.vata?.nameEnglish ||
                                                            "-"}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        {payment.vata?.vataId ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Owner */}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        {payment.vata?.ownerName ||
                                                            "-"}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        {
                                                            payment.vata
                                                                ?.ownerPhoneNumber
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Subscription */}
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {payment.subscriptionPlan
                                                        ?.name || "-"}
                                                </p>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold text-[#039A63]">
                                                    ৳
                                                    {toBanglaNumber(
                                                        Number(
                                                            payment.amount || 0
                                                        )
                                                    )}
                                                </p>
                                            </td>

                                            {/* Payment Method */}
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {getPaymentMethod(
                                                    payment.paymentMethod
                                                )}
                                            </td>

                                            {/* Phone */}
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {payment.phoneNumber || "-"}
                                            </td>

                                            {/* Transaction ID */}
                                            <td className="px-4 py-4">
                                                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                                                    {payment.transactionId ||
                                                        "-"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                                {payment.createdAt
                                                    ? formatBanglaDate(
                                                        {
                                                            date: payment.createdAt
                                                        }
                                                    )
                                                    : "-"}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={10}
                                        className="px-4 py-12 text-center"
                                    >
                                        <p className="text-sm font-medium text-gray-500">
                                            কোনো পেমেন্ট হিস্টোরি পাওয়া যায়নি।
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}