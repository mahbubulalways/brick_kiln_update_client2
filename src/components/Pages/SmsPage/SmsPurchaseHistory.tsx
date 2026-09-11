"use client";

import { TQuery } from "@/interface/query";
import { useGetSmsPurchaseHistoryQuery } from "@/redux/features/sms.features";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

const getPaymentMethod = (method?: string | null) => {
    switch (method?.toUpperCase()) {
        case "BKASH":
            return "বিকাশ";
        case "NAGAD":
            return "নগদ";
        case "ROCKET":
            return "রকেট";
        default:
            return method || "-";
    }
};

const getPaymentType = (type?: string | null) => {
    switch (type?.toUpperCase()) {
        case "MANUAL":
            return "ম্যানুয়াল";
        case "BKASH":
            return "বিকাশ";
        case "NAGAD":
            return "নগদ";
        case "ROCKET":
            return "রকেট";
        default:
            return type || "-";
    }
};

const getStatus = (status?: string | null) => {
    switch (status?.toUpperCase()) {
        case "PENDING":
            return "অপেক্ষমান";

        case "PAID":
            return "পরিশোধিত";

        case "CANCELLED":
            return "বাতিল";

        case "FAILED":
            return "ব্যর্থ";

        case "PROCESSING":
            return "প্রক্রিয়াধীন";

        default:
            return status || "-";
    }
};

const getStatusClass = (status?: string | null) => {
    switch (status?.toUpperCase()) {
        case "PENDING":
            return "text-yellow-600 font-medium";

        case "PAID":
            return "text-green-600 font-medium";

        case "CANCELLED":
            return "text-red-600 font-medium";

        case "FAILED":
            return "text-red-500 font-medium";

        case "PROCESSING":
            return "text-blue-600 font-medium";

        default:
            return "text-gray-600";
    }
};

export const SmsPurchaseHistory = ({ page, limit }: TQuery) => {
    const {
        isError,
        isLoading,
        isFetching,
        data,
    } = useGetSmsPurchaseHistoryQuery({ limit, page });

    const smsHistory = data?.data?.data ?? [];
    const meta = data?.data?.meta;

    return (
        <div className="bg-white rounded-md p-5 min-h-screen">
            <div className="overflow-x-auto ">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#039A63] text-center rounded-md text-white">
                            <TableHead th="#" />
                            <TableHead th="SMS সংখ্যা" />
                            <TableHead th="প্রতি SMS" />
                            <TableHead th="মোট টাকা" />
                            <TableHead th="পেমেন্ট মাধ্যম" />
                            <TableHead th="পেমেন্ট নম্বর" />
                            <TableHead th="ট্রানজেকশন আইডি" />
                            <TableHead th="ধরণ" />
                            <TableHead th="স্ট্যাটাস" />
                            <TableHead th="তারিখ" />
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {isLoading || isFetching ? (
                            <tr>
                                <td colSpan={10}>
                                    <CustomLoader cls="h-[30vh]" />
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-10 text-red-500"
                                >
                                    ডাটা লোড করতে সমস্যা হয়েছে
                                </td>
                            </tr>
                        ) : !smsHistory?.length ? (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-10 text-gray-500"
                                >
                                    কোনো SMS ক্রয়ের ইতিহাস পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            smsHistory.map((row: any, index: number) => (
                                <tr
                                    key={row?.id}
                                    className="h-[48px] border-b border-gray-200
                                     hover:bg-gray-100 duration-200"
                                >

                                    <TableData
                                        td={
                                            ((meta?.page ?? 1) - 1) *
                                            (meta?.limit ?? 10) +
                                            index +
                                            1
                                        }
                                    />

                                    <TableData
                                        td={row?.smsQuantity ?? 0}
                                    />

                                    <TableData
                                        td={`৳ ${row.ratePerSms}`}
                                    />

                                    <TableData
                                        td={`৳ ${row.totalAmount}`}
                                    />

                                    <TableData
                                        td={getPaymentMethod(
                                            row?.paymentMethod
                                        )}
                                    />

                                    <TableData
                                        td={row?.phoneNumber ?? "-"}
                                    />

                                    <TableData
                                        td={row?.transactionId ?? "-"}
                                        cls="font-medium"
                                    />

                                    <TableData
                                        td={getPaymentType(row?.type)}
                                        cls={
                                            row?.type === "MANUAL"
                                                ? "font-medium text-blue-600"
                                                : "font-medium text-purple-600"
                                        }
                                    />
                                    <TableData
                                        td={getStatus(row?.status)}
                                        cls={getStatusClass(row?.status)}
                                    />
                                    <TableData
                                        td={formatBanglaDate(row?.createdAt)}
                                    />
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={smsHistory?.length ?? 0}
                title="SMS"
            />
        </div>
    );
}