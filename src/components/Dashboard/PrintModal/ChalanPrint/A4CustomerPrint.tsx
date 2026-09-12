"use client";

import { useMemo } from "react";

import { TVataInformation } from "@/interface/vata";
import {
    IChallanForDataShow,
    TChallanItem,
    TClassAndRate,
} from "@/types/types";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { numberToBanglaWords } from "@/utils/numberToBanglaWord";

interface A4CustomerPrintProps {
    invoice: IChallanForDataShow;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
    compact?: boolean;
    classes: TClassAndRate[];
}

const toBanglaNumber = (value: number | string) =>
    String(value ?? 0).replace(
        /\d/g,
        (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)],
    );

const normalizeClassName = (value?: string | null) =>
    value?.trim().toLowerCase() || "";

const A4CustomerPrint = ({
    invoice,
    vataInformation,
    copyType = "customer",
    compact = false,
    classes,
}: A4CustomerPrintProps) => {
    const challanItems = invoice?.items || [];

    const classRows = useMemo(() => {
        return (classes || []).map((classItem, index) => {
            const matchedItems = challanItems.filter(
                (item: TChallanItem) =>
                    normalizeClassName(item?.class) ===
                    normalizeClassName(classItem?.className),
            );

            const quantity = matchedItems.reduce(
                (total, item: any) =>
                    total + Number(item?.quantity || 0),
                0,
            );

            const rate =
                classItem?.rate ??
                matchedItems[0]?.rate ??
                0;

            const price = matchedItems.reduce(
                (total, item: any) =>
                    total +
                    Number(item?.quantity || 0) *
                    Number(rate || 0),
                0,
            );

            return {
                key:
                    classItem?.id ||
                    `${classItem?.className}-${index}`,
                className: classItem?.className || "-",
                quantity,
                rate,
                price,
                purchased: matchedItems.length > 0,
            };
        });
    }, [classes, challanItems]);

    const totalQuantity = challanItems.reduce(
        (total: number, item: any) =>
            total + Number(item?.quantity || 0),
        0,
    );

    return (
        <div
            className={`challan-print-wrapper w-full ${compact ? "challan-compact" : ""
                }`}
        >
            <div
                className={`challan-paper relative mx-auto w-full overflow-hidden bg-[#fffef8] text-[#252525] shadow-md ${compact
                    ? "max-w-[1050px] p-3"
                    : "max-w-[1100px] p-5 sm:p-6"
                    }`}
            >
                <div
                    className={`pointer-events-none absolute border border-[#d9a7bd] ${compact ? "inset-[5px]" : "inset-[6px]"
                        }`}
                />

                <div className="relative z-10">
                    <div
                        className={`flex items-start justify-between ${compact ? "gap-2" : "gap-3"
                            }`}
                    >
                        <div>
                            <div
                                className={`flex items-center justify-center rounded border-2 border-[#8b3158] bg-[#f8e9ef] font-extrabold leading-none text-[#8b3158] ${compact
                                    ? "h-8 w-[68px] text-[18px]"
                                    : "h-10 w-[82px] text-[22px]"
                                    }`}
                            >
                                {vataInformation?.shortForm
                                    ?.split("")
                                    .join(".")}
                            </div>
                        </div>

                        <div
                            className={`rounded-full bg-[#8b3158] text-center font-bold text-white ${compact
                                ? "px-5 py-1 text-[12px]"
                                : "px-5 py-1 text-sm sm:px-8 sm:text-lg"
                                }`}
                        >
                            চালান
                        </div>

                        <div className="text-right leading-tight">
                            <p
                                className={`font-bold text-[#8b3158] ${compact
                                    ? "text-[8px]"
                                    : "text-[10px] sm:text-sm"
                                    }`}
                            >
                                প্রোঃ {vataInformation?.ownerName}
                            </p>

                            <p
                                className={`font-bold text-[#555] ${compact
                                    ? "text-[10px]"
                                    : "text-[12px] sm:text-lg"
                                    }`}
                            >
                                {vataInformation?.ownerPhoneNumber}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`text-center ${compact ? "mt-1" : "mt-2"
                            }`}
                    >
                        <h1
                            className={`font-extrabold leading-none tracking-tight text-[#8b3158] ${compact
                                ? "text-[27px]"
                                : "text-[25px] sm:text-[43px]"
                                }`}
                        >
                            {vataInformation?.nameBangla}
                        </h1>

                        <p
                            className={`font-medium text-[#8b3158] ${compact
                                ? "mt-0.5 text-[8px]"
                                : "mt-2 text-[8px] sm:text-[13px]"
                                }`}
                        >
                            {vataInformation?.shortDescription}
                        </p>
                    </div>

                    <div
                        className={`rounded-sm bg-[#8b3158] text-center font-semibold leading-tight text-white ${compact
                            ? "mt-1 px-3 py-1.5 text-[8px]"
                            : "mt-2 px-3 py-2 text-[8px] sm:text-[12px]"
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
                        className={`flex flex-wrap items-center justify-center text-center font-semibold text-[#8b3158] ${compact
                            ? "mt-1 gap-x-4 gap-y-0.5 text-[9px]"
                            : "mt-1.5 gap-x-4 text-[9px] sm:text-[13px]"
                            }`}
                    >
                        {vataInformation?.challanPersonOneName && (
                            <span>
                                {vataInformation.challanPersonOneName}:{" "}
                                {
                                    vataInformation?.challanPersonOnePhoneNumber
                                }
                            </span>
                        )}

                        {vataInformation?.challanPersonTwoName && (
                            <span>
                                {vataInformation.challanPersonTwoName}:{" "}
                                {
                                    vataInformation?.challanPersonTwoPhoneNumber
                                }
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
                        className={`grid grid-cols-3 items-center ${compact
                            ? "mt-1.5 py-1 text-[9px]"
                            : "mt-2 py-1.5 text-[8px] sm:text-[12px]"
                            }`}
                    >
                        <div className="font-semibold text-[#8b3158]">
                            চালান নংঃ{" "}
                            <span className="font-bold text-[#252525]">
                                {toBanglaNumber(
                                    invoice?.serial || "-",
                                )}
                            </span>
                        </div>

                        <div className="text-center font-bold text-[#8b3158]">
                            {copyType === "office"
                                ? "অফিস কপি"
                                : "কাস্টমার কপি"}
                        </div>

                        <div className="text-right font-semibold text-[#8b3158]">
                            তারিখঃ{" "}
                            <span className="font-bold text-[#252525]">
                                {formatBanglaDate({
                                    date: invoice?.challanDate,
                                }) || "-"}
                            </span>
                        </div>
                    </div>

                    <div className={compact ? "mt-1" : "mt-2"}>
                        <div
                            className={`grid grid-cols-[65px_1fr_65px_1fr] items-end ${compact
                                ? "text-[9px]"
                                : "text-[9px] sm:grid-cols-[90px_1fr_75px_1fr] sm:text-[12px]"
                                }`}
                        >
                            <div className="font-semibold text-[#555]">
                                নামঃ
                            </div>

                            <div
                                className={`border-b border-dotted border-[#777] px-1 font-semibold ${compact
                                    ? "min-h-[20px]"
                                    : "min-h-[23px]"
                                    }`}
                            >
                                {invoice?.customer?.name || "-"}
                            </div>

                            <div className="pl-2 font-semibold text-[#555]">
                                মোবাইলঃ
                            </div>

                            <div
                                className={`border-b border-dotted border-[#777] px-1 font-semibold ${compact
                                    ? "min-h-[20px]"
                                    : "min-h-[23px]"
                                    }`}
                            >
                                {invoice?.customer?.phoneNumber || "-"}
                            </div>
                        </div>

                        <div
                            className={`grid grid-cols-[65px_1fr] items-end ${compact
                                ? "mt-1 text-[9px]"
                                : "mt-1 text-[9px] sm:grid-cols-[90px_1fr] sm:text-[12px]"
                                }`}
                        >
                            <div className="font-semibold text-[#555]">
                                ঠিকানাঃ
                            </div>

                            <div
                                className={`border-b border-dotted border-[#777] px-1 font-semibold ${compact
                                    ? "min-h-[20px]"
                                    : "min-h-[23px]"
                                    }`}
                            >
                                {invoice?.customer?.address || "-"}
                            </div>
                        </div>
                    </div>

                    <div
                        className={`overflow-hidden border border-[#777] ${compact ? "mt-1.5" : "mt-2"
                            }`}
                    >
                        <div
                            className={`grid grid-cols-[1fr_90px_70px_100px] bg-[#8b3158] text-center font-bold text-white sm:grid-cols-[1fr_145px_100px_150px] ${compact
                                ? "text-[9px]"
                                : "text-[9px] sm:text-[13px]"
                                }`}
                        >
                            <div className="border-r border-[#c995aa] py-1">
                                বিবরণ
                            </div>

                            <div className="border-r border-[#c995aa] py-1">
                                পরিমাণ
                            </div>

                            <div className="border-r border-[#c995aa] py-1">
                                দর
                            </div>

                            <div className="py-1">
                                মূল্য
                            </div>
                        </div>

                        <div>
                            {classRows.length > 0 ? (
                                classRows.map((row, index) => (
                                    <div
                                        key={row.key}
                                        className={`grid grid-cols-[1fr_90px_70px_100px] sm:grid-cols-[1fr_145px_100px_150px] ${index % 2 === 1
                                            ? "bg-[#f8e9ef]"
                                            : "bg-white"
                                            }`}
                                    >
                                        <div
                                            className={`border-r border-b border-[#777] px-2 font-semibold text-[#3a150e] ${compact
                                                ? "py-0.5 text-[8px]"
                                                : "py-1 text-[9px] sm:text-[12px]"
                                                }`}
                                        >
                                            {row.className}
                                        </div>

                                        <div
                                            className={`border-r border-b border-[#777] px-2 text-center font-semibold text-[#3a150e] ${compact
                                                ? "py-0.5 text-[8px]"
                                                : "py-1 text-[9px] sm:text-[12px]"
                                                }`}
                                        >
                                            {row.purchased
                                                ? toBanglaNumber(
                                                    row.quantity,
                                                )
                                                : "-"}
                                        </div>

                                        <div
                                            className={`border-r border-b border-[#777] px-2 text-center font-semibold text-[#3a150e] ${compact
                                                ? "py-0.5 text-[8px]"
                                                : "py-1 text-[9px] sm:text-[12px]"
                                                }`}
                                        >
                                            {row.purchased
                                                ? toBanglaNumber(row.rate)
                                                : "-"}
                                        </div>

                                        <div
                                            className={`border-b border-[#777] px-2 text-right font-bold text-[#8b3158] ${compact
                                                ? "py-0.5 text-[8px]"
                                                : "py-1 text-[9px] sm:text-[12px]"
                                                }`}
                                        >
                                            {row.purchased
                                                ? toBanglaNumber(row.price)
                                                : "-"}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-2 text-center text-[9px] font-semibold text-[#8b3158]">
                                    কোনো শ্রেণি পাওয়া যায়নি
                                </div>
                            )}
                        </div>

                        <div
                            className={`grid grid-cols-[1fr_90px_70px_100px] bg-[#f8e9ef] sm:grid-cols-[1fr_145px_100px_150px] ${compact
                                ? "text-[8px]"
                                : "text-[9px] sm:text-[13px]"
                                }`}
                        >
                            <div className="border-r border-[#777] px-2 py-1 font-bold text-[#3a150e]">
                                মোট
                            </div>

                            <div className="border-r border-[#777] px-2 py-1 text-center font-bold text-[#3a150e]">
                                {toBanglaNumber(totalQuantity)}
                            </div>

                            <div className="border-r border-[#777]" />

                            <div className="px-2 py-1 text-right font-extrabold text-[#8b3158]">
                                ৳{" "}
                                {toBanglaNumber(
                                    invoice?.totalPrice || 0,
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className={`flex justify-end ${compact ? "mt-1.5" : "mt-2"
                            }`}
                    >
                        <div
                            className={`overflow-hidden border border-[#777] ${compact
                                ? "w-[245px]"
                                : "w-[260px] sm:w-[330px]"
                                }`}
                        >
                            <div
                                className={`grid grid-cols-[1fr_105px] border-b border-[#777] ${compact
                                    ? "text-[8px]"
                                    : "text-[9px] sm:grid-cols-[1fr_150px] sm:text-[12px]"
                                    }`}
                            >
                                <div className="bg-[#f8e9ef] px-2 py-1 font-bold text-[#3a150e]">
                                    মোট মূল্য
                                </div>

                                <div className="px-2 py-1 text-right font-bold text-[#8b3158]">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoice?.totalPrice || 0,
                                    )}
                                </div>
                            </div>

                            <div
                                className={`grid grid-cols-[1fr_105px] border-b border-[#777] ${compact
                                    ? "text-[8px]"
                                    : "text-[9px] sm:grid-cols-[1fr_150px] sm:text-[12px]"
                                    }`}
                            >
                                <div className="bg-[#f8e9ef] px-2 py-1 font-bold text-[#3a150e]">
                                    জমা
                                </div>

                                <div className="px-2 py-1 text-right font-bold text-[#3a150e]">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoice?.cash || 0,
                                    )}
                                </div>
                            </div>

                            <div
                                className={`grid grid-cols-[1fr_105px] ${compact
                                    ? "text-[8px]"
                                    : "text-[9px] sm:grid-cols-[1fr_150px] sm:text-[12px]"
                                    }`}
                            >
                                <div className="bg-[#8b3158] px-2 py-1 font-bold text-white">
                                    বাকি
                                </div>

                                <div className="bg-[#8b3158] px-2 py-1 text-right font-extrabold text-white">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoice?.due || 0,
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <div className="text-xs font-semibold text-[#8b3158]">
                            কথায়: {numberToBanglaWords(invoice?.cash)} টাকা মাত্র
                        </div>

                        <div className="mt-1 border-b border-dotted border-gray-500" />
                    </div>
                    <div
                        className={`grid grid-cols-3 text-center ${compact
                            ? "mt-3 gap-3"
                            : "mt-4 gap-3"
                            }`}
                    >
                        <div>
                            <div
                                className={`mx-auto max-w-[170px] border-b border-dotted border-[#555] ${compact
                                    ? "h-6 max-w-[150px]"
                                    : "h-8 sm:h-10 sm:max-w-[230px]"
                                    }`}
                            />

                            <p
                                className={`font-semibold text-[#555] ${compact
                                    ? "mt-0.5 text-[7px]"
                                    : "mt-1 text-[8px] sm:text-[11px]"
                                    }`}
                            >
                                ক্রেতার স্বাক্ষর
                            </p>
                        </div>

                        <div>
                            <div
                                className={`mx-auto max-w-[170px] border-b border-dotted border-[#555] ${compact
                                    ? "h-6 max-w-[150px]"
                                    : "h-8 sm:h-10 sm:max-w-[230px]"
                                    }`}
                            />

                            <p
                                className={`font-semibold text-[#555] ${compact
                                    ? "mt-0.5 text-[7px]"
                                    : "mt-1 text-[8px] sm:text-[11px]"
                                    }`}
                            >
                                ম্যানেজার
                            </p>
                        </div>

                        <div>
                            <div
                                className={`mx-auto max-w-[170px] border-b border-dotted border-[#555] ${compact
                                    ? "h-6 max-w-[150px]"
                                    : "h-8 sm:h-10 sm:max-w-[230px]"
                                    }`}
                            />

                            <p
                                className={`font-semibold text-[#555] ${compact
                                    ? "mt-0.5 text-[7px]"
                                    : "mt-1 text-[8px] sm:text-[11px]"
                                    }`}
                            >
                                মালিক
                            </p>
                        </div>
                    </div>

                    <div
                        className={`border-t border-[#8b3158] text-center ${compact ? "mt-1 pt-0.5" : "mt-2 pt-1"
                            }`}
                    >
                        <p
                            className={`font-semibold text-[#777] ${compact
                                ? "text-[7px]"
                                : "text-[7px] sm:text-[10px]"
                                }`}
                        >
                            চালানটি বুঝিয়া পাইলাম
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .challan-paper {
                    font-family:
                        "Anek Bangla",
                        "Noto Sans Bengali",
                        "Hind Siliguri",
                        sans-serif;
                }

                .challan-compact {
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }

                .a4-combined-print {
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }

                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 4mm;
                    }

                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }

                    .a4-combined-print {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }

                    .a4-combined-print .challan-print-wrapper {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    .a4-combined-print .challan-paper {
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }

                    .a4-combined-print
                        .challan-print-wrapper
                        + .border-dashed {
                        margin-top: 2mm !important;
                        margin-bottom: 2mm !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default A4CustomerPrint;