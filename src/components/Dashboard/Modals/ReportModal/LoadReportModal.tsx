/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useGetLoadInfoReportQuery } from "@/redux/features/load.features";
import { getMovementTypeBangla } from "@/utils/getLoadTypeBangla";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { Printer } from "lucide-react";

export type TLoadInfoItem = {
    id: string;
    loadType: string;
    quantity: number | string;
};

type TLoadInfoReportModal = {
    isOpen: boolean;
    date: string;
    onClose: () => void;
};

const LoadInfoReportModal = ({
    isOpen,
    onClose,
    date,
}: TLoadInfoReportModal) => {
    const { isLoading, data } = useGetLoadInfoReportQuery({ date });

    const items: TLoadInfoItem[] = data?.data || [];

    const totalQuantity = items.reduce(
        (sum, item) => sum + Number(item.quantity),
        0,
    );



    // const handlePrintAll = () => {
    //     console.log("Print All:", items);
    // };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="লোডিং এর হিসাব"
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
                    <div className="mb-3 rounded-md border border-[#e5e7eb] bg-gray-50 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-gray-500">
                                    রিপোর্টের তারিখ
                                </p>

                                <p className="text-sm font-semibold text-gray-800">
                                    {date}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-gray-500">
                                    মোট পরিমাণ
                                </p>

                                <p className="text-base font-bold text-[#079b62]">
                                    {toBanglaNumber(totalQuantity)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-md border border-[#e5e7eb]">
                        <div className="grid grid-cols-3 overflow-hidden rounded-t-md bg-[#0f9f6e] text-sm font-semibold text-white">
                            <div className="flex h-12 items-center justify-center border-r border-[#0b9164]">
                                লোড টাইপ
                            </div>

                            <div className="flex h-12 items-center justify-center border-r border-[#0b9164]">
                                পরিমাণ
                            </div>

                            <div className="flex h-12 items-center justify-center">
                                ইউনিট
                            </div>
                        </div>

                        {items?.map((item, idx) => {
                            const quantity = Number(item?.quantity);
                            return (
                                <div
                                    key={idx}
                                    className="grid grid-cols-3 border-t border-[#e5e7eb] bg-white text-sm"
                                >
                                    <div className="flex min-h-16 items-center justify-center border-r border-[#e5e7eb] px-3 text-center font-medium text-gray-700">
                                        {getMovementTypeBangla(item.loadType)}
                                    </div>

                                    <div className="flex min-h-16 items-center justify-center border-r border-[#e5e7eb] px-3 text-center font-semibold text-[#079b62]">
                                        {toBanglaNumber(quantity)}
                                    </div>

                                    <div className="flex min-h-16 items-center justify-center px-3 text-center text-gray-600">
                                        পিস
                                    </div>
                                </div>
                            );
                        })}

                        <div className="grid grid-cols-3 border-t border-[#e5e7eb] bg-gray-50 text-sm font-bold">
                            <div className="flex min-h-12 items-center justify-center border-r border-[#e5e7eb] px-2 text-center text-gray-800">
                                মোট
                            </div>

                            <div className="flex min-h-12 items-center justify-center border-r border-[#e5e7eb] px-2 text-center text-[#079b62]">
                                {toBanglaNumber(totalQuantity)}
                            </div>

                            <div className="flex min-h-12 items-center justify-center px-2 text-center text-gray-600">
                                পিস
                            </div>
                        </div>
                    </div>

                    {/* <div className="my-3 flex justify-center">
                        <button
                            type="button"
                            onClick={handlePrintAll}
                            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#079b62] bg-white px-6 text-sm font-medium text-[#079b62] transition-all duration-200 hover:bg-[#079b62] hover:text-white"
                        >
                            <Printer size={17} />

                            <span>
                                লোডিং এর সকল রেকর্ড প্রিন্ট করুন
                            </span>
                        </button>
                    </div> */}
                </div>
            )}
        </CustomModal>
    );
};

export default LoadInfoReportModal;