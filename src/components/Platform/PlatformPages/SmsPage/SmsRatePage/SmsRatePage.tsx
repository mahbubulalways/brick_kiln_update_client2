"use client";

import SmsRateModal from "@/components/Platform/PlatformModals/SmsRateModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useGetSmsRateQuery } from "@/redux/system.features/system.sms.features";
import {
    MessageSquareText,
    Smartphone,
    WalletCards,
    Settings2,
    ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function SmsRatePage() {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetSmsRateQuery(undefined);

    if (isLoading) {
        return <CustomLoader cls="h-[30vh]" />;
    }

    if (isError) {
        console.log(error);
        return <CustomStatus type="error" />;
    }

    const smsRate = data?.data;

    return (
        <div className="min-h-[80vh] rounded-xl bg-white p-5 md:p-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-7">
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63]">
                            <Settings2 size={20} />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                এসএমএস ও পেমেন্ট সেটিংস
                            </h1>

                            <p className="text-sm text-gray-500">
                                এসএমএস রেট এবং পেমেন্ট নম্বর পরিচালনা করুন
                            </p>
                        </div>
                    </div>
                </div>

                {/* SMS Rate */}
                <div className="relative mb-5 overflow-hidden rounded-2xl border border-[#039A63]/20 bg-white shadow-sm">
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#039A63]/5 blur-2xl" />

                    <div className="relative flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63]">
                                <MessageSquareText size={23} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    বর্তমান এসএমএস রেট
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {smsRate?.ratePerSms ?? 0}
                                    <span className="ml-1 text-sm font-medium text-gray-500">
                                        টাকা / এসএমএস
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="hidden rounded-full bg-[#039A63]/10 px-3 py-1 text-xs font-medium text-[#039A63] sm:block">
                            Active
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                পেমেন্ট নম্বর
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500">
                                গ্রাহকের পেমেন্টের জন্য ব্যবহৃত নম্বর
                            </p>
                        </div>

                        <WalletCards
                            size={20}
                            className="text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {/* bKash */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#039A63]/30 hover:bg-[#039A63]/5">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                                    <Smartphone
                                        size={18}
                                        className="text-[#039A63]"
                                    />
                                </div>

                                <span className="text-xs text-gray-400">
                                    bKash
                                </span>
                            </div>

                            <p className="text-xs text-gray-500">
                                বিকাশ
                            </p>

                            <p className="mt-1 truncate text-base font-semibold text-gray-900">
                                {smsRate?.bkash || "সেট করা হয়নি"}
                            </p>
                        </div>

                        {/* Rocket */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#039A63]/30 hover:bg-[#039A63]/5">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                                    <Smartphone
                                        size={18}
                                        className="text-[#039A63]"
                                    />
                                </div>

                                <span className="text-xs text-gray-400">
                                    Rocket
                                </span>
                            </div>

                            <p className="text-xs text-gray-500">
                                রকেট
                            </p>

                            <p className="mt-1 truncate text-base font-semibold text-gray-900">
                                {smsRate?.rocket || "সেট করা হয়নি"}
                            </p>
                        </div>

                        {/* Nagad */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#039A63]/30 hover:bg-[#039A63]/5">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                                    <Smartphone
                                        size={18}
                                        className="text-[#039A63]"
                                    />
                                </div>

                                <span className="text-xs text-gray-400">
                                    Nagad
                                </span>
                            </div>

                            <p className="text-xs text-gray-500">
                                নগদ
                            </p>

                            <p className="mt-1 truncate text-base font-semibold text-gray-900">
                                {smsRate?.nogod || "সেট করা হয়নি"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings Button */}
                <button
                    onClick={() => setOpenModal(true)}
                    className="group flex w-full cursor-pointer items-center
                     justify-center gap-2 rounded-xl bg-[#039A63] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#028755] hover:shadow-md"
                >
                 
                        <Settings2 size={19} />

                        <span>সেটিংস পরিবর্তন করুন</span>
              

                    <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </button>
            </div>

            {openModal && (
                <SmsRateModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </div>
    );
}