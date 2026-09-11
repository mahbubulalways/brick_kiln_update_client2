"use client";

import { useGetSmsPurchasePaymentHistoryQuery } from "@/redux/features/sms.features";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TablePagination } from "@/components/Reusable/TablePagination";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { TQuery } from "@/interface/query";

export type TSmsPurchaseHistory = {
    id: string;
    vataId: string;
    smsQuantity: number;
    ratePerSms: number | string;
    totalAmount: number | string;
    paymentMethod: string | null;
    transactionId: string | null;
    phoneNumber: string | null;
    type: "MANUAL" | "BKASH";
    status: "PENDING" | "PAID" | "CANCELLED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    vata: {
        vataId: string;
        nameBangla: string;
    };
};

export default function SmsPurchasedHistoryPage({ limit, page }: TQuery) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetSmsPurchasePaymentHistoryQuery({ limit, page });

    const histories = (data?.data?.data as TSmsPurchaseHistory[]) ?? [];
    const meta = data?.data?.meta;
    if (isLoading) {
        return <CustomLoader cls="h-[30vh]" />;
    }

    if (isError) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-red-500">
                SMS ক্রয়ের ইতিহাস লোড করা সম্ভব হয়নি।
            </div>
        );
    }

    return (
        <div className="bg-white rounded-md p-5 min-h-screen">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    SMS ক্রয়ের ইতিহাস
                </h2>

                <p className="text-sm text-gray-500">
                    বিভিন্ন ভাটার SMS ক্রয় এবং পেমেন্টের ইতিহাস
                </p>
            </div>

            <div className="overflow-x-auto mt-5 border rounded-t-md">
                <table className="min-w-full border-collapse rounded-t-md">
                    <thead className="rounded-t-md">
                        <tr className="bg-[#039A63] text-center text-white">
                            <TableHead th="#" />
                            <TableHead th="ভাটা ID" />
                            <TableHead th="ভাটার নাম" />
                            <TableHead th="SMS সংখ্যা" />
                            <TableHead th="প্রতি SMS" />
                            <TableHead th="মোট টাকা" />
                            <TableHead th="পেমেন্ট মাধ্যম" />
                            <TableHead th="পেমেন্ট নম্বর" />
                            <TableHead th="ট্রানজেকশন ID" />
                            <TableHead th="ধরন" />
                            <TableHead th="স্ট্যাটাস" />
                            <TableHead th="তারিখ" />
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {histories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={12}
                                    className="py-10 text-gray-500"
                                >
                                    কোনো SMS ক্রয়ের ইতিহাস পাওয়া যায়নি।
                                </td>
                            </tr>
                        ) : (
                            histories.map(
                                (row: TSmsPurchaseHistory, index: number) => (
                                    <tr
                                        key={row?.id}
                                        className="h-[48px] border-b border-gray-200
                                     hover:bg-gray-100 duration-200"
                                    >
                                        <TableData
                                            td={
                                                index +
                                                1 +
                                                ((meta?.page ?? 1) - 1) *
                                                (meta?.limit ?? 10)
                                            }
                                        />

                                        <TableData
                                            td={
                                                row?.vata?.vataId ??
                                                row?.vataId ??
                                                "-"
                                            }
                                        />

                                        <TableData
                                            td={
                                                row?.vata?.nameBangla ??
                                                "-"
                                            }
                                            cls="font-medium"
                                        />

                                        <TableData
                                            td={toBanglaNumber(
                                                row?.smsQuantity,
                                            )}
                                        />

                                        <TableData
                                            td={`৳ ${toBanglaNumber(
                                                row?.ratePerSms,
                                            )}`}
                                        />

                                        <TableData
                                            td={`৳ ${toBanglaNumber(
                                                row?.totalAmount,
                                            )}`}
                                        />

                                        <TableData
                                            td={
                                                row?.paymentMethod === "BKASH"
                                                    ? "বিকাশ"
                                                    : row?.paymentMethod ===
                                                        "NAGAD"
                                                        ? "নগদ"
                                                        : row?.paymentMethod ===
                                                            "ROCKET"
                                                            ? "রকেট"
                                                            : row?.paymentMethod ??
                                                            "-"
                                            }
                                        />

                                        <TableData
                                            td={row?.phoneNumber ?? "-"}
                                        />

                                        <TableData
                                            td={row?.transactionId ?? "-"}
                                        />

                                        <TableData
                                            td={
                                                row?.type === "BKASH"
                                                    ? "বিকাশ"
                                                    : row?.type === "MANUAL"
                                                        ? "ম্যানুয়াল"
                                                        : row?.type ?? "-"
                                            }
                                        />

                                        <TableData
                                            td={
                                                row?.status === "PENDING"
                                                    ? "অপেক্ষমান"
                                                    : row?.status === "PAID"
                                                        ? "সফল"
                                                        : row?.status ===
                                                            "CANCELLED"
                                                            ? "বাতিল"
                                                            : row?.status ===
                                                                "FAILED"
                                                                ? "ব্যর্থ"
                                                                : row?.status ?? "-"
                                            }
                                            cls={
                                                row?.status === "PENDING"
                                                    ? "font-medium text-yellow-600"
                                                    : row?.status === "PAID"
                                                        ? "font-medium text-green-600"
                                                        : row?.status ===
                                                            "CANCELLED"
                                                            ? "font-medium text-red-600"
                                                            : row?.status ===
                                                                "FAILED"
                                                                ? "font-medium text-red-500"
                                                                : "font-medium text-gray-600"
                                            }
                                        />

                                        <TableData
                                            td={
                                                row?.createdAt
                                                    ? new Date(
                                                        row.createdAt,
                                                    ).toLocaleDateString(
                                                        "bn-BD",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )
                                                    : "-"
                                            }
                                        />
                                    </tr>
                                ),
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={histories.length}
                title="SMS"
            />
        </div>
    );
}