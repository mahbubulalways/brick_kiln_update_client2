"use client";

import { IDueResponse } from "@/interface/due";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

interface A4DueCollectionPrintProps {
    dueInfo: IDueResponse;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
    compact?: boolean;
}

export default function A4DueCollectionPrint({
    dueInfo,
    vataInformation,
    copyType = "customer",
    compact = false,
}: A4DueCollectionPrintProps) {
    const isOffice = copyType === "office";
    const due = Number(dueInfo?.due ?? 0);
    const collect = Number(dueInfo?.collect ?? 0);
    const currentDue = due - collect;

    const shortForm =
        vataInformation?.shortForm?.split("").join(".") || "";

    return (
        <div className="due-print-wrapper w-full bg-white text-[#171717]">
            <div
                className={`due-paper relative mx-auto w-full overflow-hidden ${compact ? "px-3 py-2" : "px-5 py-4 sm:px-7 sm:py-5"
                    }`}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
                >
                    <span
                        className="rotate-[-18deg] whitespace-nowrap font-black text-[#8B3158] opacity-[0.035]"
                        style={{
                            fontSize: compact ? "110px" : "170px",
                        }}
                    >
                        {shortForm}
                    </span>
                </div>

                <div className="pointer-events-none absolute inset-[5px] border border-[#8B3158]" />

                <div className="relative z-10 p-2">
                    <div
                        className={`flex items-start justify-between gap-3 ${compact ? "mb-2" : "mb-3"
                            }`}
                    >
                        <div
                            className={`flex shrink-0 items-center justify-center rounded-lg border-2 border-[#8B3158] bg-[#F8E9EF] font-black leading-none text-[#8B3158] ${compact
                                    ? "h-8 w-[68px] text-[18px]"
                                    : "h-11 w-[86px] text-[23px]"
                                }`}
                        >
                            {shortForm}
                        </div>

                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <div
                                className={`font-bold tracking-wide text-[#8B3158] ${compact ? "text-[8px]" : "text-[10px]"
                                    }`}
                            >
                                হিসাবের রশিদ
                            </div>

                            <h1
                                className={`font-black leading-none text-[#8B3158] ${compact
                                        ? "mt-0.5 text-[20px]"
                                        : "mt-0.5 text-[27px] sm:text-[32px]"
                                    }`}
                            >
                                জমা রশিদ
                            </h1>
                        </div>

                        <div
                            className={`shrink-0 text-right leading-tight ${compact
                                    ? "text-[8px]"
                                    : "text-[10px] sm:text-[12px]"
                                }`}
                        >
                            <p className="font-bold text-[#8B3158]">
                                প্রোঃ {vataInformation?.ownerName}
                            </p>

                            <p className="mt-0.5 font-semibold text-gray-600">
                                {vataInformation?.ownerPhoneNumber}
                            </p>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2
                            className={`font-black leading-none tracking-tight text-[#8B3158] ${compact
                                    ? "text-[23px]"
                                    : "text-[30px] sm:text-[40px]"
                                }`}
                        >
                            {vataInformation?.nameBangla}
                        </h2>

                        <p
                            className={`font-medium text-[#8B3158] ${compact
                                    ? "mt-1 text-[8px]"
                                    : "mt-1 text-[9px] sm:text-[12px]"
                                }`}
                        >
                            {vataInformation?.shortDescription}
                        </p>
                    </div>

                    <div
                        className={`mt-2 rounded-md bg-[#8B3158] text-center font-semibold leading-tight text-white ${compact
                                ? "px-3 py-1.5 text-[8px]"
                                : "px-3 py-2 text-[9px] sm:text-[12px]"
                            }`}
                    >
                        {vataInformation?.additionalAddress}

                        {vataInformation?.additionalAddress &&
                            vataInformation?.address
                            ? ", "
                            : ""}

                        {vataInformation?.address}
                    </div>

                    <div
                        className={`flex flex-wrap items-center justify-center text-center font-semibold text-[#8B3158] ${compact
                                ? "mt-1.5 gap-x-4 gap-y-0.5 text-[8px]"
                                : "mt-2 gap-x-5 gap-y-1 text-[9px] sm:text-[12px]"
                            }`}
                    >
                        {vataInformation?.challanPersonOneName && (
                            <span>
                                {vataInformation.challanPersonOneName}:{" "}
                                {vataInformation.challanPersonOnePhoneNumber}
                            </span>
                        )}

                        {vataInformation?.challanPersonTwoName && (
                            <span>
                                {vataInformation.challanPersonTwoName}:{" "}
                                {vataInformation.challanPersonTwoPhoneNumber}
                            </span>
                        )}

                        {vataInformation?.challanManagerPhoneNumber && (
                            <span>
                                ম্যানেজারঃ{" "}
                                {vataInformation.challanManagerPhoneNumber}
                            </span>
                        )}
                    </div>

                    <div
                        className={`mt-2 flex items-center justify-between gap-4 border-y border-[#8B3158]/30 font-semibold ${compact
                                ? "py-1 text-[8px]"
                                : "py-1.5 text-[10px] sm:text-[12px]"
                            }`}
                    >
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#8B3158]">
                                কাস্টমার আইডি
                            </span>

                            <span className="text-gray-400">|</span>

                            <span>
                                {toBanglaNumber(
                                    dueInfo?.customer?.customerCode ?? "-"
                                )}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#8B3158]">
                                তারিখ
                            </span>

                            <span className="text-gray-400">|</span>

                            <span>
                                {formatBanglaDate({
                                    date: dueInfo?.createdAt,
                                    showTime: false,
                                })}
                            </span>
                        </div>
                    </div>

                    <div
                        className={`rounded-lg border border-[#8B3158]/20 bg-[#F8E9EF]/30 ${compact ? "mt-2 p-2" : "mt-3 p-3"
                            }`}
                    >
                        <div
                            className={`mb-1.5 font-bold text-[#8B3158] ${compact
                                    ? "text-[8px]"
                                    : "text-[10px] sm:text-[12px]"
                                }`}
                        >
                            গ্রাহকের তথ্য
                        </div>

                        <div
                            className={`grid grid-cols-[48px_10px_1fr] items-end ${compact
                                    ? "gap-y-1 text-[8px]"
                                    : "gap-y-1.5 text-[10px] sm:text-[12px]"
                                }`}
                        >
                            <span className="font-bold">নাম</span>

                            <span className="text-center font-bold">:</span>

                            <span className="min-h-[18px] border-b border-dotted border-[#8B3158]/40 font-semibold leading-[14px]">
                                {dueInfo?.customer?.name || "-"}
                            </span>

                            <span className="font-bold">ঠিকানা</span>

                            <span className="text-center font-bold">:</span>

                            <span className="min-h-[18px] border-b border-dotted border-[#8B3158]/40 font-semibold leading-[14px]">
                                {dueInfo?.customer?.address || "-"}
                            </span>

                            <span className="font-bold">মোবাইল</span>

                            <span className="text-center font-bold">:</span>

                            <span className="min-h-[18px] border-b border-dotted border-[#8B3158]/40 font-semibold leading-[14px]">
                                {dueInfo?.customer?.phoneNumber
                                    ? toBanglaNumber(
                                        dueInfo.customer.phoneNumber
                                    )
                                    : "-"}
                            </span>
                        </div>
                    </div>

                    <div
                        className={`grid grid-cols-2 ${compact ? "mt-3 gap-2" : "mt-4 gap-4"
                            }`}
                    >
                        <div
                            className={`rounded-lg border border-gray-200 ${compact ? "p-2" : "p-3"
                                }`}
                        >
                            <div
                                className={`border-b border-gray-200 pb-1 font-bold text-[#8B3158] ${compact
                                        ? "text-[8px]"
                                        : "text-[11px] sm:text-[12px]"
                                    }`}
                            >
                                লেনদেনের তথ্য
                            </div>

                            <div
                                className={`space-y-2 ${compact
                                        ? "mt-2 text-[8px]"
                                        : "mt-3 text-[10px] sm:text-[11px]"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span>জমা তারিখ</span>

                                    <span className="font-semibold">
                                        {formatBanglaDate({
                                            date: dueInfo?.createdAt,
                                            showTime: false,
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span>সময়</span>

                                    <span className="font-semibold">
                                        {formatBanglaDate({
                                            date: dueInfo?.createdAt,
                                            showTime: true,
                                            showDate: false,
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span>পেমেন্ট মাধ্যম</span>

                                    <span className="rounded-full bg-[#F8E9EF] px-2 py-0.5 font-bold text-[#8B3158]">
                                        নগদ
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`rounded-lg border border-[#8B3158]/25 bg-[#F8E9EF]/40 ${compact ? "p-2" : "p-3"
                                }`}
                        >
                            <div
                                className={`border-b border-[#8B3158]/20 pb-1 font-bold text-[#8B3158] ${compact
                                        ? "text-[8px]"
                                        : "text-[11px] sm:text-[12px]"
                                    }`}
                            >
                                হিসাবের বিবরণ
                            </div>

                            <div
                                className={`space-y-2 ${compact
                                        ? "mt-2 text-[8px]"
                                        : "mt-3 text-[10px] sm:text-[11px]"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span>মোট বাকি ছিল</span>

                                    <span className="font-semibold">
                                        ৳{" "}
                                        {toBanglaNumber(
                                            due.toLocaleString("en-IN")
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span>জমা দেওয়া</span>

                                    <span className="font-bold text-[#8B3158]">
                                        ৳{" "}
                                        {toBanglaNumber(
                                            collect.toLocaleString("en-IN")
                                        )}
                                    </span>
                                </div>

                                <div className="border-t border-[#8B3158]/20" />

                                <div className="flex items-center justify-between gap-2 font-black">
                                    <span>বর্তমান বাকি</span>

                                    <span className="text-red-600">
                                        ৳{" "}
                                        {toBanglaNumber(
                                            currentDue.toLocaleString("en-IN")
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`flex items-center justify-between rounded-lg border border-[#8B3158]/30 bg-[#F8E9EF] ${compact
                                ? "mt-2 px-3 py-1.5"
                                : "mt-3 px-4 py-2"
                            }`}
                    >
                        <span
                            className={`font-bold text-[#8B3158] ${compact
                                    ? "text-[8px]"
                                    : "text-[10px] sm:text-[12px]"
                                }`}
                        >
                            এই রশিদে জমা
                        </span>

                        <span
                            className={`font-black text-[#8B3158] ${compact
                                    ? "text-[13px]"
                                    : "text-[17px] sm:text-[20px]"
                                }`}
                        >
                            ৳{" "}
                            {toBanglaNumber(
                                collect.toLocaleString("en-IN")
                            )}
                        </span>
                    </div>

                    <div
                        className={`grid grid-cols-2 gap-10 ${compact ? "mt-6" : "mt-9"
                            }`}
                    >
                        <div className="text-center">
                            <div className="border-t border-dotted border-gray-700" />

                            <p
                                className={`mt-1 font-semibold text-gray-700 ${compact ? "text-[7px]" : "text-[10px]"
                                    }`}
                            >
                                গ্রাহকের স্বাক্ষর
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="border-t border-dotted border-gray-700" />

                            <p
                                className={`mt-1 font-semibold text-gray-700 ${compact ? "text-[7px]" : "text-[10px]"
                                    }`}
                            >
                                ম্যানেজারের স্বাক্ষর
                            </p>
                        </div>
                    </div>

                    <div
                        className={`border-t border-[#8B3158]/20 text-center ${compact ? "mt-2 pt-1" : "mt-3 pt-1.5"
                            }`}
                    >
                        <p
                            className={`italic font-medium text-[#8B3158] ${compact ? "text-[7px]" : "text-[9px]"
                                }`}
                        >
                            লেনদেনের জন্য এই রশিদটি সংরক্ষণ করুন
                        </p>
                    </div>

                    <div
                        className={`text-center font-black tracking-wide text-[#8B3158] ${compact
                                ? "mt-1 px-2 py-0.5 text-[8px]"
                                : "mt-1 px-2.5 py-1 text-[10px]"
                            }`}
                    >
                        {isOffice ? "অফিস কপি" : "কাস্টমার কপি"}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .due-paper {
                    font-family:
                        "Anek Bangla",
                        "Noto Sans Bengali",
                        "Hind Siliguri",
                        sans-serif;
                    box-sizing: border-box;
                }

                .due-print-wrapper {
                    width: 100%;
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }

                @media print {
                    .due-print-wrapper,
                    .due-paper {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }

                    .due-paper {
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </div>
    );
}