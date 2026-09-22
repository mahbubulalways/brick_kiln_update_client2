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

        return toBanglaNumber(
            number.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
            })
        );
    };

    const copyName =
        copyType === "office" ? "অফিস কপি" : "কাস্টমার কপি";

    return (
        <div className="w-[80mm] min-w-[80mm] max-w-[80mm] text-black">
            <div
                className={`mx-auto w-full px-[2.5mm] ${compact ? "py-[1mm]" : "py-[1.5mm]"
                    }`}
            >
                {/* Header */}
                <div className="text-center">
                    <div
                        className={`mx-auto inline-block border border-black px-1.5 py-0.5 font-bold leading-none ${compact ? "text-[6px]" : "text-[7px]"
                            }`}
                    >
                        {copyName}
                    </div>

                    <div
                        className={`font-extrabold leading-none ${compact
                                ? "mt-0.5 text-[13px]"
                                : "mt-1 text-[15px]"
                            }`}
                    >
                        চালান
                    </div>

                    <div
                        className={`font-extrabold leading-none ${compact
                                ? "mt-0.5 text-[13px]"
                                : "mt-0.5 text-[15px]"
                            }`}
                    >
                        {vataInformation?.nameBangla || "-"}
                    </div>

                    {vataInformation?.shortDescription && (
                        <div
                            className={`font-medium leading-none text-[#555] ${compact
                                    ? "mt-0.5 text-[6px]"
                                    : "mt-0.5 text-[7px]"
                                }`}
                        >
                            {vataInformation.shortDescription}
                        </div>
                    )}

                    <div
                        className={`border-y border-black text-center font-semibold leading-tight ${compact
                                ? "mt-0.5 px-1 py-0.5 text-[6px]"
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

                    <div
                        className={`flex items-center justify-center whitespace-nowrap text-center font-semibold leading-none ${compact
                                ? "mt-0.5 gap-x-1 text-[5.5px]"
                                : "mt-1 gap-x-1.5 text-[6.5px]"
                            }`}
                    >
                        {vataInformation?.challanPersonOneName && (
                            <span className="shrink-0">
                                {vataInformation.challanPersonOneName}:{" "}
                                {vataInformation.challanPersonOnePhoneNumber}
                            </span>
                        )}

                        {vataInformation?.challanPersonTwoName && (
                            <span className="shrink-0">
                                {vataInformation.challanPersonTwoName}:{" "}
                                {vataInformation.challanPersonTwoPhoneNumber}
                            </span>
                        )}

                        {vataInformation?.challanManagerPhoneNumber && (
                            <span className="shrink-0">
                                ম্যানেজার:{" "}
                                {vataInformation.challanManagerPhoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Challan Information */}
                <div
                    className={`border-y border-black ${compact ? "mt-0.5 py-0.5" : "mt-1 py-1"
                        }`}
                >
                    <div
                        className={`grid grid-cols-2 gap-x-1 gap-y-0 font-semibold leading-tight ${compact ? "text-[6px]" : "text-[7px]"
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
                            {copyName}
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div
                    className={`border-b border-black ${compact ? "py-1" : "py-1.5"
                        }`}
                >
                    <div
                        className={`grid grid-cols-[34px_5px_1fr] gap-y-0 font-semibold leading-tight ${compact ? "text-[6px]" : "text-[7px]"
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
                    className={`mt-0.5 w-full border-collapse border border-black ${compact ? "text-[6px]" : "text-[7px]"
                        }`}
                >
                    <thead>
                        <tr className="font-bold">
                            <th className="border border-black px-0.5 py-0.5 text-left">
                                শ্রেণি
                            </th>

                            <th className="border border-black px-0.5 py-0.5 text-center">
                                পরিমাণ
                            </th>

                            <th className="border border-black px-0.5 py-0.5 text-center">
                                দর
                            </th>

                            <th className="border border-black px-0.5 py-0.5 text-right">
                                মূল্য
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {challanItems.length > 0 ? (
                            challanItems.map((item, index: number) => (
                                <tr key={item?.id || index}>
                                    <td className="border border-black px-0.5 py-0.5 text-left align-top">
                                        {item?.class || "-"}
                                    </td>

                                    <td className="border border-black px-0.5 py-0.5 text-center align-top">
                                        {formatNumber(item?.quantity)}
                                    </td>

                                    <td className="border border-black px-0.5 py-0.5 text-center align-top">
                                        {formatNumber(item?.rate)}
                                    </td>

                                    <td className="border border-black px-0.5 py-0.5 text-right align-top font-semibold">
                                        {formatNumber(item?.price)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="border border-black px-0.5 py-0.5 text-center"
                                >
                                    কোনো পণ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Price Summary */}
                <div
                    className={`border-b border-black ${compact ? "py-1" : "py-1.5"
                        }`}
                >
                    <div
                        className={`space-y-0 ${compact ? "text-[6px]" : "text-[7px]"
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
                    className={`border-b border-black ${compact ? "py-1" : "py-1.5"
                        }`}
                >
                    <div className="space-y-0">
                        <div
                            className={`flex items-center justify-between font-bold ${compact ? "text-[8px]" : "text-[9px]"
                                }`}
                        >
                            <span>সর্বমোট</span>

                            <span>
                                {formatNumber(totalPrice)} টাকা
                            </span>
                        </div>

                        <div
                            className={`flex items-center justify-between ${compact ? "text-[6px]" : "text-[7px]"
                                }`}
                        >
                            <span>জমা</span>

                            <span>
                                {formatNumber(cash)} টাকা
                            </span>
                        </div>

                        <div
                            className={`flex items-center justify-between font-bold ${compact ? "text-[8px]" : "text-[9px]"
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
                    className={`grid grid-cols-2 gap-2 text-center ${compact ? "mt-4" : "mt-5"
                        }`}
                >
                    <div>
                        <div
                            className={`mx-auto mb-0.5 w-[55px] border-b border-black ${compact ? "h-2.5" : "h-3"
                                }`}
                        />

                        <p
                            className={`font-semibold ${compact ? "text-[5px]" : "text-[6px]"
                                }`}
                        >
                            গ্রাহকের স্বাক্ষর
                        </p>
                    </div>

                    <div>
                        <div
                            className={`mx-auto mb-0.5 w-[55px] border-b border-black ${compact ? "h-2.5" : "h-3"
                                }`}
                        />

                        <p
                            className={`font-semibold ${compact ? "text-[5px]" : "text-[6px]"
                                }`}
                        >
                            ম্যানেজারের স্বাক্ষর
                        </p>
                    </div>
                </div>

                {/* Confirmation */}
                <div
                    className={`border-t border-black text-center ${compact ? "mt-1 pt-0.5" : "mt-1 pt-0.5"
                        }`}
                >
                    <p
                        className={`font-medium leading-tight ${compact ? "text-[5px]" : "text-[6px]"
                            }`}
                    >
                        উপরোক্ত চালান অনুযায়ী মালামাল বুঝিয়া পাইলাম
                    </p>
                </div>

                {/* Footer */}
                <div
                    className={`border-t border-dashed border-black text-center ${compact ? "mt-0.5 pt-0.5" : "mt-1 pt-0.5"
                        }`}
                >
                    <span
                        className={`font-semibold ${compact ? "text-[5px]" : "text-[6px]"
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