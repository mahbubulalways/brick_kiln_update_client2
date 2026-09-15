"use client";

import {
    TChallanItemReport,
    TChallanSummary,
    TDashboardReport,
    TPaymentReport,
} from "@/interface/dashboard";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

interface OverviewReportProps {
    report: TDashboardReport;
    vataInformation: TVataInformation;
    startDate: Date | null;
    endDate: Date | null;
}

const OverviewReport = ({
    report,
    vataInformation,
    startDate,
    endDate,
}: OverviewReportProps) => {
    const formatNumber = (value: number) =>
        toBanglaNumber(Number(value || 0).toLocaleString("en-US"));

    const formatMoney = (value: number) =>
        `৳ ${formatNumber(Number(value || 0))}`;

    const challanSummary: TChallanSummary = report?.challan?.summary;
    const challanItems: TChallanItemReport[] = report?.challan?.items || [];
    const payments: TPaymentReport[] = report?.payment?.payments || [];
    const delivery = report?.delivery || [];
    const stock = report?.stockSummary;

    const totalSell = Number(challanSummary?.totalSale || 0);
    const cashSell = Number(challanSummary?.cash || 0);
    const dueSell = Number(challanSummary?.due || 0);


    const totalPayment = Number(report?.payment?.total || 0);
    const totalCash = Number(report?.cash || 0);
    const totalDue = Number(report?.due || 0);

    const totalChallan = challanItems.reduce(
        (sum, item) => sum + Number(item?.totalChallan || 0),
        0,
    );

    const totalQuantity = challanItems.reduce(
        (sum, item) => sum + Number(item?.totalQuantity || 0),
        0,
    );

    const totalDelivery = delivery.reduce(
        (sum, item) => sum + Number(item?.quantity || 0),
        0,
    );

    const totalPaymentAmount = payments.reduce(
        (sum, item) => sum + Number(item?.amount || 0),
        0,
    );

    const totalPaymentGiven = payments.reduce(
        (sum, item) => sum + Number(item?.paymentGiven || 0),
        0,
    );

    const totalSold = report?.sellGraph?.reduce(
        (sum, item) => sum + Number(item?.quantity || 0),
        0,
    );

    const totalStock =
        Number(stock?.rawBrick || 0) +
        Number(stock?.fieldBrick || 0) +
        Number(stock?.stockBrick || 0) +
        Number(stock?.chulliBrick || 0);

    const shortForm = vataInformation?.shortForm
        ?.split("")
        .join(".");

    const getPeriod = () => {
        if (startDate && endDate) {
            if (startDate.toDateString() === endDate.toDateString()) {
                return formatBanglaDate({ date: startDate });
            }

            return `${formatBanglaDate({ date: startDate })} - ${formatBanglaDate({
                date: endDate,
            })}`;
        }

        if (startDate) {
            return formatBanglaDate({ date: startDate });
        }

        if (endDate) {
            return formatBanglaDate({ date: endDate });
        }

        return "সকল হিসাব";
    };

    return (
        <div className="w-full bg-white px-6 py-5 text-slate-800">
            {/* ================= HEADER ================= */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none"
            >
                <span
                    className="rotate-[-18deg] whitespace-nowrap font-extrabold text-black opacity-[0.04]"
                    style={{
                        fontSize: "170px",
                    }}
                >
                    {vataInformation?.shortForm
                        ?.split("")
                        .join(".")}
                </span>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-black">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    {/* Short Form */}
                    <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                        {vataInformation?.shortForm
                            ?.split("")
                            .join(".")}
                    </div>

                    {/* Owner Information */}
                    <div className="min-w-[150px] text-right leading-tight">
                        {vataInformation?.ownerName && (
                            <p className="text-[13px] font-bold">
                                প্রোঃ {vataInformation?.ownerName}
                            </p>
                        )}

                        {vataInformation?.ownerPhoneNumber && (
                            <p className="mt-0.5 text-[14px] font-bold">
                                {vataInformation?.ownerPhoneNumber}
                            </p>
                        )}
                    </div>
                </div>

                {/* Vata Name */}
                <div className="mt-3 text-center">
                    <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">
                        {vataInformation?.nameBangla}
                    </h1>

                    {vataInformation?.shortDescription && (
                        <p className="mt-1 text-[12px] font-semibold">
                            {vataInformation?.shortDescription}
                        </p>
                    )}
                </div>

                {/* Address */}
                {(vataInformation?.additionalAddress ||
                    vataInformation?.address) && (
                        <div className="mt-2 border-y border-black py-1.5 text-center text-[12px] font-semibold leading-tight">
                            {vataInformation?.additionalAddress}

                            {vataInformation?.additionalAddress &&
                                vataInformation?.address
                                ? " • "
                                : ""}

                            {vataInformation?.address}
                        </div>
                    )}

                {/* Contact Information */}
                {(vataInformation?.challanPersonOneName ||
                    vataInformation?.challanPersonTwoName ||
                    vataInformation?.challanManagerPhoneNumber) && (
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] font-semibold">
                            {vataInformation?.challanPersonOneName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonOneName}
                                    </span>
                                    :{" "}
                                    {vataInformation?.challanPersonOnePhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanPersonTwoName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonTwoName}
                                    </span>
                                    :{" "}
                                    {vataInformation?.challanPersonTwoPhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanManagerPhoneNumber && (
                                <span>
                                    <span className="font-bold">
                                        ম্যানেজার
                                    </span>
                                    : {vataInformation?.challanManagerPhoneNumber}
                                </span>
                            )}
                        </div>
                    )}
            </div>


            <div className="flex items-center justify-center py-3 ">
                {getPeriod()}
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-[#039A63]" />
                    <h3 className="text-[12px] font-black text-slate-900">
                        আর্থিক চিত্র
                    </h3>
                </div>

                <div className="grid grid-cols-3 border border-slate-200">
                    <div className="border-r border-b border-slate-200 p-3">
                        <p className="text-[9px] text-slate-400">মোট বিক্রি</p>
                        <p className="mt-1 text-[17px] font-black text-[#039A63]">
                            {formatMoney(totalSell)}
                        </p>
                    </div>

                    <div className="border-r border-b border-slate-200 p-3">
                        <p className="text-[9px] text-slate-400">নগদ বিক্রি</p>
                        <p className="mt-1 text-[17px] font-black text-slate-800">
                            {formatMoney(cashSell)}
                        </p>
                    </div>

                    <div className="border-b border-slate-200 p-3">
                        <p className="text-[9px] text-slate-400">বাকি বিক্রি</p>
                        <p className="mt-1 text-[17px] font-black text-[#c43bda]">
                            {formatMoney(dueSell)}
                        </p>
                    </div>

                    <div className="border-r border-slate-200 p-3">
                        <p className="text-[9px] text-slate-400">মোট পেমেন্ট</p>
                        <p className="mt-1 text-[17px] font-black text-[#f26b1a]">
                            {formatMoney(totalPayment)}
                        </p>
                    </div>

                    <div className="border-r border-slate-200 p-3">
                        <p className="text-[9px] text-slate-400">বাকি জমা</p>
                        <p className="mt-1 text-[17px] font-black text-[#10a98b]">
                            {formatMoney(totalDue)}
                        </p>
                    </div>

                    <div className="p-3">
                        <p className="text-[9px] text-slate-400">বর্তমান ক্যাশ</p>
                        <p className="mt-1 text-[17px] font-black text-[#6463e0]">
                            {formatMoney(totalCash)}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= SALES STATEMENT ================= */}
            <div className="mt-5">
                <div className="flex items-end justify-between border-b border-slate-200 pb-2">
                    <div>
                        <h3 className="text-[12px] font-black text-slate-900">
                            বিক্রয় বিবরণী
                        </h3>

                        <p className="mt-0.5 text-[8px] text-slate-400">
                            শ্রেণি অনুযায়ী চালান, পরিমাণ এবং বিক্রয় মূল্য
                        </p>
                    </div>

                    <div className="text-right text-[9px]">
                        <span className="text-slate-400">মোট চালান : </span>
                        <span className="font-bold text-slate-800">
                            {formatNumber(totalChallan)}
                        </span>
                    </div>
                </div>

                <table className="mt-2 w-full border-collapse text-[9px]">
                    <thead>
                        <tr className="border-y border-slate-300 bg-slate-50">
                            <th className="w-[8%] px-2 py-2 text-center font-bold text-slate-600">
                                #
                            </th>

                            <th className="w-[35%] px-2 py-2 text-left font-bold text-slate-600">
                                ইটের শ্রেণী
                            </th>

                            <th className="w-[17%] px-2 py-2 text-right font-bold text-slate-600">
                                চালান
                            </th>

                            <th className="w-[18%] px-2 py-2 text-right font-bold text-slate-600">
                                পরিমাণ
                            </th>

                            <th className="w-[22%] px-2 py-2 text-right font-bold text-slate-600">
                                মোট মূল্য
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {challanItems.map((item, index) => (
                            <tr
                                key={`${item.class}-${index}`}
                                className="border-b border-slate-100"
                            >
                                <td className="px-2 py-2 text-center text-slate-400">
                                    {formatNumber(index + 1)}
                                </td>

                                <td className="px-2 py-2 font-semibold text-slate-700">
                                    {item.class}
                                </td>

                                <td className="px-2 py-2 text-right text-slate-600">
                                    {formatNumber(item.totalChallan)}
                                </td>

                                <td className="px-2 py-2 text-right text-slate-600">
                                    {formatNumber(item.totalQuantity)}
                                </td>

                                <td className="px-2 py-2 text-right font-bold text-slate-800">
                                    {formatMoney(item.totalPrice)}
                                </td>
                            </tr>
                        ))}

                        <tr className="border-b-2 border-[#039A63] bg-[#f4faf7]">
                            <td
                                colSpan={2}
                                className="px-2 py-2 font-black text-[#039A63]"
                            >
                                সর্বমোট
                            </td>

                            <td className="px-2 py-2 text-right font-black text-[#039A63]">
                                {formatNumber(totalChallan)}
                            </td>

                            <td className="px-2 py-2 text-right font-black text-[#039A63]">
                                {formatNumber(totalQuantity)}
                            </td>

                            <td className="px-2 py-2 text-right font-black text-[#039A63]">
                                {formatMoney(totalSell)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ================= THREE SUMMARY COLUMNS ================= */}
            <div className="mt-5 grid grid-cols-2 gap-3">
                {/* Delivery */}
                <div className="border border-slate-200">
                    <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                        <h3 className="text-[10px] font-black text-slate-700">
                            ডেলিভারি সারাংশ
                        </h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {delivery.length > 0 ? (
                            delivery.slice(0, 4).map((item, index) => (
                                <div
                                    key={`${item.class}-${index}`}
                                    className="flex justify-between px-3 py-2 text-[9px]"
                                >
                                    <span className="font-medium text-slate-600">
                                        {item.class}
                                    </span>

                                    <span className="font-bold text-indigo-600">
                                        {formatNumber(item.quantity)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-5 text-center text-[9px] text-slate-400">
                                কোনো তথ্য নেই
                            </div>
                        )}

                        <div className="flex justify-between bg-indigo-50 px-3 py-2 text-[9px]">
                            <span className="font-bold text-indigo-800">
                                মোট ডেলিভারি
                            </span>

                            <span className="font-black text-indigo-700">
                                {formatNumber(totalDelivery)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border border-slate-200">
                    <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                        <h3 className="text-[10px] font-black text-slate-700">
                            বর্তমান স্টক
                        </h3>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="border-r border-b border-slate-100 px-3 py-2">
                            <p className="text-[8px] text-slate-400">কাঁচা</p>
                            <p className="mt-0.5 text-[11px] font-black">
                                {formatNumber(stock?.rawBrick || 0)}
                            </p>
                        </div>

                        <div className="border-b border-slate-100 px-3 py-2">
                            <p className="text-[8px] text-slate-400">মাঠ</p>
                            <p className="mt-0.5 text-[11px] font-black">
                                {formatNumber(stock?.fieldBrick || 0)}
                            </p>
                        </div>

                        <div className="border-r border-b border-slate-100 bg-[#f4faf7] px-3 py-2">
                            <p className="text-[8px] text-slate-400">স্টক</p>
                            <p className="mt-0.5 text-[11px] font-black text-[#039A63]">
                                {formatNumber(stock?.stockBrick || 0)}
                            </p>
                        </div>

                        <div className="border-b border-slate-100 px-3 py-2">
                            <p className="text-[8px] text-slate-400">চুল্লি</p>
                            <p className="mt-0.5 text-[11px] font-black">
                                {formatNumber(stock?.chulliBrick || 0)}
                            </p>
                        </div>

                        <div className="col-span-2 flex justify-between bg-slate-50 px-3 py-2">
                            <span className="text-[9px] font-bold text-slate-600">
                                মোট স্টক
                            </span>

                            <span className="text-[10px] font-black text-slate-800">
                                {formatNumber(totalStock)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= PAYMENT STATEMENT ================= */}
            <div className="mt-5">
                <div className="flex items-end justify-between border-b border-slate-200 pb-2">
                    <div>
                        <h3 className="text-[12px] font-black text-slate-900">
                            পেমেন্ট বিবরণী
                        </h3>

                        <p className="mt-0.5 text-[8px] text-slate-400">
                            ব্যবসায়ের খরচ ও প্রদানকৃত পেমেন্ট
                        </p>
                    </div>

                    <p className="text-[9px]">
                        মোট প্রদান :{" "}
                        <span className="font-black text-[#f26b1a]">
                            {formatMoney(totalPaymentGiven)}
                        </span>
                    </p>
                </div>

                <table className="mt-2 w-full border-collapse text-[9px]">
                    <thead>
                        <tr className="border-y border-slate-300 bg-slate-50">
                            <th className="w-[8%] px-2 py-2 text-center font-bold text-slate-600">
                                #
                            </th>

                            <th className="w-[42%] px-2 py-2 text-left font-bold text-slate-600">
                                খরচের খাত
                            </th>

                            <th className="w-[25%] px-2 py-2 text-right font-bold text-slate-600">
                                মোট খরচ
                            </th>

                            <th className="w-[25%] px-2 py-2 text-right font-bold text-slate-600">
                                প্রদান
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.map((item, index) => (
                            <tr
                                key={`${item.ledger}-${index}`}
                                className="border-b border-slate-100"
                            >
                                <td className="px-2 py-2 text-center text-slate-400">
                                    {formatNumber(index + 1)}
                                </td>

                                <td className="px-2 py-2 font-semibold text-slate-700">
                                    {item.ledger}
                                </td>

                                <td className="px-2 py-2 text-right text-slate-600">
                                    {formatMoney(item.amount)}
                                </td>

                                <td className="px-2 py-2 text-right font-bold text-orange-600">
                                    {formatMoney(item.paymentGiven)}
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-orange-50">
                            <td
                                colSpan={2}
                                className="px-2 py-2 font-black text-orange-800"
                            >
                                সর্বমোট
                            </td>

                            <td className="px-2 py-2 text-right font-black text-orange-700">
                                {formatMoney(totalPaymentAmount)}
                            </td>

                            <td className="px-2 py-2 text-right font-black text-orange-700">
                                {formatMoney(totalPaymentGiven)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-10 grid grid-cols-3 items-end gap-12">
                <div className="text-center">
                    <div className="border-t border-slate-400 pt-1.5 text-[8px] text-slate-500">
                        হিসাব প্রস্তুতকারীর স্বাক্ষর
                    </div>
                </div>

                <div className="text-center text-[8px] text-slate-400">
                    <p>
                        রিপোর্ট প্রস্তুত :{" "}
                        {formatBanglaDate({ date: new Date() })}
                    </p>

                    <p className="mt-1 font-semibold text-[#039A63]">
                        Brick Management
                    </p>
                </div>

                <div className="text-center">
                    <div className="border-t border-slate-400 pt-1.5 text-[8px] text-slate-500">
                        মালিকের স্বাক্ষর
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewReport;