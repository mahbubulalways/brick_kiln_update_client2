"use client";

import { TPaymentResponse } from "@/interface/payment";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TPaymentPrintProps = {
    payments: TPaymentResponse[];
    date?: Date;
    vataInformation: TVataInformation;
};

const PaymentPrint = ({
    payments = [],
    date = new Date(),
    vataInformation,
}: TPaymentPrintProps) => {
    // =========================================================
    // Helpers
    // =========================================================

    const formatNumber = (
        value: number | null | undefined,
    ) => {
        return toBanglaNumber(
            Number(value ?? 0).toLocaleString(),
        );
    };

    // =========================================================
    // Totals
    // =========================================================

    const totalQuantity = payments.reduce(
        (total, row) =>
            total + Number(row.quantity ?? 0),
        0,
    );

    const totalBill = payments.reduce(
        (total, row) =>
            total + Number(row.totalBill ?? 0),
        0,
    );

    const totalAdvance = payments.reduce(
        (total, row) =>
            total +
            (row.paymentType === "অগ্রিম পেমেন্ট"
                ? Number(row.payment ?? 0)
                : 0),
        0,
    );

    const totalCutting = payments.reduce(
        (total, row) =>
            total + Number(row.cutting ?? 0),
        0,
    );

    const totalPayment = payments.reduce(
        (total, row) =>
            total + Number(row.payment ?? 0),
        0,
    );

    const totalDifference = payments.reduce(
        (total, row) =>
            total +
            Number(row.paymentDifference ?? 0),
        0,
    );

    // =========================================================
    // Render
    // =========================================================

    return (
        <div
            id="payment-page-print"
            className="w-full bg-white text-black"
        >

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



            <div className="relative mt-4 flex min-h-[28px] items-center justify-between">
                {/* Date */}

                <p className="text-[10px] font-semibold">
                    তারিখঃ{" "}
                    {formatBanglaDate({
                        date,
                    })}
                </p>

                {/* Center Title */}

                <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#E5E7EB] px-12 py-1.5">
                    <p className="whitespace-nowrap text-[12px] font-bold leading-none">
                        দৈনিক পেমেন্ট রিপোর্ট
                    </p>
                </div>

                {/* Total Payment */}

                <p className="text-[10px] font-bold">
                    মোট পেমেন্টঃ{" "}
                    {formatNumber(totalPayment)} টাকা
                </p>
            </div>

            {/* =====================================================
                PAYMENT TABLE
            ===================================================== */}

            <div className="mt-2">
                <table className="w-full border-collapse text-[9px] text-black">
                    {/* ================= TABLE HEADER ================= */}

                    <thead>
                        <tr className="bg-[#F1F2F3]">
                            <th className="w-[35px] border border-gray-300 px-1 py-1.5 font-normal">
                                নং
                            </th>

                            <th className="w-[100px] border border-gray-300 px-1 py-1.5 text-left font-normal">
                                খতিয়ান
                            </th>

                            <th className="border border-gray-300 px-1 py-1.5 text-left font-normal">
                                পেমেন্টের বিবরণ
                            </th>

                            <th className="w-[55px] border border-gray-300 px-1 py-1.5 font-normal">
                                পরিমাণ
                            </th>

                            <th className="w-[65px] border border-gray-300 px-1 py-1.5 font-normal">
                                মোট বিল
                            </th>

                            <th className="w-[65px] border border-gray-300 px-1 py-1.5 font-normal">
                                অগ্রিম
                            </th>

                            <th className="w-[65px] border border-gray-300 px-1 py-1.5 font-normal">
                                কর্তন
                            </th>

                            <th className="w-[70px] border border-gray-300 px-1 py-1.5 font-normal">
                                পেমেন্ট
                            </th>
                        </tr>
                    </thead>

                    {/* ================= TABLE BODY ================= */}

                    <tbody>
                        {payments.length > 0 ? (
                            payments.map(
                                (
                                    row: TPaymentResponse,
                                    index: number,
                                ) => (
                                    <tr key={row.id}>
                                        {/* Serial */}

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {toBanglaNumber(
                                                String(
                                                    index + 1,
                                                ),
                                            )}
                                        </td>

                                        {/* Ledger */}

                                        <td className="border border-gray-300 px-1 py-1.5">
                                            {row.ledger?.serial
                                                ? `${toBanglaNumber(
                                                    String(
                                                        row
                                                            .ledger
                                                            .serial,
                                                    ),
                                                )} - `
                                                : ""}
                                            {row.ledger?.name ??
                                                "-"}
                                        </td>

                                        {/* Payment Details */}

                                        <td className="border border-gray-300 px-1 py-1.5">
                                            {row.paymentDetails ??
                                                "-"}
                                        </td>

                                        {/* Quantity */}

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {formatNumber(
                                                row.quantity,
                                            )}
                                        </td>

                                        {/* Total Bill */}

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            ৳{" "}
                                            {formatNumber(
                                                row.totalBill,
                                            )}
                                        </td>

                                        {/* Advance */}

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row.paymentType ===
                                                "অগ্রিম পেমেন্ট"
                                                ? `৳ ${formatNumber(
                                                    row.payment,
                                                )}`
                                                : "-"}
                                        </td>

                                        {/* Cutting */}

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            ৳{" "}
                                            {formatNumber(
                                                row.cutting,
                                            )}
                                        </td>

                                        {/* Payment */}

                                        <td className="border border-gray-300 px-1 py-1.5 text-center font-medium">
                                            ৳{" "}
                                            {formatNumber(
                                                row.payment,
                                            )}
                                        </td>

                                    </tr>
                                ),
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="border border-gray-300 py-5 text-center text-gray-500"
                                >
                                    কোনো তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        )}

                        {/* =================================================
                            TOTAL ROW
                        ================================================= */}

                        {payments.length > 0 && (
                            <tr className="bg-[#F1F2F3] font-semibold">
                                <td
                                    colSpan={3}
                                    className="border border-gray-300 px-1 py-1.5 text-right"
                                >
                                    সর্বমোটঃ
                                </td>

                                {/* Quantity */}

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    {formatNumber(
                                        totalQuantity,
                                    )}
                                </td>

                                {/* Total Bill */}

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    ৳{" "}
                                    {formatNumber(
                                        totalBill,
                                    )}
                                </td>

                                {/* Advance */}

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    ৳{" "}
                                    {formatNumber(
                                        totalAdvance,
                                    )}
                                </td>

                                {/* Cutting */}

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    ৳{" "}
                                    {formatNumber(
                                        totalCutting,
                                    )}
                                </td>

                                {/* Payment */}

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    ৳{" "}
                                    {formatNumber(
                                        totalPayment,
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* =====================================================
                SUMMARY
            ===================================================== */}

            {/* <div className="mt-3 flex justify-end">
                <div className="w-[230px] overflow-hidden rounded border border-gray-300">
                  
                    <div className="flex justify-between border-b border-gray-300 px-3 py-1 text-[9px]">
                        <span>মোট বিল</span>

                        <span className="font-semibold">
                            ৳ {formatNumber(totalBill)}
                        </span>
                    </div>

                 

                    <div className="flex justify-between border-b border-gray-300 px-3 py-1 text-[9px]">
                        <span>মোট অগ্রিম</span>

                        <span className="font-semibold">
                            ৳{" "}
                            {formatNumber(
                                totalAdvance,
                            )}
                        </span>
                    </div>

               

                    <div className="flex justify-between border-b border-gray-300 px-3 py-1 text-[9px]">
                        <span>মোট কর্তন</span>

                        <span className="font-semibold">
                            ৳{" "}
                            {formatNumber(
                                totalCutting,
                            )}
                        </span>
                    </div>

              

                    <div className="flex justify-between bg-gray-100 px-3 py-1.5 text-[10px] font-bold">
                        <span>মোট পেমেন্ট</span>

                        <span>
                            ৳{" "}
                            {formatNumber(
                                totalPayment,
                            )}
                        </span>
                    </div>
                </div>
            </div> */}

            {/* =====================================================
                SIGNATURE
            ===================================================== */}

            <div className="mt-12 grid grid-cols-3">
                {/* Manager */}

                <div className="text-center">
                    <div className="mx-autow-[150px]  border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        ম্যানেজার
                    </p>
                </div>

                {/* Owner */}

                <div className="text-center">
                    <div className="mx-autow-[150px]  border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        মালিক
                    </p>
                </div>

                <div className="text-center">
                    <div className="border-t border-black w-[150px] mx-auto" />
                    <p className="text-[10px] font-semibold mt-1">
                        অপারেটর
                    </p>
                </div>
            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            {/* <div className="mt-7 border-t border-gray-300 pt-2 text-center">
                <p className="text-[7px] text-gray-400">
                    রিপোর্ট প্রিন্টঃ{" "}
                    {formatBanglaDate({
                        date: new Date(),
                    })}{" "}
                    | Software by: Payratech.com
                </p>
            </div> */}
        </div>
    );
};

export default PaymentPrint;