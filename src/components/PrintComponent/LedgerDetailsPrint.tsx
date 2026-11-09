"use client";

import { TPaymentResponse } from "@/interface/payment";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import LedgerUserInformation from "../Pages/LedgerPage/LedgerUserInformation";

type TLedgerDetails = {
    id: string;
    name: string;
    parentId: string | null;
    phoneNumber: string | null;
    rate: number | null;
    quantity: number | null;
    salary: number | null;
    serial: number | null;
    startDate: Date | null;
    openingBalance: number | null;
    openingBalanceType: string | null;
    weeklyFood: number | null;
    season: {
        name: string;
    } | null;
    _count: {
        payments: number;
    };
};
type TPaymentFilter =
    | "সব"
    | "রেগুলার পেমেন্ট"
    | "বাকি পেমেন্ট"
    | "অগ্রিম পেমেন্ট";

type TLedgerDetailsPrintProps = {
    payments: TPaymentResponse[];
    ledger?: TLedgerDetails;
    vataInformation: TVataInformation;
    startDate?: Date | null;
    endDate?: Date | null;
    paymentType: TPaymentFilter
};

const LedgerDetailsPrint = ({
    payments = [],
    ledger,
    vataInformation,
    startDate,
    endDate,
    paymentType
}: TLedgerDetailsPrintProps) => {
    // Payment calculations
    const totalAdvance = payments.reduce((sum, row) => {
        if (row?.paymentType === "অগ্রিম পেমেন্ট") {
            return sum + Number(row?.payment || 0);
        }

        return sum;
    }, 0);

    const totalBaki = payments.reduce((sum, row) => {
        if (row?.paymentType === "বাকি পেমেন্ট") {
            return sum + Number(row?.payment || 0);
        }

        return sum;
    }, 0);

    const totalRegular = payments.reduce((sum, row) => {
        if (row?.paymentType === "রেগুলার পেমেন্ট") {
            return sum + Number(row?.payment || 0);
        }

        return sum;
    }, 0);

    const totalPayment = totalAdvance + totalBaki + totalRegular;

    // Opening balance calculation
    const openingBalance = Number(ledger?.openingBalance ?? 0);
    const openingBalanceType = ledger?.openingBalanceType ?? "";

    const signedOpeningBalance =
        openingBalanceType === "দেনা"
            ? -openingBalance
            : openingBalance;

    // Final balance calculation
    const finalBalance = signedOpeningBalance + totalPayment;
    const balanceAmount = Math.abs(finalBalance);

    // Table calculations
    const totalQuantity = payments.reduce((sum, row) => {
        return sum + Number(row?.quantity || 0);
    }, 0);

    const totalBill = payments.reduce((sum, row) => {
        return sum + Number(row?.totalBill || 0);
    }, 0);

    const totalPaymentAmount = payments.reduce((sum, row) => {
        return sum + Number(row?.payment || 0);
    }, 0);

    const totalCutting = payments.reduce((sum, row) => {
        return sum + Number(row?.cutting || 0);
    }, 0);

    const totalKombesi = payments.reduce((sum, row) => {
        return sum + Number(row?.paymentDifference || 0);
    }, 0);

    const formatDatePeriod = () => {
        if (startDate && endDate) {
            return `${formatBanglaDate({
                date: startDate,
            })} - ${formatBanglaDate({
                date: endDate,
            })}`;
        }

        if (startDate) {
            return formatBanglaDate({
                date: startDate,
            });
        }

        return "সকল হিসাব";
    };





    // Advance payment
    const ogrimPayment = payments
        .filter((p) => p.paymentType === "অগ্রিম পেমেন্ট")
        .reduce((sum, p) => sum + Number(p.payment || 0), 0);

    // Due payment
    const bakiPayment = payments
        .filter((p) => p.paymentType === "বাকি পেমেন্ট")
        .reduce((sum, p) => sum + Number(p.payment || 0), 0);

    // Regular payment
    const regularPayment = payments
        .filter((p) => p.paymentType === "রেগুলার পেমেন্ট")
        .reduce((sum, p) => sum + Number(p.payment || 0), 0);



    return (
        <div
            id="ledger-details-print"
            className="relative w-full bg-white text-black"
        >
            {/* Watermark */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[100%] z-0 flex -translate-x-1/2 -translate-y-1/2 select-none"
            >
                <span
                    className="rotate-[-18deg] whitespace-nowrap font-extrabold text-black opacity-[0.04]"
                    style={{
                        fontSize: "170px",
                    }}
                >
                    {vataInformation?.shortForm?.split("").join(".")}
                </span>
            </div>

            <div className="relative z-10 text-black">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                        {vataInformation?.shortForm?.split("").join(".")}
                    </div>

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

                {/* Vata Information */}
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

                {(vataInformation?.challanPersonOneName ||
                    vataInformation?.challanPersonTwoName ||
                    vataInformation?.challanManagerPhoneNumber) && (
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] font-semibold">
                            {vataInformation?.challanPersonOneName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonOneName}
                                    </span>
                                    : {vataInformation?.challanPersonOnePhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanPersonTwoName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonTwoName}
                                    </span>
                                    : {vataInformation?.challanPersonTwoPhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanManagerPhoneNumber && (
                                <span>
                                    <span className="font-bold">ম্যানেজার</span>
                                    : {vataInformation?.challanManagerPhoneNumber}
                                </span>
                            )}
                        </div>
                    )}
            </div>

            {/* Page Title */}
            <div className="mx-auto mt-3 flex w-max items-center justify-center rounded-full bg-[#E5E7EB] px-6 py-1">
                <p className="whitespace-nowrap text-[15px] font-bold leading-none">
                    খতিয়ান বিস্তারিত
                </p>
            </div>


            {/* Date Period */}
            <div className="relative mt-4 flex min-h-[30px] items-center justify-between">
                <p className="text-[12px] font-semibold leading-none">
                    হিসাবের সময়ঃ {formatDatePeriod()}
                </p>
            </div>
            <div className="rounded border border-gray-200 bg-white px-2 py-1.5">
                <h3 className="mb-1 text-xs font-bold text-black">
                    চূড়ান্ত দেনা-পাওনা হিসাব
                </h3>

                <div className="space-y-1 text-[11px] text-black">
                    <div className="flex justify-between gap-2">
                        <span>প্রারম্ভিক ব্যালেন্স ({openingBalanceType || "-"})</span>
                        <span className="font-semibold">
                            ৳ {toBanglaNumber(signedOpeningBalance)}
                        </span>
                    </div>
                    {paymentType === "সব" ? (
                        <>


                            <div className="flex justify-between gap-2">
                                <span>রেগুলার পেমেন্ট</span>
                                <span className="font-semibold">
                                    ৳ {toBanglaNumber(regularPayment)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span>অগ্রিম পেমেন্ট</span>
                                <span className="font-semibold">
                                    ৳ {toBanglaNumber(ogrimPayment)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span>বাকি পেমেন্ট</span>
                                <span className="font-semibold">
                                    ৳ {toBanglaNumber(bakiPayment)}
                                </span>
                            </div>


                        </>
                    ) : paymentType === "অগ্রিম পেমেন্ট" ? (
                        <div className="flex justify-between gap-2">
                            <span>অগ্রিম পেমেন্ট</span>
                            <span className="font-semibold">
                                ৳ {toBanglaNumber(ogrimPayment)}
                            </span>
                        </div>
                    ) : paymentType === "বাকি পেমেন্ট" ? (
                        <div className="flex justify-between gap-2">
                            <span>বাকি পেমেন্ট</span>
                            <span className="font-semibold">
                                ৳ {toBanglaNumber(bakiPayment)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-between gap-2">
                            <span>রেগুলার পেমেন্ট</span>
                            <span className="font-semibold">
                                ৳ {toBanglaNumber(regularPayment)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between gap-2 border-t border-gray-300 pt-1 font-bold">
                        <span>মোট পেমেন্ট</span>
                        <span>
                            ৳ {toBanglaNumber(balanceAmount)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Table */}
            <table className="mt-2 w-full border-collapse text-[9px] text-black">
                <thead>
                    <tr className="bg-[#F1F2F3]">
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            ক্রম
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            তারিখ
                        </th>
                        <th className="border border-gray-300 px-1 py-1 font-semibold">
                            পেমেন্টের বিবরণ
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            পেমেন্টের ধরণ
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            পরিমাণ
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            দর
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            মোট বিল
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            অগ্রিম
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            কর্তন
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            পেমেন্ট
                        </th>
                        <th className="whitespace-nowrap border border-gray-300 px-1 py-1 font-semibold">
                            কম/বেশি
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {payments?.length > 0 ? (
                        <>
                            {payments.map(
                                (row: TPaymentResponse, index: number) => (
                                    <tr
                                        key={row?.id || index}
                                        className="font-normal"
                                    >
                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            {toBanglaNumber(index + 1)}
                                        </td>

                                        <td className="whitespace-nowrap border border-gray-300 px-1 py-1 text-center">
                                            {formatBanglaDate({
                                                date: row?.paymentDate,
                                            })}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            {row?.paymentDetails || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            {row?.paymentType || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            {toBanglaNumber(
                                                Number(
                                                    row?.quantity || 0
                                                ).toLocaleString()
                                            )}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(
                                                    row?.rate || 0
                                                ).toLocaleString()
                                            )}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(
                                                    row?.totalBill || 0
                                                ).toLocaleString()
                                            )}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                row?.paymentType ===
                                                    "অগ্রিম পেমেন্ট"
                                                    ? Number(
                                                        row?.payment || 0
                                                    ).toLocaleString()
                                                    : "0"
                                            )}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(
                                                    row?.cutting || 0
                                                ).toLocaleString()
                                            )}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1 text-center">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(
                                                    row?.payment || 0
                                                ).toLocaleString()
                                            )}
                                        </td>

                                        <td
                                            className={`border border-gray-300 px-1 py-1 text-center ${Number(
                                                row?.paymentDifference || 0
                                            ) < 0
                                                ? "text-red-600"
                                                : Number(
                                                    row?.paymentDifference ||
                                                    0
                                                ) > 0
                                                    ? "text-green-600"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(
                                                    row?.paymentDifference || 0
                                                ).toLocaleString()
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}

                            {/* Total Row */}
                            <tr className="bg-[#F1F2F3] font-semibold">
                                <td
                                    colSpan={4}
                                    className="border border-gray-300 px-1 py-1 text-right"
                                >
                                    মোট যোগ
                                </td>

                                <td className="border border-gray-300 px-1 py-1 text-center">
                                    {toBanglaNumber(
                                        totalQuantity.toLocaleString()
                                    )}
                                </td>

                                <td className="border border-gray-300 px-1 py-1 text-center">
                                    -
                                </td>

                                <td className="border border-gray-300 px-1 py-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        totalBill.toLocaleString()
                                    )}
                                </td>

                                <td className="border border-gray-300 px-1 py-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        totalAdvance.toLocaleString()
                                    )}
                                </td>

                                <td className="border border-gray-300 px-1 py-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        totalCutting.toLocaleString()
                                    )}
                                </td>

                                <td className="border border-gray-300 px-1 py-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        totalPaymentAmount.toLocaleString()
                                    )}
                                </td>

                                <td className="border border-gray-300 px-1 py-1 text-center">
                                    {toBanglaNumber(
                                        totalKombesi.toLocaleString()
                                    )}
                                </td>
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={11}
                                className="border border-gray-300 py-4 text-center"
                            >
                                কোনো তথ্য পাওয়া যায়নি
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Signature */}
            <div className="mt-14 grid grid-cols-3">
                <div className="text-center">
                    <div className="mx-auto w-[150px] border-t border-black" />
                    <p className="mt-1 text-[11px] font-semibold">
                        ম্যানেজার
                    </p>
                </div>

                <div className="text-center">
                    <div className="mx-auto w-[150px] border-t border-black" />
                    <p className="mt-1 text-[11px] font-semibold">
                        মালিক
                    </p>
                </div>

                <div className="text-center">
                    <div className="mx-auto w-[150px] border-t border-black" />
                    <p className="mt-1 text-[10px] font-semibold">
                        অপারেটর
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LedgerDetailsPrint;