"use client";

import React, { useEffect } from "react";

import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { useGetSingleDueMateQuery } from "@/redux/features/due_mate.features";

type TransactionType = "GIVEN" | "TAKEN" | "PAYMENT";

interface TTransaction {
    id?: string;
    type?: TransactionType;
    amount?: string | number;
    transactionDate?: string;
    description?: string;
    balance?: string | number;
    createdAt?: string;
    remaining: number;
}

type TDueMatePrintProps = {
    id: string;
    vataInformation: TVataInformation;
    onReady?: () => void;
};

const DueMatePrint = ({
    id,
    vataInformation,
    onReady,
}: TDueMatePrintProps) => {
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetSingleDueMateQuery(id, {
        skip: !id,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const due = data?.data;

    useEffect(() => {
        if (!isLoading && !isFetching && due) {
            const timer = setTimeout(() => {
                onReady?.();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [due, isLoading, isFetching, onReady]);

    if (isLoading || isFetching) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-[14px] font-semibold">
                হিসাবের তথ্য লোড হচ্ছে...
            </div>
        );
    }

    if (isError || !due) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-[14px] font-semibold">
                হিসাবের তথ্য পাওয়া যায়নি।
            </div>
        );
    }

    const transactions: TTransaction[] = due.transactions ?? [];

    const totalAmount = Number(due.amount || 0);

    const currentAmount = Number(due.currentAmount || 0);

    const paidAmount = Math.max(
        totalAmount - currentAmount,
        0,
    );

    const isGiven = due.transactionType === "GIVEN";

    const taka = (value: number) =>
        `৳ ${toBanglaNumber(
            Number(value || 0).toLocaleString("en-US"),
        )}`;

    return (
        <div className="relative w-full bg-white px-[6mm] py-[6mm] text-black">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="-rotate-[18deg] select-none text-[170px] font-extrabold leading-none text-black opacity-[0.035]">
                    {vataInformation?.shortForm
                        ?.split("")
                        .join(".")}
                </div>
            </div>

            <div className="relative z-10">
                <div className="border-b-2 border-black pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex h-11 w-[85px] shrink-0 items-center justify-center rounded-md border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                            {vataInformation?.shortForm
                                ?.split("")
                                .join(".")}
                        </div>

                        <div className="text-right leading-tight">
                            {vataInformation?.ownerName && (
                                <p className="text-[13px] font-bold">
                                    প্রোঃ {vataInformation.ownerName}
                                </p>
                            )}

                            {vataInformation?.ownerPhoneNumber && (
                                <p className="mt-0.5 text-[13px] font-semibold">
                                    {vataInformation.ownerPhoneNumber}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <h1 className="text-[30px] font-extrabold leading-tight">
                            {vataInformation?.nameBangla}
                        </h1>

                        {vataInformation?.shortDescription && (
                            <p className="mt-0.5 text-[11px] font-semibold">
                                {vataInformation.shortDescription}
                            </p>
                        )}
                    </div>

                    {(vataInformation?.additionalAddress ||
                        vataInformation?.address) && (
                            <div className="mt-2 border-y border-black py-1.5 text-center text-[11px] font-semibold">
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
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[10px] font-semibold">
                                {vataInformation?.challanPersonOneName && (
                                    <span>
                                        {vataInformation.challanPersonOneName}
                                    </span>
                                )}

                                {vataInformation?.challanPersonTwoName && (
                                    <span>
                                        {vataInformation.challanPersonTwoName}
                                    </span>
                                )}

                                {vataInformation?.challanManagerPhoneNumber && (
                                    <span>
                                        {vataInformation.challanManagerPhoneNumber}
                                    </span>
                                )}
                            </div>
                        )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="w-[145px] text-[10px] font-semibold">
                        {due.transactionDate && (
                            <>
                                হিসাবের তারিখ:{" "}
                                {formatBanglaDate({
                                    date: due.transactionDate,
                                })}
                            </>
                        )}
                    </div>

                    <div className="rounded-full border-2 border-black px-7 py-1.5 text-[17px] font-extrabold">
                        দেনা-পাওনা হিসাব
                    </div>

                    <div className="w-[145px] text-right text-[10px] font-semibold" />
                </div>

                <div className="mt-4 overflow-hidden rounded-md border-2 border-black">
                    <div className="flex items-center justify-between border-b-2 border-black bg-black px-3 py-1.5 text-white">
                        <span className="text-[13px] font-bold">
                            গ্রাহকের তথ্য
                        </span>

                        <span className="text-[10px] font-semibold">
                            {isGiven ? "পাওনা হিসাব" : "দেনা হিসাব"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-3 py-3 text-[11px]">
                        <div>
                            <span className="font-bold">নাম:</span>{" "}
                            {due.name || "-"}
                        </div>

                        <div>
                            <span className="font-bold">মোবাইল:</span>{" "}
                            {due.phone || "-"}
                        </div>

                        <div>
                            <span className="font-bold">ঠিকানা:</span>{" "}
                            {due.address || "-"}
                        </div>

                        <div>
                            <span className="font-bold">
                                হিসাবের ধরন:
                            </span>{" "}
                            <span className="font-bold">
                                {isGiven ? "পাওনা" : "দেনা"}
                            </span>
                        </div>

                        {due.description && (
                            <div className="col-span-2 border-t border-gray-300 pt-1.5">
                                <span className="font-bold">
                                    অতিরিক্ত বিবরণ:
                                </span>{" "}
                                {due.description}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-md border-2 border-black">
                    <div className="border-b-2 border-black bg-black px-3 py-1.5 text-[13px] font-bold text-white">
                        আর্থিক সারাংশ
                    </div>

                    <div className="grid grid-cols-3">
                        <div className="border-r border-black px-3 py-3 text-center">
                            <p className="text-[10px] font-semibold text-gray-700">
                                মোট হিসাব
                            </p>

                            <p className="mt-1 text-[17px] font-extrabold">
                                {taka(totalAmount)}
                            </p>
                        </div>

                        <div className="border-r border-black px-3 py-3 text-center">
                            <p className="text-[10px] font-semibold text-gray-700">
                                মোট পরিশোধ
                            </p>

                            <p className="mt-1 text-[17px] font-extrabold">
                                {taka(paidAmount)}
                            </p>
                        </div>

                        <div className="px-3 py-3 text-center">
                            <p className="text-[10px] font-semibold text-gray-700">
                                বর্তমান বাকি
                            </p>

                            <p className="mt-1 text-[18px] font-extrabold">
                                {taka(currentAmount)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-[15px] font-extrabold">
                                লেনদেনের বিবরণ
                            </h2>

                            <p className="mt-0.5 text-[9px] font-medium text-gray-600">
                                এই হিসাবের অন্তর্ভুক্ত সকল লেনদেন
                            </p>
                        </div>

                        <div className="rounded border border-black px-2 py-1 text-[10px] font-bold">
                            মোট লেনদেন:{" "}
                            {toBanglaNumber(transactions.length)}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-md border-2 border-black">
                        <table className="w-full border-collapse text-[10px]">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="w-[5%] border border-black px-1.5 py-1.5 text-center">
                                        #
                                    </th>

                                    <th className="w-[16%] border border-black px-1.5 py-1.5 text-left">
                                        তারিখ
                                    </th>

                                    <th className="w-[14%] border border-black px-1.5 py-1.5 text-right">
                                        দেওয়া
                                    </th>

                                    <th className="w-[14%] border border-black px-1.5 py-1.5 text-right">
                                        নেওয়া
                                    </th>

                                    <th className="w-[14%] border border-black px-1.5 py-1.5 text-right">
                                        পরিশোধ
                                    </th>

                                    <th className="w-[14%] border border-black px-1.5 py-1.5 text-right">
                                        বাকি
                                    </th>

                                    <th className="border border-black px-1.5 py-1.5 text-left">
                                        বিবরণ
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction, index) => {
                                        const isGiven =
                                            transaction.type === "GIVEN";

                                        const isTaken =
                                            transaction.type === "TAKEN";

                                        const isPayment =
                                            transaction.type === "PAYMENT";

                                        return (
                                            <tr
                                                key={
                                                    transaction.id || index
                                                }
                                                className="border-b border-black"
                                            >
                                                <td className="border border-black px-1.5 py-1.5 text-center">
                                                    {toBanglaNumber(index + 1)}
                                                </td>

                                                <td className="whitespace-nowrap border border-black px-1.5 py-1.5">
                                                    {transaction.transactionDate
                                                        ? formatBanglaDate({
                                                            date: transaction.transactionDate,
                                                        })
                                                        : "-"}
                                                </td>

                                                <td className="border border-black px-1.5 py-1.5 text-right font-semibold">
                                                    {isGiven
                                                        ? taka(
                                                            Number(
                                                                transaction.amount,
                                                            ),
                                                        )
                                                        : "-"}
                                                </td>

                                                <td className="border border-black px-1.5 py-1.5 text-right font-semibold">
                                                    {isTaken
                                                        ? taka(
                                                            Number(
                                                                transaction.amount,
                                                            ),
                                                        )
                                                        : "-"}
                                                </td>

                                                <td className="border border-black px-1.5 py-1.5 text-right font-semibold">
                                                    {isPayment
                                                        ? taka(
                                                            Number(
                                                                transaction.amount,
                                                            ),
                                                        )
                                                        : "-"}
                                                </td>

                                                <td className="border border-black px-1.5 py-1.5 text-right font-bold">
                                                    {taka(transaction.remaining)}
                                                </td>

                                                <td className="border border-black px-1.5 py-1.5">
                                                    {transaction.description || "-"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="border border-black px-2 py-5 text-center font-semibold"
                                        >
                                            কোনো লেনদেনের তথ্য পাওয়া যায়নি
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td
                                        colSpan={2}
                                        className="border border-black px-1.5 py-2 text-right font-extrabold"
                                    >
                                        মোট
                                    </td>

                                    <td className="border border-black px-1.5 py-2 text-right font-extrabold">
                                        {taka(
                                            transactions.reduce(
                                                (sum, transaction) =>
                                                    transaction.type === "GIVEN"
                                                        ? sum +
                                                        Number(
                                                            transaction.amount || 0,
                                                        )
                                                        : sum,
                                                0,
                                            ),
                                        )}
                                    </td>

                                    <td className="border border-black px-1.5 py-2 text-right font-extrabold">
                                        {taka(
                                            transactions.reduce(
                                                (sum, transaction) =>
                                                    transaction.type === "TAKEN"
                                                        ? sum +
                                                        Number(
                                                            transaction.amount || 0,
                                                        )
                                                        : sum,
                                                0,
                                            ),
                                        )}
                                    </td>

                                    <td className="border border-black px-1.5 py-2 text-right font-extrabold">
                                        {taka(paidAmount)}
                                    </td>

                                    <td className="border border-black px-1.5 py-2 text-right font-extrabold">
                                        {transactions.length > 0
                                            ? taka(
                                                transactions[
                                                    transactions.length - 1
                                                ].remaining,
                                            )
                                            : taka(0)}
                                    </td>

                                    <td className="border border-black" />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-md border-2 border-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div>
                            <p className="text-[10px] font-semibold text-gray-600">
                                বর্তমান হিসাব
                            </p>

                            <p className="mt-0.5 text-[19px] font-extrabold">
                                {isGiven ? "পাওনা" : "দেনা"}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-semibold text-gray-600">
                                বর্তমান বাকি
                            </p>

                            <p className="mt-0.5 text-[22px] font-extrabold">
                                {taka(currentAmount)}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-black bg-gray-50 px-4 py-1.5 text-center text-[10px] font-semibold">
                        {currentAmount > 0
                            ? `বর্তমানে ${isGiven
                                ? "গ্রাহকের কাছ থেকে টাকা পাওনা আছে"
                                : "গ্রাহককে টাকা পরিশোধ করতে হবে"
                            }`
                            : "এই হিসাবে বর্তমানে কোনো বাকি নেই"}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-16">
                    <div className="text-center">
                        <div className="mx-auto w-[145px] border-t border-black pt-1.5">
                            <p className="text-[11px] font-bold">
                                হিসাব পরিচালনাকারী
                            </p>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto w-[145px] border-t border-black pt-1.5">
                            <p className="text-[11px] font-bold">
                                গ্রাহকের স্বাক্ষর
                            </p>
                        </div>
                    </div>
                </div>

                {(due.witnessOne || due.witnessTwo) && (
                    <div className="mt-8 grid grid-cols-2 gap-16">
                        <div className="text-center">
                            {due.witnessOne && (
                                <>
                                    <p className="text-[10px] font-semibold text-gray-600">
                                        সাক্ষী
                                    </p>

                                    <p className="mt-1 text-[11px] font-bold">
                                        {due.witnessOne}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="text-center">
                            {due.witnessTwo && (
                                <>
                                    <p className="text-[10px] font-semibold text-gray-600">
                                        সাক্ষী
                                    </p>

                                    <p className="mt-1 text-[11px] font-bold">
                                        {due.witnessTwo}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-8 border-t border-black pt-2 text-center">
                    <p className="text-[9px] font-semibold">
                        এই হিসাবটি{" "}
                        {vataInformation?.nameBangla || "ভাটা"} কর্তৃক
                        সংরক্ষিত হিসাবের ভিত্তিতে প্রস্তুত করা হয়েছে।
                    </p>

                    <p className="mt-0.5 text-[8px] text-gray-500">
                        Printed Account Statement
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DueMatePrint;