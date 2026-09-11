"use client";

import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { TVataResponse } from "@/interface/vata";
import { useGetMyVataInformationQuery } from "@/redux/features/vata.features";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import {
    FiCalendar,
    FiCreditCard,
    FiFileText,
    FiInfo,
    FiMapPin,
    FiMessageSquare,
    FiPhone,
    FiUser,
} from "react-icons/fi";
import { MdOutlineStorefront } from "react-icons/md";

type InfoCardProps = {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
    fullWidth?: boolean;
    valueClass?: string;
};

type ContactCardProps = {
    title: string;
    name?: string | null;
    phone?: string | null;
};

type BillingCardProps = {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
    badge?: boolean;
    highlight?: boolean;
};

type SummaryRowProps = {
    label: string;
    value?: string | number | null;
};

const VataInformation = () => {
    const { isError, isLoading, data } =
        useGetMyVataInformationQuery(undefined);

    const information = data?.data as TVataResponse;

    if (isLoading) {
        return <CustomLoader cls="h-[50vh]" />;
    }

    if (isError) {
        return <CustomStatus type="error" />;
    }

    return (
        <div className="w-full rounded-xl bg-white px-1 py-1 md:p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#039A63] text-white shadow-sm">
                    <FiInfo className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-gray-900">
                        প্রতিষ্ঠানের তথ্য
                    </h1>

                    <p className="mt-1 text-sm text-gray-400">
                        আপনার ভাটা, যোগাযোগ এবং বিলিং সংক্রান্ত সম্পূর্ণ তথ্য
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
                <div className="space-y-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <MdOutlineStorefront className="h-5 w-5 text-[#039A63]" />

                                <h2 className="text-lg font-semibold text-gray-700">
                                    ব্যবসার বিবরণ
                                </h2>
                            </div>

                            {information?.shortForm && (
                                <span className="rounded-lg border border-[#039A63]/20 bg-[#039A63]/10 px-3 py-1 text-sm font-bold text-[#039A63]">
                                    {information.shortForm}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard
                                icon={
                                    <MdOutlineStorefront className="h-4 w-4" />
                                }
                                label="ভাটার নাম (বাংলা)"
                                value={information?.nameBangla}
                            />

                            <InfoCard
                                icon={
                                    <MdOutlineStorefront className="h-4 w-4" />
                                }
                                label="ভাটার নাম (ইংরেজি)"
                                value={information?.nameEnglish}
                            />

                            <InfoCard
                                icon={<FiCreditCard className="h-4 w-4" />}
                                label="ভাটা আইডি"
                                value={information?.vataId}
                                valueClass="text-[#039A63]"
                            />

                            <InfoCard
                                icon={<FiFileText className="h-4 w-4" />}
                                label="সংক্ষিপ্ত নাম"
                                value={information?.shortForm}
                            />

                            <InfoCard
                                icon={<FiMapPin className="h-4 w-4" />}
                                label="ঠিকানা (চালান অনুযায়ী)"
                                value={information?.address}
                                fullWidth
                            />

                            <InfoCard
                                icon={<FiMapPin className="h-4 w-4" />}
                                label="অতিরিক্ত ঠিকানা"
                                value={information?.additionalAddress}
                                fullWidth
                            />

                            <InfoCard
                                icon={<FiUser className="h-4 w-4" />}
                                label="মালিকের নাম"
                                value={information?.ownerName}
                            />

                            <InfoCard
                                icon={<FiPhone className="h-4 w-4" />}
                                label="মালিকের ফোন নম্বর"
                                value={information?.ownerPhoneNumber}
                            />

                            <InfoCard
                                icon={<FiMessageSquare className="h-4 w-4" />}
                                label="সংক্ষিপ্ত বিবরণ"
                                value={information?.shortDescription}
                                fullWidth
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <FiPhone className="h-5 w-5 text-blue-500" />

                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">
                                    চালান ও যোগাযোগ
                                </h2>

                                <p className="mt-0.5 text-xs text-gray-400">
                                    চালান সংক্রান্ত যোগাযোগের নম্বর ও ব্যক্তিদের
                                    তথ্য
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard
                                icon={<FiPhone className="h-4 w-4" />}
                                label="চালান ম্যানেজার ফোন নম্বর"
                                value={
                                    information?.challanManagerPhoneNumber
                                }
                                valueClass="text-blue-600"
                            />

                            <ContactCard
                                title="চালান ব্যক্তি ১"
                                name={information?.challanPersonOneName}
                                phone={
                                    information?.challanPersonOnePhoneNumber
                                }
                            />

                            <ContactCard
                                title="চালান ব্যক্তি ২"
                                name={information?.challanPersonTwoName}
                                phone={
                                    information?.challanPersonTwoPhoneNumber
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <FiCreditCard className="h-5 w-5 text-[#039A63]" />

                            <h2 className="text-lg font-semibold text-gray-700">
                                বিলিং তথ্য
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <BillingCard
                                icon={<FiCreditCard className="h-4 w-4" />}
                                label="ক্লায়েন্ট আইডি"
                                value={information?.vataId}
                                badge
                            />

                            <BillingCard
                                icon={<FiCreditCard className="h-4 w-4" />}
                                label="সাবস্ক্রিপশন প্ল্যান"
                                value={information?.subscriptionPlan?.name}
                            />

                            <BillingCard
                                icon={<FiCreditCard className="h-4 w-4" />}
                                label="বিলিং সাইকেল"
                                value={
                                    information?.subscriptionPlan?.billingCycle
                                }
                            />

                            <BillingCard
                                icon={<FiCreditCard className="h-4 w-4" />}
                                label="সফটওয়্যার ফি"
                                value={`৳ ${information?.subscriptionPlan?.price}`}
                                highlight
                            />

                            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
                                        <FiCalendar className="h-4 w-4" />
                                    </div>

                                    <span className="text-sm font-semibold text-orange-600">
                                        পরবর্তী পেমেন্ট
                                    </span>
                                </div>

                                <p className="text-center text-2xl font-bold text-orange-500">
                                    {information?.nextPaymentDate
                                        ? formatBanglaDate({
                                            date: information.nextPaymentDate,
                                        })
                                        : "তথ্য নেই"}
                                </p>

                                <p className="mt-2 text-center text-xs text-orange-400">
                                    পরবর্তী বিল পরিশোধের তারিখ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#039A63]/10 bg-[#039A63]/5 p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#039A63] text-white">
                                <FiInfo className="h-5 w-5" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700">
                                    প্রতিষ্ঠানের সারাংশ
                                </h3>

                                <p className="text-xs text-gray-400">
                                    গুরুত্বপূর্ণ তথ্য
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <SummaryRow
                                label="ভাটার নাম"
                                value={
                                    information?.nameBangla ||
                                    information?.nameEnglish
                                }
                            />

                            <SummaryRow
                                label="মালিক"
                                value={information?.ownerName}
                            />

                            <SummaryRow
                                label="ভাটা আইডি"
                                value={information?.vataId}
                            />

                            <SummaryRow
                                label="প্ল্যান"
                                value={information?.subscriptionPlan?.name}
                            />

                            <SummaryRow
                                label="বিলিং"
                                value={
                                    information?.subscriptionPlan?.billingCycle
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                <p className="text-sm leading-5 text-gray-400">
                    ভাটার তথ্য পরিবর্তনের প্রয়োজন হলে অ্যাডমিনের সাথে যোগাযোগ
                    করুন। প্রতিষ্ঠানের তথ্য শুধুমাত্র অনুমোদিত ব্যক্তির মাধ্যমে
                    পরিবর্তন করা যাবে।
                </p>
            </div>
        </div>
    );
};

const InfoCard = ({
    icon,
    label,
    value,
    fullWidth = false,
    valueClass = "text-gray-700",
}: InfoCardProps) => {
    return (
        <div
            className={`rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200 hover:bg-white ${fullWidth ? "md:col-span-2" : ""
                }`}
        >
            <div className="mb-2 flex items-center gap-2">
                <span className="text-gray-400">{icon}</span>

                <span className="text-sm font-medium text-gray-400">
                    {label}
                </span>
            </div>

            <p
                className={`break-words text-[15px] font-semibold ${valueClass}`}
            >
                {value || "তথ্য নেই"}
            </p>
        </div>
    );
};

const ContactCard = ({
    title,
    name,
    phone,
}: ContactCardProps) => {
    return (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                    <FiUser className="h-4 w-4" />
                </div>

                <span className="text-sm font-semibold text-blue-600">
                    {title}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">
                        নাম
                    </span>

                    <span className="text-right text-sm font-semibold text-gray-700">
                        {name || "তথ্য নেই"}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">
                        ফোন
                    </span>

                    <span className="text-right text-sm font-semibold text-blue-600">
                        {phone || "তথ্য নেই"}
                    </span>
                </div>
            </div>
        </div>
    );
};

const BillingCard = ({
    icon,
    label,
    value,
    badge = false,
    highlight = false,
}: BillingCardProps) => {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-gray-400">{icon}</span>

                <span className="text-sm font-medium text-gray-400">
                    {label}
                </span>
            </div>

            {badge ? (
                <span className="inline-flex rounded-lg border border-[#039A63]/20 bg-[#039A63]/10 px-3 py-1.5 text-sm font-bold text-[#039A63]">
                    {value || "তথ্য নেই"}
                </span>
            ) : (
                <p
                    className={`text-base font-semibold ${highlight
                        ? "text-[#039A63]"
                        : "text-gray-700"
                        }`}
                >
                    {value || "তথ্য নেই"}
                </p>
            )}
        </div>
    );
};

const SummaryRow = ({
    label,
    value,
}: SummaryRowProps) => {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-[#039A63]/10 pb-2 last:border-0 last:pb-0">
            <span className="text-sm text-gray-400">
                {label}
            </span>

            <span className="max-w-[65%] truncate text-right text-sm font-semibold text-gray-700">
                {value || "তথ্য নেই"}
            </span>
        </div>
    );
};

export default VataInformation;