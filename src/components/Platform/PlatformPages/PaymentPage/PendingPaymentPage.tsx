"use client";

import React from "react";
import { Check, MoreVertical, X } from "lucide-react";
import Swal from "sweetalert2";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

import {
    useGetPendingPaymentAdminQuery,
    useUpdateSubscriptionPaymentStatusAdminMutation,
} from "@/redux/features/subscription_payment";

import { TSubscriptionPayment } from "@/interface/sub_payment";

export default function PendingPaymentPage() {
    const {
        data,
        isLoading,
    } = useGetPendingPaymentAdminQuery(undefined);

    const payments = (data?.data || []) as TSubscriptionPayment[];

    const [updatePaymentStatus, { isLoading: updateLoading }] =
        useUpdateSubscriptionPaymentStatusAdminMutation();

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

    // PAID / CANCELLED
    const handlePaymentStatusUpdate = async (
        id: string,
        status: "PAID" | "CANCELLED"
    ) => {
        const isPaid = status === "PAID";

        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: isPaid
                ? "এই পেমেন্টটি অনুমোদন করলে এটি PAID হিসেবে চিহ্নিত হবে।"
                : "এই পেমেন্টটি বাতিল করলে এটি CANCELLED হিসেবে চিহ্নিত হবে।",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: isPaid
                ? "হ্যাঁ, অনুমোদন করুন"
                : "হ্যাঁ, বাতিল করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            await updatePaymentStatus({
                id,
                data: {
                    status,
                },
            }).unwrap();

            await Swal.fire({
                title: isPaid
                    ? "অনুমোদন হয়েছে!"
                    : "বাতিল হয়েছে!",
                text: isPaid
                    ? "পেমেন্টটি সফলভাবে অনুমোদন করা হয়েছে।"
                    : "পেমেন্টটি সফলভাবে বাতিল করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            console.log(error)
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "পেমেন্ট স্ট্যাটাস আপডেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-5 rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">
                    পেন্ডিং পেমেন্ট
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    ভাটাগুলো থেকে আসা পেন্ডিং সাবস্ক্রিপশন পেমেন্টগুলো এখানে দেখুন।
                </p>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1250px] text-left text-sm">
                        <thead className="bg-[#039A63] text-white">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    #
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    ভাটার নাম
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    সাবস্ক্রিপশন
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    প্ল্যানের মূল্য
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    পরিশোধের পরিমাণ
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    মাধ্যম
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    ফোন নম্বর
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    Transaction ID
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    তারিখ
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-center font-semibold">
                                    অ্যাকশন
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading  ? (
                                Array.from({ length: 6 }).map((_, index) => (
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
                                ))
                            ) : payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        {/* Vata ID */}
                                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                            {payment.vata?.vataId || "-"}
                                        </td>

                                        {/* Vata */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {payment.vata?.nameBangla ||
                                                        payment.vata?.nameEnglish ||
                                                        "-"}
                                                </p>

                                                {payment.vata?.ownerName && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        মালিক:{" "}
                                                        {payment.vata.ownerName}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Subscription */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <span className="font-medium text-gray-700">
                                                {payment.subscriptionPlan?.name ||
                                                    "-"}
                                            </span>
                                        </td>

                                        {/* Plan Price */}
                                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-700">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(
                                                    payment.subscriptionPlan
                                                        ?.price || 0
                                                )
                                            )}
                                        </td>

                                        {/* Amount */}
                                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-800">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(payment.amount || 0)
                                            )}
                                        </td>

                                        {/* Payment Method */}
                                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                            {getPaymentMethod(
                                                payment.paymentMethod
                                            )}
                                        </td>

                                        {/* Phone */}
                                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                            {payment.phoneNumber || "-"}
                                        </td>

                                        {/* Transaction ID */}
                                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-700">
                                            {payment.transactionId || "-"}
                                        </td>

                                        {/* Date */}
                                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                            {payment.createdAt
                                                ? formatBanglaDate({
                                                    date: payment.createdAt,
                                                })
                                                : "-"}
                                        </td>

                                        {/* Action */}
                                        <td className="px-4 py-4 text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={updateLoading}
                                                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:border-[#039A63] hover:bg-[#039A63] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <MoreVertical
                                                            size={18}
                                                        />
                                                    </button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-52 rounded-md border bg-white shadow-md"
                                                >
                                                    {/* Approve */}
                                                    <DropdownMenuItem
                                                        disabled={updateLoading}
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handlePaymentStatusUpdate(
                                                                payment.id,
                                                                "PAID"
                                                            )
                                                        }
                                                    >
                                                        <CustomDropDownMenuItem
                                                            Icon={Check}
                                                            title="পেমেন্ট অনুমোদন করুন"
                                                        />
                                                    </DropdownMenuItem>

                                                    {/* Cancel */}
                                                    <DropdownMenuItem
                                                        disabled={updateLoading}
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handlePaymentStatusUpdate(
                                                                payment.id,
                                                                "CANCELLED"
                                                            )
                                                        }
                                                    >
                                                        <CustomDropDownMenuItem
                                                            Icon={X}
                                                            title="পেমেন্ট বাতিল করুন"
                                                        />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={10}
                                        className="py-12 text-center text-gray-500"
                                    >
                                        কোনো পেন্ডিং পেমেন্ট পাওয়া যায়নি।
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!isLoading &&
                    payments.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-500">
                                মোট{" "}
                                <span className="font-semibold text-[#039A63]">
                                    {toBanglaNumber(payments.length)}
                                </span>{" "}
                                টি পেন্ডিং পেমেন্ট
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
}