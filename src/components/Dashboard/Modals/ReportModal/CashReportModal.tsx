/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useGetCashReportQuery } from "@/redux/features/cash.features";
import { Printer } from "lucide-react";

export type TCashItem = {
    id: string;
    amount: number | string;
    type: "IN" | "OUT" | string;
    source: string | null;
};

type TCashReportModal = {
    isOpen: boolean;
    date: string;
    onClose: () => void;
};

const CashReportModal = ({
    isOpen,
    onClose,
    date,
}: TCashReportModal) => {
    const { isLoading, data } = useGetCashReportQuery({ date });

    const items: TCashItem[] = data?.data || [];

    const totalCashIn = items
        .filter((item) => item.type === "INCOME")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalCashOut = items
        .filter((item) => item.type === "EXPENSE")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalBalance = totalCashIn - totalCashOut;

    const handlePrint = (item: TCashItem) => {
        console.log("Print:", item);
    };

    const handlePrintAll = () => {
        console.log("Print All:", items);
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="ইনভেস্টমেন্ট এর হিসাব"
            width="xl"
        >
            {isLoading ? (
                <div className="py-16 text-center text-sm text-gray-500">
                    <CustomStatus type="loading" />
                </div>
            ) : !items.length ? (
                <CustomStatus type="empty" />
            ) : (
                <div className="w-full">
                    <div className="overflow-hidden rounded-md border border-[#e5e7eb]">
                        <div className="grid grid-cols-4 overflow-hidden rounded-t-md bg-[#0f9f6e] text-sm font-semibold text-white">
                            <div className="flex h-12 text-nowrap items-center justify-center border-r border-[#0b9164]">
                                উৎস
                            </div>

                            <div className="flex h-12 text-nowrap items-center justify-center border-r border-[#0b9164]">
                                ইনটেক (ক্যাশ ইন)
                            </div>

                            <div className="flex h-12 text-nowrap items-center justify-center border-r border-[#0b9164]">
                                রিটার্ন (ক্যাশ আউট)
                            </div>

                            <div className="flex h-12 text-nowrap items-center justify-center border-r border-[#0b9164]">
                                ব্যালেন্স
                            </div>
                            {/* 
                            <div className="flex h-12 text-nowrap items-center justify-center">
                                প্রিন্ট
                            </div> */}
                        </div>

                        {items.map((item) => {
                            const amount = Number(item.amount);

                            return (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-4 border-t border-[#e5e7eb] bg-white text-sm"
                                >
                                    <div className="flex min-h-18 items-center justify-center border-r border-[#e5e7eb] px-2 text-center text-gray-700">
                                        {item.source || "অনির্দিষ্ট"}
                                    </div>

                                    <div className="flex min-h-18 items-center justify-center border-r border-[#e5e7eb] px-2 text-center font-medium text-[#079b62]">
                                        {item.type === "INCOME"
                                            ? amount.toLocaleString()
                                            : "-"}
                                    </div>

                                    <div className="flex min-h-18 items-center justify-center border-r border-[#e5e7eb] px-2 text-center font-medium text-[#ff5b4d]">
                                        {item.type === "EXPENSE"
                                            ? amount.toLocaleString()
                                            : "-"}
                                    </div>

                                    <div className="flex min-h-18 items-center justify-center border-r border-[#e5e7eb] px-2 text-center font-medium text-[#ff9800]">
                                        {item.type === "INCOME"
                                            ? `+${amount.toLocaleString()}`
                                            : `-${amount.toLocaleString()}`}
                                    </div>

                                    {/* <div className="flex min-h-18 items-center justify-center px-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handlePrint(item)
                                            }
                                            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#079b62] bg-white px-4 text-sm font-medium text-[#079b62] transition-all duration-200 hover:bg-[#079b62] hover:text-white"
                                        >
                                            <Printer
                                                size={17}
                                                strokeWidth={2.2}
                                            />

                                            <span>প্রিন্ট</span>
                                        </button>
                                    </div> */}
                                </div>
                            );
                        })}

                        <div className="grid grid-cols-4 border-t border-[#e5e7eb] xt-sm font-bold">
                            <div className="flex min-h-10 items-center justify-center border-r border-[#e5e7eb] px-2 text-center text-gray-800">
                                মোট
                            </div>

                            <div className="flex min-h-10 items-center justify-center border-r border-[#e5e7eb] px-2 text-center text-[#079b62]">
                                {totalCashIn.toLocaleString()}
                            </div>

                            <div className="flex min-h-10 items-center justify-center border-r border-[#e5e7eb] px-2 text-center text-[#ff5b4d]">
                                {totalCashOut.toLocaleString()}
                            </div>

                            <div className="flex min-h-10 items-center justify-center border-r border-[#e5e7eb] px-2 text-center text-[#ff9800]">
                                {totalBalance.toLocaleString()}
                            </div>

                            <div className="min-h-10" />
                        </div>
                    </div>

                    <div className="my-3 flex justify-center">
                        <button
                            type="button"
                            onClick={handlePrintAll}
                            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#079b62] bg-white px-6 text-sm font-medium text-[#079b62] transition-all duration-200 hover:bg-[#079b62] hover:text-white"
                        >
                            <Printer size={17} />

                            <span>
                                ক্যাশ ইন-আউট এর সকল রেকর্ড প্রিন্ট করুন
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </CustomModal>
    );
};

export default CashReportModal;