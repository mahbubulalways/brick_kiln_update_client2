"use client";

import { IReceivablePayable } from "@/interface/due_mate";
import { Printer, UserRound } from "lucide-react";
import Link from "next/link";

const GivenDueList = ({
    dues,
    onPrint,
}: {
    dues: IReceivablePayable[];
    onPrint: (id: string) => void;
}) => {
    const totalCount = dues.length;

    const totalAmount = dues.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const totalCurrentAmount = dues.reduce(
        (sum, item) => sum + Number(item.currentAmount),
        0
    );

    return (
        <div className="w-full min-w-0">
            {/* Header */}
            <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
                <h2 className="shrink-0 text-[14px] font-medium text-[#039A63] sm:text-[18px]">
                    টাকা দেওয়ার লিস্ট
                    <span className="ml-1 text-[11px] text-gray-500 sm:ml-2 sm:text-sm">
                        ({totalCount})
                    </span>
                </h2>

                <div className="flex min-w-0 items-center justify-end">
                    <div className="flex items-center gap-3 text-[11px] font-medium sm:gap-6 sm:text-[15px]">
                        <p className="whitespace-nowrap text-[#039A63]">
                            মোট দেওয়া:{" "}
                            <span className="font-semibold">
                                ৳ {totalAmount.toLocaleString("bn-BD")}
                            </span>
                        </p>

                        <p className="whitespace-nowrap text-red-500">
                            মোট বাকি:{" "}
                            <span className="font-semibold">
                                ৳ {totalCurrentAmount.toLocaleString("bn-BD")}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-hidden rounded-md border border-gray-200">
                {/* Table Head */}
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(100px,180px)_minmax(100px,180px)_50px] bg-[#039A63] text-[13px] font-semibold text-white sm:text-[15px]">
                    <div className="min-w-0 px-3 py-3 sm:px-4">
                        নাম, ঠিকানা
                    </div>

                    <div className="border-l border-white/20 px-2 py-3 text-right sm:px-4">
                        টাকা দিয়েছি
                    </div>

                    <div className="border-l border-white/20 px-2 py-3 text-right sm:px-4">
                        বর্তমান বাকি
                    </div>

                    <div className="border-l border-white/20 px-2 py-3 text-center">
                        প্রিন্ট
                    </div>
                </div>

                {/* Table Body */}
                {dues.length > 0 ? (
                    dues.map((item) => (
                        <div
                            key={item.id}
                            className="grid min-h-[70px] grid-cols-[minmax(0,1fr)_minmax(100px,180px)_minmax(100px,180px)_50px] items-center border-t border-gray-200 transition hover:bg-gray-50 sm:min-h-[82px]"
                        >
                            {/* User Info + Amounts Link */}
                            <Link
                                href={`/dashboard/loan/profile/${item.id}`}
                                className="col-span-3 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(100px,180px)_minmax(100px,180px)] items-center"
                            >
                                {/* Name + Address */}
                                <div className="flex min-w-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 sm:h-11 sm:w-11">
                                        <UserRound className="h-5 w-5 text-black sm:h-6 sm:w-6" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium text-gray-900 sm:text-[16px]">
                                            {item.name}
                                        </h3>

                                        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-gray-500 sm:text-[13px]">
                                            {item.address || "ঠিকানা নেই"}
                                        </p>

                                        {item.phone && (
                                            <p className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-gray-400 sm:text-[12px]">
                                                {item.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Total Amount */}
                                <div className="border-l border-gray-200 px-2 text-right text-[13px] font-medium text-gray-900 sm:px-4 sm:text-[16px]">
                                    ৳{" "}
                                    {Number(item.amount).toLocaleString(
                                        "bn-BD"
                                    )}
                                </div>

                                {/* Current Amount */}
                                <div className="border-l border-gray-200 px-2 text-right text-[13px] font-semibold text-red-500 sm:px-4 sm:text-[16px]">
                                    ৳{" "}
                                    {Number(
                                        item.currentAmount
                                    ).toLocaleString("bn-BD")}
                                </div>
                            </Link>

                            {/* Print */}
                            <div className="flex items-center justify-center border-l border-gray-200">
                                <button
                                    type="button"
                                    title="প্রিন্ট"
                                    onClick={() => onPrint(item.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#039A63] transition hover:bg-[#039A63]/10 sm:h-9 sm:w-9"
                                >
                                    <Printer className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-sm text-gray-500">
                        কোনো তথ্য পাওয়া যায়নি
                    </div>
                )}
            </div>
        </div>
    );
};

export default GivenDueList;