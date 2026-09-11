"use client";

import { TVataInformation } from "@/interface/vata";
import { IChallanForDataShow } from "@/types/types";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

interface POS80CustomerPrintProps {
    invoice: IChallanForDataShow;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
    compact?: boolean;
}

const POS80CustomerPrint = ({
    invoice,
    vataInformation,
    copyType = "customer",
    compact = false,
}: POS80CustomerPrintProps) => {
    const productPrice = Number(invoice?.productPrice || 0);
    const discount = Number(invoice?.discount || 0);
    const carRent = Number(invoice?.carRent || 0);
    const totalPrice = Number(invoice?.totalPrice || 0);
    const cash = Number(invoice?.cash || 0);
    const due = Number(invoice?.due || 0);

    const challanItems = invoice?.items || [];

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
                className={`mx-auto w-full px-[2.5mm] ${compact ? "py-[1mm]" : "py-[2mm]"
                    }`}
            >
                {/* Header */}
                <div className="text-center">
                    {/* Copy Type */}
                    <div
                        className={`mx-auto inline-block border border-black px-2 py-0.5 font-bold ${compact ? "text-[7px]" : "text-[8px]"
                            }`}
                    >
                        {copyType === "office"
                            ? "অফিস কপি"
                            : "কাস্টমার কপি"}
                    </div>

                    {/* Challan Title */}
                    <div
                        className={`font-extrabold leading-none ${compact
                                ? "mt-1 text-[15px]"
                                : "mt-1.5 text-[18px]"
                            }`}
                    >
                        চালান
                    </div>

                    {/* Vata Name */}
                    <div
                        className={`font-extrabold leading-none ${compact
                                ? "mt-1 text-[15px]"
                                : "mt-1.5 text-[18px]"
                            }`}
                    >
                        {vataInformation?.nameBangla || "-"}
                    </div>

                    {/* Description */}
                    {vataInformation?.shortDescription && (
                        <div
                            className={`font-medium leading-none text-[#555] ${compact
                                    ? "mt-0.5 text-[7px]"
                                    : "mt-1 text-[8px]"
                                }`}
                        >
                            {vataInformation.shortDescription}
                        </div>
                    )}

                    {/* Address */}
                    <div
                        className={`border-y border-black text-center font-semibold leading-tight ${compact
                                ? "mt-1 px-1.5 py-1 text-[7px]"
                                : "mt-1.5 px-2 py-1.5 text-[8px]"
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
                        className={`flex items-center justify-center whitespace-nowrap text-center font-semibold leading-none ${compact
                                ? "mt-1 gap-x-1.5 text-[6.5px]"
                                : "mt-1.5 gap-x-2 text-[8px]"
                            }`}
                    >
                        {vataInformation?.challanPersonOneName && (
                            <span className="shrink-0">
                                {vataInformation.challanPersonOneName}:{" "}
                                {
                                    vataInformation.challanPersonOnePhoneNumber
                                }
                            </span>
                        )}

                        {vataInformation?.challanPersonTwoName && (
                            <span className="shrink-0">
                                {vataInformation.challanPersonTwoName}:{" "}
                                {
                                    vataInformation.challanPersonTwoPhoneNumber
                                }
                            </span>
                        )}

                        {vataInformation?.challanManagerPhoneNumber && (
                            <span className="shrink-0">
                                ম্যানেজারঃ{" "}
                                {vataInformation.challanManagerPhoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Challan Information */}
                <div
                    className={`border-y border-black ${compact ? "mt-1 py-1" : "mt-1.5 py-1.5"
                        }`}
                >
                    <div
                        className={`grid grid-cols-2 gap-x-2 gap-y-0.5 font-semibold leading-tight ${compact ? "text-[7px]" : "text-[8px]"
                            }`}
                    >
                        <div>
                            চালান নং:{" "}
                            <span className="font-bold">
                                #{toBanglaNumber(invoice?.serial ?? "-")}
                            </span>
                        </div>

                        <div className="text-right">
                            {invoice?.challanDate
                                ? formatBanglaDate({
                                    date: invoice.challanDate,
                                })
                                : "-"}
                        </div>

                        <div className="col-span-2 text-center">
                            {copyType === "office"
                                ? "অফিস কপি"
                                : "কাস্টমার কপি"}
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div
                    className={`border-b border-black ${compact ? "py-1.5" : "py-2"
                        }`}
                >
                    <div
                        className={`grid grid-cols-[38px_6px_1fr] gap-y-0.5 font-semibold leading-tight ${compact ? "text-[7px]" : "text-[8px]"
                            }`}
                    >
                        <span>নাম</span>
                        <span>:</span>
                        <span className="break-words">
                            {invoice?.customer?.name || "-"}
                        </span>

                        <span>ঠিকানা</span>
                        <span>:</span>
                        <span className="break-words">
                            {invoice?.customer?.address || "-"}
                        </span>

                        <span>মোবাইল</span>
                        <span>:</span>
                        <span>
                            {invoice?.customer?.phoneNumber
                                ? toBanglaNumber(
                                    invoice.customer.phoneNumber
                                )
                                : "-"}
                        </span>
                    </div>
                </div>

                {/* Products */}
                <table
                    className={`mt-1 w-full border-collapse border border-black ${compact ? "text-[7px]" : "text-[8px]"
                        }`}
                >
                    <thead>
                        <tr className="font-bold">
                            <th className="border border-black px-1 py-0.5 text-left">
                                শ্রেণি
                            </th>

                            <th className="border border-black px-1 py-0.5 text-center">
                                পরিমাণ
                            </th>

                            <th className="border border-black px-1 py-0.5 text-center">
                                দর
                            </th>

                            <th className="border border-black px-1 py-0.5 text-right">
                                মূল্য
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {challanItems.length > 0 ? (
                            challanItems.map((item, index: number) => (
                                <tr key={item?.id || index}>
                                    <td className="border border-black px-1 py-0.5 text-left align-top">
                                        {item?.class || "-"}
                                    </td>

                                    <td className="border border-black px-1 py-0.5 text-center align-top">
                                        {formatNumber(item?.quantity)}
                                    </td>

                                    <td className="border border-black px-1 py-0.5 text-center align-top">
                                        {formatNumber(item?.rate)}
                                    </td>

                                    <td className="border border-black px-1 py-0.5 text-right align-top font-semibold">
                                        {formatNumber(item?.price)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="border border-black px-1 py-1 text-center"
                                >
                                    কোনো পণ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Price Summary */}
                <div
                    className={`border-b border-black ${compact ? "py-1.5" : "py-2"
                        }`}
                >
                    <div
                        className={`space-y-0.5 ${compact ? "text-[7px]" : "text-[8px]"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>পণ্যের মূল্য</span>

                            <span className="font-semibold">
                                {formatNumber(productPrice)} টাকা
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>ছাড়</span>

                            <span className="font-semibold">
                                {formatNumber(discount)} টাকা
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>গাড়ি ভাড়া</span>

                            <span className="font-semibold">
                                {formatNumber(carRent)} টাকা
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div
                    className={`border-b border-black ${compact ? "py-1.5" : "py-2"
                        }`}
                >
                    <div className="space-y-0.5">
                        <div
                            className={`flex items-center justify-between font-bold ${compact ? "text-[9px]" : "text-[11px]"
                                }`}
                        >
                            <span>সর্বমোট</span>

                            <span>
                                {formatNumber(totalPrice)} টাকা
                            </span>
                        </div>

                        <div
                            className={`flex items-center justify-between ${compact ? "text-[7px]" : "text-[8px]"
                                }`}
                        >
                            <span>জমা</span>

                            <span>
                                {formatNumber(cash)} টাকা
                            </span>
                        </div>

                        <div
                            className={`flex items-center justify-between font-bold ${compact ? "text-[9px]" : "text-[11px]"
                                }`}
                        >
                            <span>বাকি</span>

                            <span>
                                {formatNumber(due)} টাকা
                            </span>
                        </div>
                    </div>
                </div>

                {/* Signatures */}
                <div
                    className={`grid grid-cols-2 gap-3 text-center ${compact ? "mt-5" : "mt-7"
                        }`}
                >
                    <div>
                        <div
                            className={`mx-auto mb-0.5 w-[60px] border-b border-black ${compact ? "h-3" : "h-4"
                                }`}
                        />

                        <p
                            className={`font-semibold ${compact ? "text-[6px]" : "text-[8px]"
                                }`}
                        >
                            গ্রাহকের স্বাক্ষর
                        </p>
                    </div>

                    <div>
                        <div
                            className={`mx-auto mb-0.5 w-[60px] border-b border-black ${compact ? "h-3" : "h-4"
                                }`}
                        />

                        <p
                            className={`font-semibold ${compact ? "text-[6px]" : "text-[8px]"
                                }`}
                        >
                            ম্যানেজারের স্বাক্ষর
                        </p>
                    </div>
                </div>

                {/* Confirmation */}
                <div
                    className={`border-t border-black text-center ${compact ? "mt-1.5 pt-1" : "mt-2 pt-1"
                        }`}
                >
                    <p
                        className={`font-medium leading-tight ${compact ? "text-[6px]" : "text-[8px]"
                            }`}
                    >
                        উপরোক্ত চালান অনুযায়ী মালামাল বুঝিয়া পাইলাম
                    </p>
                </div>

                {/* Footer */}
                <div
                    className={`border-t border-dashed border-black text-center ${compact ? "mt-1 pt-0.5" : "mt-1.5 pt-1"
                        }`}
                >
                    <span
                        className={`font-semibold ${compact ? "text-[6px]" : "text-[7px]"
                            }`}
                    >
                        ধন্যবাদ
                    </span>
                </div>
            </div>
        </div>
    );
};

export default POS80CustomerPrint;