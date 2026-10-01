"use client";

import { useGetAllActivityLogQuery } from "@/redux/features/activity.log.features";
import { TQuery } from "@/interface/query";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { Clock3 } from "lucide-react";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { moduleNames } from "../ApprovalRequestPage/approval.field";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TActivityAction = "CREATE" | "UPDATE" | "DELETE";

const moduleNameMap: Record<string, string> = moduleNames;

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
    const meta = data?.data?.meta as TMetaConfig;

    if (isLoading) {
        return (
            <div className="rounded-md bg-white">
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
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-md border border-gray-200 bg-gray-50 p-3"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex gap-2">
                                    <div className="h-6 w-24 rounded bg-gray-200" />
                                    <div className="h-6 w-16 rounded bg-gray-200" />
                                </div>

                                <div className="h-4 w-32 rounded bg-gray-200" />
                            </div>

                            <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />

                            <div className="mt-2 h-3 w-28 rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <CustomStatus type="error" />
        );
    }

    return (
        <div className="relative">
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

                <div className="relative space-y-2 p-3">
                    {!activityLogs.length ? (
                        <CustomStatus type="empty" />
                    ) : (
                        activityLogs.map((item: any) => {
                            const action =
                                item.action as TActivityAction;

                            const isUpdate = action === "UPDATE";
                            const isDelete = action === "DELETE";
                            const isCreate = action === "CREATE";

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
                                                {moduleNameMap[item.module] ||
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
                                                {actionNameMap[action]}
                                            </span>
                                        </div>

                                        <span className="text-xs text-gray-500">
                                            {item.createdAt
                                                ? new Date(
                                                    item.createdAt,
                                                ).toLocaleString(
                                                    "bn-BD",
                                                    {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
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