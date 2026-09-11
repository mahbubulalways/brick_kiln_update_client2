"use client";

import { CreditCard, Plus, Zap } from "lucide-react";

interface QuickActionsCardProps {
    onNewTransaction?: () => void;
    onPayment?: () => void;
}

const QuickActionsCard = ({
    onNewTransaction,
    onPayment,
}: QuickActionsCardProps) => {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e5eaf0] px-7 py-6">
                <Zap
                    size={25}
                    strokeWidth={1.8}
                    className="text-[#009bc2]"
                />

                <h2 className="text-[19px] font-semibold text-[#344054]">
                    দ্রুত পদক্ষেপ
                </h2>
            </div>

            {/* Buttons */}
            <div className="space-y-4 p-7">
                <button
                    type="button"
                    onClick={onNewTransaction}
                    className="flex py-2 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0b99b5] text-[16px] font-medium text-white transition hover:bg-[#078aa4]"
                >
                    <Plus size={22} />
                    নতুন লেনদেন
                </button>

                <button
                    type="button"
                    onClick={onPayment}
                    className="flex py-2 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#59a900] text-[16px] font-medium text-white transition hover:bg-[#4e9700]"
                >
                    <CreditCard size={19} />
                    ঋণ পরিশোধ
                </button>
            </div>
        </div>
    );
};

export default QuickActionsCard;