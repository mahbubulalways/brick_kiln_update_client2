"use client";

import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    Globe2,
    MapPin,
    MessageSquare,
    Phone,
    User,
    Wallet,
    XCircle,
} from "lucide-react";

import { useGetSingleVataQuery } from "@/redux/system.features/system.vata.features";
import {
    TSubscription,
    TVataResponse,
} from "@/interface/vata";

type TSingleVataPageProps = {
    id: string;
};

const formatDate = (date?: string | Date | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("bn-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const formatCurrency = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") {
        return "৳ 0";
    }

    return `৳ ${Number(value).toLocaleString("bn-BD")}`;
};

const getSubscriptionStatus = (
    subscriptionEnd?: string | Date | null,
) => {
    if (!subscriptionEnd) {
        return {
            label: "সাবস্ক্রিপশন নেই",
            color: "bg-gray-100 text-gray-600",
            icon: XCircle,
        };
    }

    const today = new Date();
    const endDate = new Date(subscriptionEnd);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < today) {
        return {
            label: "মেয়াদ শেষ",
            color: "bg-red-50 text-red-600",
            icon: XCircle,
        };
    }

    return {
        label: "সক্রিয়",
        color: "bg-green-50 text-green-600",
        icon: CheckCircle2,
    };
};

const getPaymentStatus = (status?: string | null) => {
    switch (status?.toUpperCase()) {
        case "PAID":
            return {
                label: "পরিশোধিত",
                color: "bg-green-50 text-green-600",
                icon: CheckCircle2,
            };

        case "PENDING":
            return {
                label: "অপেক্ষমান",
                color: "bg-yellow-50 text-yellow-600",
                icon: Clock3,
            };

        case "FAILED":
            return {
                label: "ব্যর্থ",
                color: "bg-red-50 text-red-600",
                icon: XCircle,
            };

        case "CANCELLED":
        case "CANCELED":
            return {
                label: "বাতিল",
                color: "bg-gray-100 text-gray-600",
                icon: XCircle,
            };

        default:
            return {
                label: status || "অজানা",
                color: "bg-gray-100 text-gray-600",
                icon: Clock3,
            };
    }
};

const InfoItem = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) => {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#039A63] shadow-sm">
                <Icon size={18} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
                <p className="mb-1 text-xs font-medium text-gray-500">
                    {label}
                </p>

                <p className="truncate text-sm font-semibold text-gray-800">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
};

export default function SingleVataPage({
    id,
}: TSingleVataPageProps) {
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetSingleVataQuery(id, {
        refetchOnMountOrArgChange: true,
    });

    const vata = data?.data as TVataResponse;

    if (isLoading || isFetching) {
        return (
            <div className="space-y-5">
                <div className="h-10 w-52 animate-pulse rounded-lg bg-gray-200" />

                <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
                    <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
                </div>
            </div>
        );
    }

    if (isError || !vata) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                        <XCircle size={24} />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-800">
                        ভাটার তথ্য পাওয়া যায়নি
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        তথ্য লোড করতে সমস্যা হয়েছে।
                    </p>
                </div>
            </div>
        );
    }

    const subscriptionStatus = getSubscriptionStatus(
        vata.subscriptionEnd,
    );

    const StatusIcon = subscriptionStatus.icon;

    const subscriptionEnd = vata.subscriptionEnd
        ? new Date(vata.subscriptionEnd)
        : null;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let remainingDays: number | null = null;

    if (subscriptionEnd) {
        subscriptionEnd.setHours(0, 0, 0, 0);

        remainingDays = Math.ceil(
            (subscriptionEnd.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );
    }

    return (
        <div className="space-y-5">

            {/* ================= HEADER ================= */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        ভাটার বিস্তারিত
                    </h1>

                    <p className="mt-0.5 text-xs text-gray-500">
                        ভাটার সকল তথ্য ও সাবস্ক্রিপশন দেখুন
                    </p>
                </div>

                <div
                    className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${subscriptionStatus.color}`}
                >
                    <StatusIcon size={15} />
                    {subscriptionStatus.label}
                </div>
            </div>

            {/* ================= HERO ================= */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="relative bg-gradient-to-r from-[#039A63] to-[#027A50] px-5 py-6 sm:px-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                                <Building2
                                    size={28}
                                    strokeWidth={1.7}
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {vata.nameBangla}
                                </h2>

                                <p className="mt-0.5 text-sm text-white/80">
                                    {vata.nameEnglish}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                            <p className="text-[11px] text-white/70">
                                ভাটা আইডি
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-white">
                                {vata.vataId}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">

                    {/* Plan */}

                    <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <CreditCard size={16} />

                            <span className="text-xs">
                                সাবস্ক্রিপশন প্ল্যান
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                            {vata.subscriptionPlan?.name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {formatCurrency(
                                vata.subscriptionPlan?.price,
                            )}
                        </p>
                    </div>

                    {/* Start */}

                    <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <CalendarDays size={16} />

                            <span className="text-xs">
                                সাবস্ক্রিপশন শুরু
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                            {formatDate(vata.subscriptionStart)}
                        </p>
                    </div>

                    {/* End */}

                    <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <Clock3 size={16} />

                            <span className="text-xs">
                                সাবস্ক্রিপশন শেষ
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                            {formatDate(vata.subscriptionEnd)}
                        </p>
                    </div>

                    {/* Remaining */}

                    <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <Wallet size={16} />

                            <span className="text-xs">
                                অবশিষ্ট সময়
                            </span>
                        </div>

                        <p
                            className={`text-sm font-semibold ${remainingDays !== null &&
                                    remainingDays < 0
                                    ? "text-red-500"
                                    : "text-[#039A63]"
                                }`}
                        >
                            {remainingDays === null
                                ? "—"
                                : remainingDays < 0
                                    ? `${Math.abs(
                                        remainingDays,
                                    )} দিন আগে শেষ`
                                    : `${remainingDays} দিন বাকি`}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= MAIN CONTENT ================= */}

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

                {/* ================= VATA INFORMATION ================= */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-2">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#039A63]">
                            <Building2 size={18} />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-gray-800">
                                ভাটার তথ্য
                            </h3>

                            <p className="text-xs text-gray-500">
                                ভাটার মৌলিক তথ্য
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <InfoItem
                            icon={Building2}
                            label="ভাটার নাম (বাংলা)"
                            value={vata.nameBangla}
                        />

                        <InfoItem
                            icon={Building2}
                            label="ভাটার নাম (ইংরেজি)"
                            value={vata.nameEnglish}
                        />

                        <InfoItem
                            icon={MapPin}
                            label="ঠিকানা"
                            value={vata.address}
                        />

                        <InfoItem
                            icon={Globe2}
                            label="সাবডোমেইন"
                            value={
                                vata.subdomain
                                    ? `${vata.subdomain}.itvata.com`
                                    : "—"
                            }
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="তৈরির তারিখ"
                            value={formatDate(vata.createdAt)}
                        />

                        <InfoItem
                            icon={CreditCard}
                            label="ভাটা আইডি"
                            value={vata.vataId}
                        />
                    </div>
                </div>

                {/* ================= OWNER ================= */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#039A63]">
                            <User size={18} />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-gray-800">
                                মালিকের তথ্য
                            </h3>

                            <p className="text-xs text-gray-500">
                                ভাটার মালিকের যোগাযোগ
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <InfoItem
                            icon={User}
                            label="মালিকের নাম"
                            value={vata.ownerName}
                        />

                        <InfoItem
                            icon={Phone}
                            label="ফোন নম্বর"
                            value={vata.ownerPhoneNumber}
                        />
                    </div>
                </div>
            </div>

            {/* ================= SUBSCRIPTION & BILLING ================= */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Subscription */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-5 flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#039A63]">
                                <CalendarDays size={18} />
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-gray-800">
                                    সাবস্ক্রিপশন
                                </h3>

                                <p className="text-xs text-gray-500">
                                    সাবস্ক্রিপশনের সময়কাল
                                </p>
                            </div>
                        </div>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${subscriptionStatus.color}`}
                        >
                            {subscriptionStatus.label}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <InfoItem
                            icon={CreditCard}
                            label="সাবস্ক্রিপশন প্ল্যান"
                            value={
                                vata.subscriptionPlan?.name || "—"
                            }
                        />

                        <InfoItem
                            icon={Wallet}
                            label="প্ল্যান মূল্য"
                            value={formatCurrency(
                                vata.subscriptionPlan?.price,
                            )}
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="শুরুর তারিখ"
                            value={formatDate(
                                vata.subscriptionStart,
                            )}
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="শেষের তারিখ"
                            value={formatDate(
                                vata.subscriptionEnd,
                            )}
                        />
                    </div>
                </div>

                {/* Next Payment */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#039A63]">
                            <Wallet size={18} />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-gray-800">
                                পেমেন্ট তথ্য
                            </h3>

                            <p className="text-xs text-gray-500">
                                পরবর্তী পেমেন্টের তথ্য
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <InfoItem
                            icon={Wallet}
                            label="সাবস্ক্রিপশন ফি"
                            value={formatCurrency(
                                vata.subscriptionPlan?.price,
                            )}
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="পরবর্তী পেমেন্ট"
                            value={formatDate(
                                vata.nextPaymentDate,
                            )}
                        />

                        <InfoItem
                            icon={CreditCard}
                            label="মোট পেমেন্ট"
                            value={formatCurrency(
                                vata.subscriptionPayments?.reduce(
                                    (total: number, payment: TSubscription) =>
                                        total +
                                        Number(
                                            payment.amount || 0,
                                        ),
                                    0,
                                ),
                            )}
                        />

                        <InfoItem
                            icon={MessageSquare}
                            label="মোট পেমেন্ট সংখ্যা"
                            value={
                                vata.subscriptionPayments?.length
                                    ? `${vata.subscriptionPayments.length} টি`
                                    : "০ টি"
                            }
                        />
                    </div>
                </div>
            </div>

            {/* ================= SUBSCRIPTION HISTORY ================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">

                {/* Header */}

                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#039A63]">
                            <CreditCard size={18} />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-gray-800">
                                পেমেন্ট ইতিহাস
                            </h3>

                            <p className="text-xs text-gray-500">
                                এই ভাটার সকল পেমেন্ট ও সাবস্ক্রিপশনের বিস্তারিত তথ্য
                            </p>
                        </div>
                    </div>
                </div>

                {vata.subscriptionPayments?.length ? (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px] text-left">

                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        #
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        পেমেন্ট
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        ফোন নম্বর
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        পেমেন্টের তারিখ
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        পেমেন্ট মাধ্যম
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        Transaction ID
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        সাবস্ক্রিপশন
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                                        স্ট্যাটাস
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {vata.subscriptionPayments.map(
                                    (
                                        subscription: TSubscription,
                                        index: number,
                                    ) => {
                                        const paymentStatus =
                                            getPaymentStatus(
                                                subscription.status,
                                            );

                                        const PaymentStatusIcon =
                                            paymentStatus.icon;

                                        return (
                                            <tr
                                                key={
                                                    subscription.id
                                                }
                                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70"
                                            >
                                                {/* Serial */}

                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>

                                                {/* Amount */}

                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">
                                                            {formatCurrency(
                                                                subscription.amount,
                                                            )}
                                                        </p>

                                                        <p className="mt-0.5 text-[11px] text-gray-400">
                                                            সাবস্ক্রিপশন
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Phone */}

                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {subscription.phoneNumber ||
                                                            "—"}
                                                    </p>
                                                </td>

                                                {/* Payment Date */}

                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {formatDate(
                                                            subscription.paidAt,
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-gray-400">
                                                        পেমেন্ট করা হয়েছে
                                                    </p>
                                                </td>

                                                {/* Payment Method */}

                                                <td className="px-4 py-4">
                                                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                                                        {subscription.paymentMethod ||
                                                            "—"}
                                                    </span>
                                                </td>

                                                {/* Transaction ID */}

                                                <td className="px-4 py-4">
                                                    <div className="max-w-[170px]">
                                                        <p
                                                            className="truncate text-xs font-semibold text-gray-700"
                                                            title={
                                                                subscription.transactionId ||
                                                                ""
                                                            }
                                                        >
                                                            {subscription.transactionId ||
                                                                "—"}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Subscription Period */}

                                                <td className="px-4 py-4">
                                                    <div className="space-y-1">

                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[11px] text-gray-400">
                                                                শুরু:
                                                            </span>

                                                            <span className="text-xs font-medium text-gray-700">
                                                                {formatDate(
                                                                    subscription.startDate,
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[11px] text-gray-400">
                                                                শেষ:
                                                            </span>

                                                            <span className="text-xs font-medium text-gray-700">
                                                                {formatDate(
                                                                    subscription.endDate,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status */}

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatus.color}`}
                                                    >
                                                        <PaymentStatusIcon
                                                            size={13}
                                                        />

                                                        {
                                                            paymentStatus.label
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10">

                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                            <CreditCard size={20} />
                        </div>

                        <p className="text-sm font-medium text-gray-600">
                            কোনো পেমেন্ট ইতিহাস নেই
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            এখনো কোনো পেমেন্ট বা সাবস্ক্রিপশন পাওয়া যায়নি।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}