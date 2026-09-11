"use client";

import { TPaymentResponse } from "@/interface/payment";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

interface POS80LedgerPrintProps {
    ledger: TPaymentResponse;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
    compact?: boolean;
}

const POS80LedgerPrint = ({
    ledger,
    vataInformation,
    copyType = "customer",
    compact = false,
}: POS80LedgerPrintProps) => {
    const copyLabel =
        copyType === "office" ? "অফিস কপি" : "কাস্টমার কপি";

    const payment = Number(ledger?.payment ?? 0);

    const formatNumber = (value: unknown) => {
        if (value === null || value === undefined || value === "") {
            return "০";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return "০";
        }

        return number.toLocaleString("bn-BD", {
            maximumFractionDigits: 2,
        });
    };

    return (
        <div className="w-[80mm] text-black">
            <div
                className={`mx-auto w-full px-[2.5mm] ${compact ? "py-[1mm]" : "py-[1.5mm]"
                    }`}
            >
                {/* Header */}
                <div className="text-center">
                    <div
                        className={`mx-auto inline-block border border-black px-2 font-bold leading-none ${compact
                                ? "py-0.5 text-[6.5px]"
                                : "py-0.5 text-[7px]"
                            }`}
                    >
                        {copyLabel}
                    </div>

                    <div
                        className={`font-extrabold leading-none ${compact
                                ? "mt-1 text-[14px]"
                                : "mt-1 text-[16px]"
                            }`}
                    >
                        ক্যাশ ভাউচার
                    </div>

                    <div
                        className={`font-extrabold leading-none ${compact
                                ? "mt-0.5 text-[14px]"
                                : "mt-0.5 text-[16px]"
                            }`}
                    >
                        {vataInformation?.nameBangla || "-"}
                    </div>

                    {vataInformation?.shortDescription && (
                        <div
                            className={`mt-0.5 font-medium leading-tight text-[#555] ${compact ? "text-[6px]" : "text-[6.5px]"
                                }`}
                        >
                            {vataInformation.shortDescription}
                        </div>
                    )}

                    {/* Address */}
                    <div
                        className={`border-y border-black text-center font-semibold leading-tight ${compact
                                ? "mt-1 px-1 py-0.5 text-[6.5px]"
                                : "mt-1 px-1.5 py-1 text-[7px]"
                            }`}
                    >
                        {vataInformation?.additionalAddress}

                        {vataInformation?.additionalAddress &&
                            vataInformation?.address
                            ? ", "
                            : ""}

                        {vataInformation?.address}
                    </div>

                    {/* Contact */}
                    <div
                        className={`mt-1 flex w-full items-center justify-center gap-x-1 whitespace-nowrap text-center font-semibold leading-none ${compact ? "text-[5.5px]" : "text-[6px]"
                            }`}
                    >
                        {vataInformation?.challanPersonOneName && (
                            <span className="min-w-0 shrink">
                                {vataInformation?.challanPersonOneName}:{" "}
                                {toBanglaNumber(
                                    vataInformation?.challanPersonOnePhoneNumber!
                                )}
                            </span>
                        )}

                        {vataInformation?.challanPersonTwoName && (
                            <span className="min-w-0 shrink">
                                {vataInformation.challanPersonTwoName}:{" "}
                                {toBanglaNumber(
                                    vataInformation?.challanPersonTwoPhoneNumber!
                                )}
                            </span>
                        )}

                        {vataInformation?.challanManagerPhoneNumber && (
                            <span className="min-w-0 shrink">
                                ম্যানেজারঃ{" "}
                                {toBanglaNumber(
                                    vataInformation.challanManagerPhoneNumber
                                )}
                            </span>
                        )}
                    </div>
                </div>

                {/* Payment Information */}
                <div
                    className={`border-y border-black ${compact ? "mt-1 py-1" : "mt-1.5 py-1.5"
                        }`}
                >
                    <div
                        className={`grid grid-cols-[1fr_auto] gap-x-2 gap-y-0.5 font-semibold leading-tight ${compact ? "text-[6.5px]" : "text-[7px]"
                            }`}
                    >
                        <div className="text-left">
                            ক্রমিক নংঃ{" "}
                            <span className="font-bold">
                                {toBanglaNumber(ledger?.serial ?? "-")}
                            </span>
                        </div>

                        <div className="text-right">
                            তারিখঃ{" "}
                            {ledger?.paymentDate
                                ? formatBanglaDate({
                                    date: ledger.paymentDate,
                                })
                                : "-"}
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div
                    className={`border-b border-black ${compact ? "py-1" : "py-1.5"
                        }`}
                >
                    <div
                        className={`grid grid-cols-[30px_5px_minmax(0,1fr)] gap-y-0.5 font-semibold leading-tight ${compact ? "text-[6.5px]" : "text-[7px]"
                            }`}
                    >
                        <span>নাম</span>
                        <span>:</span>
                        <span className="min-w-0 break-words">
                            {ledger?.ledger?.name || "-"}
                        </span>

                        <span>ঠিকানা</span>
                        <span>:</span>
                        <span className="min-w-0 break-words">
                            {ledger?.address || "-"}
                        </span>
                    </div>
                </div>

                {/* Payment Details */}
                <div
                    className={`mt-1 overflow-hidden border border-black ${compact ? "text-[6.5px]" : "text-[7px]"
                        }`}
                >
                    {/* Table Header */}
                    <div
                        className={`grid grid-cols-[1fr_75px] border-b border-black text-center font-bold ${compact ? "text-[6.5px]" : "text-[7px]"
                            }`}
                    >
                        <div className="border-r border-black py-1">
                            বিবরণ
                        </div>

                        <div className="py-1">
                            টাকা
                        </div>
                    </div>

                    {/* Details */}
                    <div
                        className={`grid grid-cols-[1fr_75px] ${compact ? "min-h-[95px]" : "min-h-[120px]"
                            }`}
                    >
                        <div className="border-r border-black p-1.5 font-semibold">
                            <div className="break-words">
                                {ledger?.paymentDetails || "-"}
                            </div>
                        </div>

                        <div className="flex items-start justify-end p-1.5 text-right font-bold">
                            ৳{formatNumber(payment)}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="grid grid-cols-[1fr_75px] border-t border-black font-bold">
                        <div className="border-r border-black px-1.5 py-1">
                            মোট
                        </div>

                        <div className="px-1.5 py-1 text-right">
                            ৳{formatNumber(payment)}
                        </div>
                    </div>
                </div>

                {/* Amount in Words */}
                <div
                    className={`border-b border-black text-center font-semibold ${compact
                            ? "py-1 text-[6px]"
                            : "py-1.5 text-[6.5px]"
                        }`}
                >
                    টাকা বুঝিয়া পাইলাম
                </div>

                {/* Signatures */}
                <div
                    className={`grid grid-cols-3 gap-2 text-center ${compact ? "mt-5" : "mt-6"
                        }`}
                >
                    <div className="min-w-0">
                        <div
                            className={`mx-auto mb-0.5 w-[38px] border-b border-dotted border-black ${compact ? "h-3" : "h-4"
                                }`}
                        />

                        <p
                            className={`font-semibold leading-none ${compact ? "text-[5px]" : "text-[5.5px]"
                                }`}
                        >
                            গ্রহীতার স্বাক্ষর
                        </p>
                    </div>

                    <div className="min-w-0">
                        <div
                            className={`mx-auto mb-0.5 w-[38px] border-b border-dotted border-black ${compact ? "h-3" : "h-4"
                                }`}
                        />

                        <p
                            className={`font-semibold leading-none ${compact ? "text-[5px]" : "text-[5.5px]"
                                }`}
                        >
                            ম্যানেজার
                        </p>
                    </div>

                    <div className="min-w-0">
                        <div
                            className={`mx-auto mb-0.5 w-[38px] border-b border-dotted border-black ${compact ? "h-3" : "h-4"
                                }`}
                        />

                        <p
                            className={`font-semibold leading-none ${compact ? "text-[5px]" : "text-[5.5px]"
                                }`}
                        >
                            মালিক
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className={`border-t border-dashed border-black text-center ${compact ? "mt-1.5 pt-0.5" : "mt-2 pt-0.5"
                        }`}
                >
                    <span
                        className={`font-semibold leading-none ${compact ? "text-[5.5px]" : "text-[6px]"
                            }`}
                    >
                        ধন্যবাদ
                    </span>
                </div>
            </div>
        </div>
    );
};

export default POS80LedgerPrint;