"use client";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

interface FinancialSummaryCardProps {
    amount: string | number;
    currentAmount: string | number;
}

const formatAmount = (amount: string | number) => {
    const value = Number(amount) || 0;

    return toBanglaNumber(
        new Intl.NumberFormat("en-IN").format(value)
    );
};

const FinancialSummaryCard = ({
    amount,
    currentAmount,
}: FinancialSummaryCardProps) => {
    const total = Number(amount) || 0;
    const remaining = Number(currentAmount) || 0;
    const paid = Math.max(total - remaining, 0);

    const progress =
        total > 0
            ? Math.min(Math.max((paid / total) * 100, 0), 100)
            : 0;

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e5eaf0] px-7 py-6">
                <ChartNoAxesColumnIncreasing
                    size={25}
                    strokeWidth={1.8}
                    className="text-[#009bc2]"
                />

                <h2 className="text-[19px] font-semibold text-[#344054]">
                    আর্থিক সারাংশ
                </h2>
            </div>

            <div className="space-y-3 p-7">
                {/* Total Amount */}
                <div className="flex items-center justify-between">
                    <span className="text-[15px] text-[#71819b]">
                        মোট ঋণ:
                    </span>

                    <span className="text-[18px] font-semibold text-[#344054]">
                        ৳ {formatAmount(total)}
                    </span>
                </div>

                {/* Paid Amount */}
                <div className="flex items-center justify-between">
                    <span className="text-[15px] text-[#71819b]">
                        পরিশোধিত:
                    </span>

                    <span className="text-[18px] font-semibold text-[#59a900]">
                        ৳ {formatAmount(paid)}
                    </span>
                </div>

                {/* Remaining Amount */}
                <div className="rounded-xl bg-[#f7f9fb] px-5 py-7 text-center">
                    <p className="mb-2 text-[15px] text-[#71819b]">
                        অবশিষ্ট
                    </p>

                    <p className="text-[28px] font-bold leading-none text-[#df2828]">
                        ৳ {formatAmount(remaining)}
                    </p>
                </div>

                {/* Progress */}
                <div className="pt-1">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[15px] text-[#71819b]">
                            অগ্রগতি
                        </span>

                        <span className="text-[14px] text-[#71819b]">
                            {toBanglaNumber(Math.round(progress))}%
                        </span>
                    </div>

                    <div className="h-[14px] w-full overflow-hidden rounded-full bg-[#e1e7f0]">
                        <div
                            className="h-full rounded-full bg-[#10b5ce] transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialSummaryCard;