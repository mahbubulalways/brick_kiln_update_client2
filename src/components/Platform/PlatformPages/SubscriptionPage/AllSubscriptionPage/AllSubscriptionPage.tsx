"use client";

import {
    Check,
    Crown,
    Edit,
    MoreVertical,
    Plus,
    ShieldCheck,
    Users,
    MessageSquare,
    HardDrive,
    FileText,
    ListTodo,
    Pencil,
    Trash2,
    Power,
} from "lucide-react";

import { TSubscriptionPlan } from "@/interface/subscription";
import { useGetAllSubscriptionQuery } from "@/redux/system.features/system.subscription.featurs";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";

export default function AllSubscriptionPage() {
    const { isError, isLoading, data } =
        useGetAllSubscriptionQuery(undefined);

    const subscriptions = (data?.data as TSubscriptionPlan[]) || [];

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#039A63]" />

                    <p className="text-sm text-gray-500">
                        সাবস্ক্রিপশন প্ল্যান লোড হচ্ছে...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">
                    <p className="text-sm font-medium text-red-500">
                        সাবস্ক্রিপশন প্ল্যান লোড করা সম্ভব হয়নি।
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        অনুগ্রহ করে আবার চেষ্টা করুন।
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        সাবস্ক্রিপশন প্ল্যান
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        সকল সাবস্ক্রিপশন প্ল্যান পরিচালনা করুন।
                    </p>
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#039A63] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#028653]"
                >
                    <Plus className="h-4 w-4" />
                    নতুন প্ল্যান
                </button>
            </div>

            {/* ================= SUMMARY ================= */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {/* Total */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        মোট প্ল্যান
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-800">
                        {subscriptions.length}
                    </p>
                </div>

                {/* Active */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Active Plans
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#039A63]">
                        {
                            subscriptions.filter(
                                (item) => item.isActive
                            ).length
                        }
                    </p>
                </div>

                {/* Inactive */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Inactive Plans
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-500">
                        {
                            subscriptions.filter(
                                (item) => !item.isActive
                            ).length
                        }
                    </p>
                </div>

                {/* Billing */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Billing Types
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-600">
                        {
                            new Set(
                                subscriptions.map(
                                    (item) => item.billingCycle
                                )
                            ).size
                        }
                    </p>
                </div>
            </div>

            {/* ================= EMPTY ================= */}
            {!subscriptions.length ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
                    <Crown className="mx-auto h-10 w-10 text-gray-300" />

                    <h3 className="mt-4 text-base font-semibold text-gray-700">
                        কোনো সাবস্ক্রিপশন প্ল্যান নেই
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                        নতুন একটি সাবস্ক্রিপশন প্ল্যান তৈরি করুন।
                    </p>
                </div>
            ) : (
                /* ================= SUBSCRIPTION CARDS ================= */
                <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                        <div
                            key={subscription.id}
                            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#039A63]/30 hover:shadow-lg"
                        >
                            {/* Top Green Line */}
                            <div
                                className={`h-1 w-full ${subscription.isActive
                                    ? "bg-[#039A63]"
                                    : "bg-gray-300"
                                    }`}
                            />

                            <div className="p-5">
                                {/* ================= 3 COLUMN ================= */}
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1fr_1.2fr]">
                                    {/* =========================================
                                        COLUMN 1 - PLAN INFO
                                    ========================================= */}
                                    <div className="flex flex-col justify-between border-b border-gray-100 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                                        <div>
                                            {/* Plan Header */}
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${subscription.isActive
                                                        ? "bg-[#039A63]/10 text-[#039A63]"
                                                        : "bg-gray-100 text-gray-400"
                                                        }`}
                                                >
                                                    <Crown className="h-6 w-6" />
                                                </div>

                                                <div className="min-w-0">
                                                    <h2 className="truncate text-lg font-bold text-gray-800">
                                                        {subscription.name}
                                                    </h2>

                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                            {
                                                                subscription.type
                                                            }
                                                        </span>

                                                        <span className="h-1 w-1 rounded-full bg-gray-300" />

                                                        <span
                                                            className={`text-xs font-semibold ${subscription.isActive
                                                                ? "text-[#039A63]"
                                                                : "text-red-500"
                                                                }`}
                                                        >
                                                            {subscription.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="ml-auto cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                                        >
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="rounded-md border bg-white shadow-md"
                                                    >
                                                        <DropdownMenuItem>
                                                            <CustomDropDownMenuItem
                                                                Icon={Power}
                                                                title="ডিঅ্যাক্টিভেট করুন"
                                                            />
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem>
                                                            <CustomDropDownMenuItem
                                                                Icon={Trash2}
                                                                title="ডিলিট করুন"
                                                            />
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Price */}
                                            <div className="mt-5">
                                                <p className="text-xs text-gray-400">
                                                    প্ল্যান মূল্য
                                                </p>

                                                <div className="mt-1 flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold text-gray-800">
                                                        ৳
                                                        {Number(
                                                            subscription.price
                                                        ).toLocaleString()}
                                                    </span>

                                                    <span className="text-xs text-gray-400">
                                                        /{" "}
                                                        {
                                                            subscription.billingCycle
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="mt-3 text-sm leading-5 text-gray-500">
                                                {subscription.description ||
                                                    "এই প্ল্যানের কোনো বিবরণ দেওয়া হয়নি।"}
                                            </p>
                                        </div>

                                        {/* Buttons */}
                                        <div className="mt-5 flex gap-2">
                                            <Link href={`/system/subscriptions/${subscription.id}`}
                                                className="w-full cursor-pointer"
                                            >
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer w-full flex-1 items-center justify-center gap-2 rounded-lg bg-[#039A63] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#028653]"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    এডিট করুন
                                                </button>
                                            </Link>

                                            <button
                                                type="button"
                                                className="flex items-center justify-center rounded-lg border border-gray-200 px-3 text-gray-500 transition hover:bg-gray-50"
                                                title={
                                                    subscription.isActive
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }
                                            >
                                                <ShieldCheck className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* =========================================
                                        COLUMN 2 - LIMITS
                                    ========================================= */}
                                    <div className="border-b border-gray-100 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-700">
                                                প্ল্যান লিমিট
                                            </p>

                                            <span className="text-xs text-gray-400">
                                                Limits
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5">
                                            <LimitItem
                                                icon={
                                                    <Users className="h-5 w-5" />
                                                }
                                                label="Users"
                                                value={
                                                    subscription.maxUsers
                                                }
                                            />

                                            <LimitItem
                                                icon={
                                                    <FileText className="h-5 w-5" />
                                                }
                                                label="Invoices"
                                                value={
                                                    subscription.maxInvoices
                                                }
                                            />

                                            <LimitItem
                                                icon={
                                                    <MessageSquare className="h-5 w-5" />
                                                }
                                                label="SMS"
                                                value={
                                                    subscription.maxSms
                                                }
                                            />

                                            <LimitItem
                                                icon={
                                                    <HardDrive className="h-5 w-5" />
                                                }
                                                label="Storage"
                                                value={
                                                    subscription.maxStorage
                                                }
                                            />

                                            <LimitItem
                                                icon={
                                                    <ListTodo className="h-5 w-5" />
                                                }
                                                label="Tasks"
                                                value={
                                                    subscription.maxTasks
                                                }
                                            />

                                            <LimitItem
                                                icon={
                                                    <FileText className="h-5 w-5" />
                                                }
                                                label="Purchases"
                                                value={subscription?._count?.vatas}
                                            />
                                        </div>
                                    </div>

                                    {/* =========================================
                                        COLUMN 3 - FEATURES
                                    ========================================= */}
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-700">
                                                Features
                                            </p>

                                            <span className="text-xs text-gray-400">
                                                {subscription.features
                                                    ?.length || 0}{" "}
                                                available
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                            {subscription.features?.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2.5"
                                                    >
                                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#039A63]/10">
                                                            <Check className="h-3 w-3 text-[#039A63]" />
                                                        </div>

                                                        <span className="text-sm leading-5 text-gray-600">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}

                                            {!subscription.features
                                                ?.length && (
                                                    <p className="text-sm text-gray-400">
                                                        কোনো feature যোগ করা
                                                        হয়নি।
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* =========================================================
   LIMIT ITEM
========================================================= */

function LimitItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string | null | undefined;
}) {
    return (
        <div className="flex min-h-[62px] items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
            <div className="shrink-0 text-[#039A63]">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {label}
                </p>

                <p className="mt-0.5 truncate text-sm font-bold text-gray-700">
                    {value ?? "Unlimited"}
                </p>
            </div>
        </div>
    );
}