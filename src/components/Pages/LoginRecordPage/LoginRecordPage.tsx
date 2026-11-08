"use client";

import React from "react";

import { IUserActivity } from "@/interface/user";
import { useGetUserLoginHistoryQuery } from "@/redux/features/user.features";

import CustomLoader from "@/components/Reusable/CustomLoader";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";

import { SERVER_ERROR_MESSAGE } from "@/constant";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";

export default function LoginRecordPage({ limit, page }: TQuery) {
    const {
        data,
        isFetching,
        isError,
    } = useGetUserLoginHistoryQuery({ limit, page }, { refetchOnMountOrArgChange: true });

    const activity = data?.data?.data as IUserActivity[] || [];
    const meta = data?.data?.meta as TMetaConfig

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="rounded-lg bg-white p-2">
            {/* Title */}
            <div className="mb-4 rounded-md bg-[#fff1f1] py-4 text-center shadow-sm">
                <h1 className="text-lg md:text-2xl font-bold text-[#ff4b00]">
                    ইউজারের লগইন - লগআউট রেকর্ড
                </h1>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#119f70] text-center text-white">
                            <TableHead th="ধরন" />
                            <TableHead th="ইউজার" />
                            <TableHead th="সময়" />
                            <TableHead th="ডিভাইস" />
                            <TableHead th="ব্রাউজার" />
                            <TableHead th="আইপি" />
                            <TableHead th="স্ট্যাটাস" />
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {/* Loading */}
                        {isFetching ? (
                            <tr>
                                <td colSpan={6} className="border p-8">
                                    <CustomLoader cls="h-[30vh]" />
                                </td>
                            </tr>
                        ) : isError ? (
                            /* Error */
                            <tr>
                                <td
                                    colSpan={6}
                                    className="border p-8 text-center text-sm text-gray-500"
                                >
                                    {SERVER_ERROR_MESSAGE}
                                </td>
                            </tr>
                        ) : !activity.length ? (
                            /* Empty */
                            <tr>
                                <td
                                    colSpan={6}
                                    className="border p-8 text-center text-sm text-gray-500"
                                >
                                    কোনো লগইন রেকর্ড পাওয়া যায়নি।
                                </td>
                            </tr>
                        ) : (
                            /* Data */
                            activity.map((row) => {
                                const isLogout = row.type === "Logout";
                                const isSuccess = row.status === true;
                                const isFailed = row.status === false;

                                const rowClass = isFailed
                                    ? "bg-red-50 hover:bg-red-100"
                                    : isLogout
                                        ? "bg-orange-50 hover:bg-orange-100"
                                        : isSuccess
                                            ? "bg-green-50 hover:bg-green-100"
                                            : "hover:bg-gray-50";

                                const colorClass = isFailed
                                    ? "font-medium text-red-600"
                                    : isLogout
                                        ? "font-medium text-[#ff7900]"
                                        : isSuccess
                                            ? "font-medium text-[#039A63]"
                                            : "font-medium text-gray-700";

                                return (
                                    <tr
                                        key={row.id}
                                        className={`transition-colors duration-200 ${rowClass}`}
                                    >
                                        <TableData td={row.type} cls={colorClass} />

                                        <TableData
                                            td={row.user?.name || "-"}
                                            cls={colorClass}
                                        />

                                        <TableData
                                            td={formatDate(row.createdAt)}
                                            cls={colorClass}
                                        />

                                        <TableData
                                            td={row.device || "-"}
                                            cls={colorClass}
                                        />

                                        <TableData
                                            td={row.browser || "-"}
                                            cls={colorClass}
                                        />

                                        <TableData
                                            td={row.ipAddress || "-"}
                                            cls={colorClass}
                                        />

                                        <TableData
                                            td={isSuccess ? "Success" : "Failed"}
                                            cls={colorClass}
                                        />
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

            </div>
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={activity?.length}
                title="রেকর্ড"
            />
        </div>
    );
}