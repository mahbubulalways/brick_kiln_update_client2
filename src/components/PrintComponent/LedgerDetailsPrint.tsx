"use client";

import { TPaymentResponse } from "@/interface/payment";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

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

type TLedgerDetailsPrintProps = {
    payments: TPaymentResponse[];
    ledger?: TLedgerDetails;
    vataInformation: TVataInformation;
    startDate?: Date | null;
    endDate?: Date | null;
};


const LedgerDetailsPrint = ({
    payments = [],
    ledger,
    vataInformation,
    startDate,
    endDate,
}: TLedgerDetailsPrintProps) => {
    const totalAdvance = payments.reduce((sum, row) => {
        if (row?.paymentType === "অগ্রিম পেমেন্ট") {
            return sum + Number(row?.payment || 0);
        }

        return sum;
    }, 0);

    const totalPayment = payments.reduce((sum, row) => {
        if (row?.paymentType !== "অগ্রিম পেমেন্ট") {
            return sum + Number(row?.payment || 0);
        }

        return sum;
    }, 0);

    const totalAdvanceDue = payments.reduce((sum, row) => {
        if (row?.paymentType === "অগ্রিম পেমেন্ট") {
            const difference = Number(row?.paymentDifference || 0);

            return sum + Math.max(difference, 0);
        }

        return sum;
    }, 0);

    const totalDue = payments.reduce((sum, row) => {
        const totalBill = Number(row?.totalBill || 0);
        const cutting = Number(row?.cutting || 0);
        const payment = Number(row?.payment || 0);

        const due = totalBill - cutting - payment;

        return sum + Math.max(due, 0);
    }, 0);

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

    return (
        <div
            id="ledger-details-print"
            className="relative w-full bg-white text-black"
        >
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
                    {vataInformation?.shortForm
                        ?.split("")
                        .join(".")}
                </span>
            </div>

            <div className="relative z-10 text-black">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                        {vataInformation?.shortForm
                            ?.split("")
                            .join(".")}
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
                                    :{" "}
                                    {
                                        vataInformation?.challanPersonOnePhoneNumber
                                    }
                                </span>
                            )}

                            {vataInformation?.challanPersonTwoName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonTwoName}
                                    </span>
                                    :{" "}
                                    {
                                        vataInformation?.challanPersonTwoPhoneNumber
                                    }
                                </span>
                            )}

                            {vataInformation?.challanManagerPhoneNumber && (
                                <span>
                                    <span className="font-bold">
                                        ম্যানেজার
                                    </span>
                                    :{" "}
                                    {vataInformation?.challanManagerPhoneNumber}
                                </span>
                            )}
                        </div>
                    )}
            </div>
            <div className=" flex  items-center justify-center rounded-full bg-[#E5E7EB] px-6 w-max mx-auto mt-3 py-1">
                <p className="whitespace-nowrap text-[15px] font-bold leading-none">
                    খতিয়ান বিস্তারিত
                </p>
            </div>

            <div className="mt-2 overflow-hidden border border-gray-300">
                {/* Ledger Person */}
                <div className="flex items-center justify-between border-b border-gray-300 bg-[#F1F2F3] px-3 py-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold">
                            {ledger?.name || "-"}
                        </span>

                        {ledger?.phoneNumber && (
                            <>
                                <span className="text-gray-400">•</span>

                                <span className="text-[10px]">
                                    {ledger.phoneNumber}
                                </span>
                            </>
                        )}

                        {ledger?.season?.name && (
                            <>
                                <span className="text-gray-400">•</span>

                                <span className="text-[10px] font-semibold">
                                    {ledger.season.name}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-[10px]">
                        {/* {ledger?.serial !== null && (
                            <span>
                                সিরিয়াল:{" "}
                                <span className="font-bold">
                                    {toBanglaNumber(ledger?.serial!)}
                                </span>
                            </span>
                        )} */}

                        <span>
                            মোট পেমেন্ট:{" "}
                            <span className="font-bold">
                                {toBanglaNumber(
                                    ledger?._count?.payments ?? 0
                                )}
                            </span>
                            টি
                        </span>
                    </div>
                </div>

                {/* Ledger Information */}
                <div className="grid grid-cols-6">
                    <div className="border-r border-gray-300 px-2 py-1.5 text-center">
                        <p className="text-[9px] text-gray-500">
                            রেট
                        </p>

                        <p className="text-[11px] font-bold">
                            ৳ {toBanglaNumber(ledger?.rate ?? 0)}
                        </p>
                    </div>

                    <div className="border-r border-gray-300 px-2 py-1.5 text-center">
                        <p className="text-[9px] text-gray-500">
                            পরিমাণ
                        </p>

                        <p className="text-[11px] font-bold">
                            {toBanglaNumber(ledger?.quantity ?? 0)}
                        </p>
                    </div>

                    <div className="border-r border-gray-300 px-2 py-1.5 text-center">
                        <p className="text-[9px] text-gray-500">
                            বেতন
                        </p>

                        <p className="text-[11px] font-bold">
                            ৳ {toBanglaNumber(ledger?.salary ?? 0)}
                        </p>
                    </div>

                    <div className="border-r border-gray-300 px-2 py-1.5 text-center">
                        <p className="text-[9px] text-gray-500">
                            সাপ্তাহিক খোরাকি
                        </p>

                        <p className="text-[11px] font-bold">
                            ৳ {toBanglaNumber(ledger?.weeklyFood ?? 0)}
                        </p>
                    </div>

                    <div className="border-r border-gray-300 px-2 py-1.5 text-center">
                        <p className="text-[9px] text-gray-500">
                            যোগদানের তারিখ
                        </p>

                        <p className="text-[11px] font-bold">
                            {ledger?.startDate
                                ? formatBanglaDate({
                                    date: ledger.startDate,
                                })
                                : "-"}
                        </p>
                    </div>

                    <div className="px-2 py-1.5 text-center">
                        <p className="text-[9px] text-gray-500">
                            ওপেনিং ব্যালেন্স
                        </p>

                        <p className="text-[11px] font-bold">
                            ৳ {toBanglaNumber(
                                ledger?.openingBalance ?? 0
                            )}

                            {ledger?.openingBalanceType && (
                                <span className="ml-1 text-[9px] font-normal">
                                    ({ledger.openingBalanceType})
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>


            <div className="relative mt-4 flex min-h-[30px] items-center justify-between">
                <p className="text-[12px] font-semibold leading-none">
                    হিসাবের সময়ঃ {formatDatePeriod()}
                </p>



            </div>

            {/* <div className="mt-3 grid grid-cols-5 gap-2">
                <div className="rounded border border-gray-300 bg-[#F1F2F3] px-2 py-1 text-center">
                    <p className="text-[10px] font-semibold">
                        মোট বিল
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold">
                        ৳ {toBanglaNumber(totalBill.toLocaleString())}
                    </p>
                </div>

                <div className="rounded border border-gray-300 bg-[#F1F2F3] px-2 py-1 text-center">
                    <p className="text-[10px] font-semibold">
                        মোট পেমেন্ট
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold">
                        ৳{" "}
                        {toBanglaNumber(
                            totalPaymentAmount.toLocaleString()
                        )}
                    </p>
                </div>

                <div className="rounded border border-gray-300 bg-[#F1F2F3] px-2 py-1 text-center">
                    <p className="text-[10px] font-semibold">
                        অগ্রিম
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold">
                        ৳ {toBanglaNumber(totalAdvance.toLocaleString())}
                    </p>
                </div>

                <div className="rounded border border-gray-300 bg-[#F1F2F3] px-2 py-1 text-center">
                    <p className="text-[10px] font-semibold">
                        অগ্রিম বাকি
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold">
                        ৳{" "}
                        {toBanglaNumber(
                            totalAdvanceDue.toLocaleString()
                        )}
                    </p>
                </div>

                <div className="rounded border border-gray-300 bg-[#F1F2F3] px-2 py-1 text-center">
                    <p className="text-[10px] font-semibold">
                        বাকি
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold">
                        ৳ {toBanglaNumber(totalDue.toLocaleString())}
                    </p>
                </div>
            </div> */}

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
                                (
                                    row: TPaymentResponse,
                                    index: number
                                ) => (
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

            {/* <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="border border-gray-300 px-2 py-1.5 text-center">
                    <p className="text-[10px] font-semibold">
                        মোট পরিমাণ
                    </p>
                    <p className="text-[12px] font-bold">
                        {toBanglaNumber(
                            totalQuantity.toLocaleString()
                        )}
                    </p>
                </div>

                <div className="border border-gray-300 px-2 py-1.5 text-center">
                    <p className="text-[10px] font-semibold">
                        মোট কর্তন
                    </p>
                    <p className="text-[12px] font-bold">
                        ৳{" "}
                        {toBanglaNumber(
                            totalCutting.toLocaleString()
                        )}
                    </p>
                </div>

                <div className="border border-gray-300 px-2 py-1.5 text-center">
                    <p className="text-[10px] font-semibold">
                        মোট বাকি
                    </p>
                    <p className="text-[12px] font-bold">
                        ৳ {toBanglaNumber(totalDue.toLocaleString())}
                    </p>
                </div>
            </div> */}

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
                    <div className="border-t border-black w-[150px] mx-auto" />
                    <p className="text-[10px] font-semibold mt-1">
                        অপারেটর
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LedgerDetailsPrint;