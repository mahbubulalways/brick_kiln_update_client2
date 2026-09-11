"use client";

import BkashSmsPurchaseModal from "@/components/Dashboard/Modals/BkashSmsPurchaseModal";
import ManualSmsPurchaseModal from "@/components/Dashboard/Modals/ManualSmsPurchaseModal";
import { useGetMyVataSmsInfoQuery } from "@/redux/features/sms.features";
import { useGetSmsRateQuery } from "@/redux/system.features/system.sms.features";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import {
    MessageSquareText,
    Send,
    ShoppingCart,
    WalletCards,
    ArrowRight,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export type TSmsWallet = {
    id: string;
    vataId: string;
    balance: number;
    currentRate: number;
    totalPurchased: number;
    totalUsed: number;
    createdAt: string;
    updatedAt: string;
};
export default function SmsPage() {
    const { isLoading, data } = useGetSmsRateQuery(undefined);
    const [openManualModal, setOpenManualModal] = useState<boolean>(false)
    const smsInfo = data?.data
    const smsRate = Number(smsInfo?.ratePerSms ?? 0);
    const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
    const { data: vatarSms, isLoading: vatarSmsLoading } = useGetMyVataSmsInfoQuery(undefined)
    const totalSentSms = 8750;

    const currentSmsInfo = vatarSms?.data as TSmsWallet || {}
    return (
        <div className="min-h-[80vh] rounded-xl bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-7">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        এসএমএস
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        আপনার এসএমএস ব্যালেন্স ও ব্যবহারের তথ্য দেখুন
                    </p>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-5">
                    <div className="flex flex-col gap-5 lg:col-span-3">
                        <div className="relative overflow-hidden rounded-2xl bg-[#039A63] px-4 py-7 text-white shadow-sm">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

                            <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-white/5" />

                            <div className="relative">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-white/75">
                                            বর্তমান এসএমএস ব্যালেন্স
                                        </p>

                                        <div className="mt-3 flex items-end gap-2">
                                            <span className="text-4xl font-bold">
                                                {toBanglaNumber(currentSmsInfo?.totalPurchased - currentSmsInfo?.totalUsed || 0)}
                                            </span>

                                            <span className="mb-1 text-sm text-white/75">
                                                SMS
                                                {/* {currentSmsInfo?.balance} */}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                        <MessageSquareText size={24} />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
                                    <TrendingUp size={16} />

                                    <span>
                                        প্রতি এসএমএস রেট:{" "}
                                        <span className="font-semibold text-white">
                                            ৳{toBanglaNumber(currentSmsInfo?.currentRate || smsInfo?.ratePerSms || 0)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            মোট পাঠানো এসএমএস
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            {toBanglaNumber(currentSmsInfo?.totalUsed || 0)}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            সর্বমোট পাঠানো
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Send size={21} />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            বর্তমান এসএমএস রেট
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            ৳{toBanglaNumber(smsRate)}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            প্রতি এসএমএস
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                                        <WalletCards size={21} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Link
                                href={`/dashboard/sms/sms-history`}
                                className="w-full"
                            >
                                <button
                                    onClick={() => { }}
                                    className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Send size={20} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            পাঠানো SMS
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            পাঠানো সব SMS দেখুন
                                        </p>
                                    </div>

                                    <ArrowRight
                                        size={19}
                                        className="text-gray-400 transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                            </Link>

                            <Link href={`/dashboard/sms/history`}
                            >
                                <button
                                    onClick={() => { }}
                                    className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-[#039A63]/30 hover:shadow-md"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63]">
                                        <ShoppingCart size={20} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            ক্রয় হিস্টোরি
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            SMS কেনার ইতিহাস দেখুন
                                        </p>
                                    </div>

                                    <ArrowRight
                                        size={19}
                                        className="text-gray-400 transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex h-full col-span-2">
                        <div className="flex h-full w-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div>
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#039A63]/10 text-[#039A63]">
                                    <ShoppingCart size={24} />
                                </div>

                                <h2 className="text-xl font-semibold text-gray-900">
                                    আরও এসএমএস কিনুন
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    আপনার প্রয়োজন অনুযায়ী নতুন এসএমএস কিনে
                                    নিন। প্রতিটি এসএমএসের বর্তমান মূল্য নিচে
                                    দেখানো হয়েছে।
                                </p>

                                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                                    <p className="text-sm text-gray-500">
                                        বর্তমান এসএমএস রেট
                                    </p>

                                    <div className="mt-2 flex items-end gap-2">
                                        {isLoading ? (
                                            <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200" />
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold text-gray-900">
                                                    ৳{toBanglaNumber(smsRate)}
                                                </span>

                                                <span className="mb-1 text-sm text-gray-500">
                                                    / SMS
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <p className="mt-2 text-xs text-gray-400">
                                        এই রেট অনুযায়ী নতুন SMS কিনতে পারবেন
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    onClick={() => setOpenManualModal(true)}
                                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#039A63] bg-white px-4 py-3.5 text-sm font-semibold text-[#039A63] transition hover:bg-[#039A63]/5"
                                >
                                    <ShoppingCart size={18} />

                                    <span>ম্যানুয়ালি কিনুন</span>
                                </button>

                                <button
                                    onClick={() => setIsBkashModalOpen(true)}
                                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#039A63] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#028755]"
                                >
                                    <WalletCards size={18} />

                                    <span>BKash দিয়ে কিনুন</span>

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                openManualModal &&
                <ManualSmsPurchaseModal
                    info={
                        {
                            bkash: smsInfo?.bkash,
                            nogod: smsInfo?.nogod,
                            rocket: smsInfo?.rocket,
                            smsRate: smsInfo?.ratePerSms
                        }
                    }
                    isOpen={openManualModal}
                    onClose={() => setOpenManualModal(false)}
                />
            }

            {
                isBkashModalOpen &&
                <BkashSmsPurchaseModal
                    isOpen={isBkashModalOpen}
                    onClose={() => setIsBkashModalOpen(false)}
                    smsPrice={smsInfo?.ratePerSms}
                />
            }
        </div >
    );
}