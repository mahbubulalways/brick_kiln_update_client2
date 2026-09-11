"use client";

import { History, ReceiptText } from "lucide-react";

type TransactionType = "GIVEN" | "TAKEN" | "PAYMENT";

interface Transaction {
    id?: string;
    type?: TransactionType;
    amount?: string | number;
    transactionDate?: string;
    description?: string;
    balance?: string | number;
    createdAt?: string;
    remaining:number
}

interface TransactionHistoryCardProps {
    transactions?: Transaction[];
}

const formatDate = (date: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

const formatAmount = (amount?: string | number) => {
    if (amount === undefined || amount === null || amount === "") {
        return "-";
    }

    return Number(amount).toLocaleString("bn-BD");
};

const TransactionHistoryCard = ({
    transactions = [],
}: TransactionHistoryCardProps) => {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e5eaf0] px-7 py-6">
                <ReceiptText
                    size={25}
                    strokeWidth={1.8}
                    className="text-[#009bc2]"
                />

                <h2 className="text-[19px] font-semibold text-[#344054]">
                    লেনদেনের ইতিহাস
                </h2>
            </div>

            {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f6f8] text-[#9aabba]">
                        <History size={22} />
                    </div>

                    <p className="text-sm font-medium text-[#71819b]">
                        কোনো লেনদেনের তথ্য নেই
                    </p>

                    <p className="mt-1 text-xs text-[#a4b0bf]">
                        লেনদেন করলে এখানে তথ্য দেখা যাবে।
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[850px] border-collapse">
                        {/* Table Head */}
                        <thead>
                            <tr className="bg-[#f7f9fb]">
                                <th className="px-6 py-4 text-left text-[15px] font-semibold text-[#71819b]">
                                    তারিখ
                                </th>

                                <th className="px-6 py-4 text-left text-[15px] font-semibold text-[#71819b]">
                                    বিবরণ
                                </th>

                                <th className="px-6 py-4 text-right text-[15px] font-semibold text-[#71819b]">
                                    দেওয়া
                                </th>

                                <th className="px-6 py-4 text-right text-[15px] font-semibold text-[#71819b]">
                                    নেওয়া
                                </th>

                                <th className="px-6 py-4 text-right text-[15px] font-semibold text-[#71819b]">
                                    পরিশোধ
                                </th>

                                <th className="px-6 py-4 text-right text-[15px] font-semibold text-[#71819b]">
                                    বাকি
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {transactions.map((transaction, index) => {
                                const isGiven = transaction.type === "GIVEN";
                                const isTaken = transaction.type === "TAKEN";
                                const isPayment =
                                    transaction.type === "PAYMENT";

                                return (
                                    <tr
                                        key={transaction.id || index}
                                        className="border-t border-[#edf0f3] transition-colors hover:bg-[#fafcfd]"
                                    >
                                        {/* Date */}
                                        <td className="whitespace-nowrap px-6 py-5 text-left text-[15px] text-[#344054]">
                                            {formatDate(
                                                transaction.transactionDate!
                                            )}
                                        </td>

                                        {/* Description */}
                                        <td className="max-w-[250px] px-6 py-5 text-left text-[15px] text-[#344054]">
                                            {transaction.description || "-"}
                                        </td>

                                        {/* Given */}
                                        <td className="px-6 py-5 text-right text-[15px] font-medium">
                                            {isGiven ? (
                                                <span className="text-[#ff7900]">
                                                    ৳{" "}
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-[#ff7900]">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Taken */}
                                        <td className="px-6 py-5 text-right text-[15px] font-medium">
                                            {isTaken ? (
                                                <span className="text-[#039A63]">
                                                    ৳{" "}
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-[#039A63]">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Payment */}
                                        <td className="px-6 py-5 text-right text-[15px] font-medium">
                                            {isPayment ? (
                                                <span className="text-[#1769ff]">
                                                    ৳{" "}
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-[#1769ff]">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Balance */}
                                        <td className="px-6 py-5 text-right text-[15px] font-semibold text-[#344054]">
                                             ৳{" "}
                                                    {formatAmount(
                                                        transaction.remaining
                                                    )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransactionHistoryCard;