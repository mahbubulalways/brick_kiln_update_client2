"use client";

import { FiBell, FiCheck } from "react-icons/fi";

import CustomStatus from "@/components/Reusable/CustomStatus";
import {
    useGetAllNotificationsQuery,
    useUpdateNotificationMutation,
} from "@/redux/features/notification.features";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { TQuery } from "@/interface/query";
import Link from "next/link";
import { TablePagination } from "@/components/Reusable/TablePagination";

export interface TNotification {
    id: string;
    vataId: string;
    title: string;
    message: string;
    type: string;
    path: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function NotificationPage({ limit, page }: TQuery) {
    const {
        data: notificationResponse,
        isLoading,
        isError,
        isFetching,
    } = useGetAllNotificationsQuery({ limit, page });

    const [updateNotification, { isLoading: isUpdating }] =
        useUpdateNotificationMutation();

    const notifications: TNotification[] =
        notificationResponse?.data?.data || [];
    const meta = notificationResponse?.data?.meta

    const handleRead = async (id: string) => {
        try {
            await updateNotification(id).unwrap();
        } catch (error) {
            console.error(error);
        }
    };



    if (isError) {
        return (
            <div className="p-5">
                <CustomStatus
                    type="error"
                    description="নোটিফিকেশন লোড করতে সমস্যা হয়েছে"
                />
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="p-5">
                <CustomStatus
                    type="loading"
                    description="নোটিফিকেশন লোড হচ্ছে..."
                />
            </div>
        );
    }
    if (!notifications.length) {
        return (
            <div className="p-5">
                <CustomStatus
                    type="empty"
                    description="কোনো নোটিফিকেশন পাওয়া যায়নি"
                />
            </div>
        );
    }

    return (
        <div className="p-5 bg-white">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        নোটিফিকেশন
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        আপনার সকল নোটিফিকেশন এখানে দেখতে পারবেন
                    </p>
                </div>

                {isFetching && (
                    <span className="text-xs text-gray-400">
                        আপডেট হচ্ছে...
                    </span>
                )}
            </div>

            <div className="space-y-3 bg-white">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start justify-between gap-4 rounded-lg border p-4 transition-all ${notification.isRead
                            ? "border-green-100 bg-green-50"
                            : "border-green-100 bg-red-50"
                            }`}
                    >
                        <Link href={notification?.path}>
                            <div className="flex min-w-0 items-start gap-3">
                                <div
                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notification.isRead
                                        ? "bg-gray-100 text-gray-500"
                                        : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    <FiBell className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <h3
                                        className={`text-sm font-semibold ${notification.isRead
                                            ? "text-gray-700"
                                            : "text-gray-900"
                                            }`}
                                    >
                                        {notification.title}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        {notification.message}
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">
                                        {notification.createdAt && (
                                            <p className="text-xs text-gray-400">
                                                {formatBanglaDate({
                                                    date: notification.createdAt,
                                                })}
                                            </p>
                                        )}

                                        {!notification.isRead && (
                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-600">
                                                নতুন
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                                handleRead(notification.id)
                            }
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-all disabled:cursor-not-allowed disabled:opacity-50 ${notification.isRead
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-gray-300 bg-white text-transparent hover:border-green-400"
                                }`}
                            title={
                                notification.isRead
                                    ? "অপঠিত করুন"
                                    : "পড়া হয়েছে"
                            }
                        >
                            {notification.isRead && (
                                <FiCheck className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                ))}
            </div>
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={notifications?.length}
                title="নোটিফিকেশন"
            />
        </div>
    );
}