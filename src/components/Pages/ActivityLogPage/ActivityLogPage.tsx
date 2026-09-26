"use client";

import { useGetAllActivityLogQuery } from "@/redux/features/activity.log.features";
import { TQuery } from "@/interface/query";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { Clock3 } from "lucide-react";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";

type TActivityAction = "CREATE" | "UPDATE" | "DELETE";

const moduleNameMap: Record<string, string> = {
    CHALLAN: "চালান",
    DELIVERY: "ডেলিভারি",
    CUSTOMER: "কাস্টমার",
    PAYMENT: "পেমেন্ট",
    STOCK: "স্টক",
    LEDGER: "লেজার",
    DUE: "বাকি",
    CASH: "ক্যাশ",
    INVOICE: "ইনভয়েস",
    CLASS_RATE: "শ্রেণী ও রেট",
    TASK: "টাস্ক",
    DRIVER: "ড্রাইভার",
};

const actionNameMap: Record<TActivityAction, string> = {
    CREATE: "তৈরি",
    UPDATE: "আপডেট",
    DELETE: "ডিলেট",
};

const ActivityLogPage = ({ limit, page }: TQuery) => {
    const {
        isError,
        isLoading,
        data,
    } = useGetAllActivityLogQuery({
        limit,
        page,
    });

    const activityLogs = data?.data?.data || [];
    const meta = data?.data?.meta as TMetaConfig


    if (isError) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                অ্যাক্টিভিটি লগ লোড করা যায়নি।
            </div>
        );
    }

    return (
        <div className="">
            <div className="rounded-t-md bg-white">
                <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2">
                    <Clock3
                        size={18}
                        className="text-[#039A63]"
                    />

                    <h2 className="text-sm font-semibold text-gray-800">
                        অ্যাক্টিভিটি লগ
                    </h2>
                </div>

                <div className="space-y-2 p-3">
                    {!activityLogs.length ? (
                        <div className="py-10 text-center text-sm text-gray-500">
                            কোনো অ্যাক্টিভিটি লগ পাওয়া যায়নি।
                        </div>
                    ) : (
                        activityLogs.map((item: any) => {
                            const action =
                                item.action as TActivityAction;

                            const isUpdate =
                                action === "UPDATE";

                            const isDelete =
                                action === "DELETE";

                            const isCreate =
                                action === "CREATE";

                            return (
                                <div
                                    key={item.id}
                                    className={`
                                        rounded-md border p-3
                                        ${isUpdate
                                            ? "border-blue-200 bg-blue-50"
                                            : isDelete
                                                ? "border-red-200 bg-red-50"
                                                : isCreate
                                                    ? "border-green-200 bg-green-50"
                                                    : "border-gray-200 bg-gray-50"
                                        }
                                    `}
                                >
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                                                {moduleNameMap[
                                                    item.module
                                                ] ||
                                                    item.module}
                                            </span>

                                            <span
                                                className={`
                                                    rounded px-2 py-1 text-xs font-semibold
                                                    ${isUpdate
                                                        ? "bg-blue-100 text-blue-700"
                                                        : isDelete
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                    }
                                                `}
                                            >
                                                {
                                                    actionNameMap[
                                                    action
                                                    ]
                                                }
                                            </span>

                                        </div>

                                        <span className="text-xs text-gray-500">
                                            {item.createdAt
                                                ? new Date(
                                                    item.createdAt,
                                                ).toLocaleString(
                                                    "bn-BD",
                                                    {
                                                        dateStyle:
                                                            "medium",
                                                        timeStyle:
                                                            "short",
                                                    },
                                                )
                                                : "-"}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-800">
                                        {item.description ||
                                            "কোনো বিবরণ পাওয়া যায়নি।"}
                                    </div>

                                    {item.user?.name && (
                                        <div className="mt-2 text-xs text-gray-500">
                                            করেছেন:{" "}
                                            <span className="font-medium text-gray-700">
                                                {item.user.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={activityLogs.length}
                title="অ্যাক্টিভিটি"
            />
        </div>
    );
};

export default ActivityLogPage;