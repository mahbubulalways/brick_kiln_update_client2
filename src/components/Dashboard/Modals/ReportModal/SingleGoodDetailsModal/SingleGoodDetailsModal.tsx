"use client";

import { useState } from "react";
import {
    Edit,
    Grid2X2,
    MapPin,
    Clock3,
    Landmark,
} from "lucide-react";
import Image from "next/image";

import CustomModal from "@/components/Reusable/CustomModal";
import { TSingleGoodStock } from "@/interface/good_stock";
import { useGetSingleGoodsStockQuery } from "@/redux/features/good_stock.features";
import { CurrentIssueTab } from "./CurrentIssueTab";
import { PurchaseHistoryTab } from "./PurchaseHistoryTab";
import { ReturnHistortTab } from "./ReturnHistortTab";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import renderImage from "@/utils/renderImage";
import CustomStatus from "@/components/Reusable/CustomStatus";
import UpdateProductEntryModal from "../../UpdateProductEntryModal";

type SingleGoodDetailsModalProps = {
    id: string;
    isOpen: boolean;
    onClose: () => void;
};

type TTab = "stock" | "delivery" | "purchase";

type TabButtonProps = {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
};

function TabButton({
    active,
    icon,
    label,
    onClick,
}: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium transition ${
                active
                    ? "border-[#039A63] text-[#039A63]"
                    : "border-transparent text-gray-500 hover:text-[#039A63]"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

export default function SingleGoodDetailsModal({
    id,
    isOpen,
    onClose,
}: SingleGoodDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<TTab>("stock");
    const [openEditModal, setOpenEditModal] = useState(false);

    const { data, isLoading } = useGetSingleGoodsStockQuery(id, {
        skip: !id || !isOpen,
        refetchOnMountOrArgChange: true,
    });

    const good = data?.data as TSingleGoodStock;
    const currentStock = Number(good?.currentStock || 0);

    // Edit modal close
    const handleCloseEdit = () => {
        setOpenEditModal(false);
    };

    return (
        <>
            <CustomModal
                isOpen={isOpen}
                onClose={onClose}
                width="xxl"
            >
                {isLoading ? (
                    <CustomStatus type="loading" />
                ) : !good ? (
                    <div className="py-16 text-center text-sm text-gray-500">
                        কোনো তথ্য পাওয়া যায়নি
                    </div>
                ) : (
                    <div className="max-h-[85vh] overflow-y-auto">
                        {/* Header */}
                        <div className="relative rounded bg-gradient-to-r from-[#1d293d] to-[#101827] px-6 pb-6 pt-6 text-white">
                            <div className="flex items-start gap-6">
                                {/* Image */}
                                <div className="relative shrink-0">
                                    <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-gray-200">
                                        {good?.image ? (
                                            <Image
                                                width={100}
                                                height={100}
                                                unoptimized
                                                src={renderImage(good.image)}
                                                alt={
                                                    good.name ||
                                                    "Product"
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-base font-medium text-gray-400">
                                                No Img
                                            </span>
                                        )}
                                    </div>

                                    {currentStock <= 0 && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-red-500 shadow-sm">
                                            OUT OF STOCK
                                        </span>
                                    )}
                                </div>

                                {/* Product info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between pr-10">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                {good?.name || "-"}
                                            </h2>

                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-300">
                                                <Grid2X2 className="h-3.5 w-3.5" />
                                                <span>
                                                    {good?.category?.name ||
                                                        "-"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Edit */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenEditModal(true)
                                            }
                                            className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            এডিট
                                        </button>
                                    </div>

                                    {/* Summary */}
                                    <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                                        <div className="border-r border-white/10 px-4 py-2.5 text-center">
                                            <p className="text-[11px] text-gray-400">
                                                বর্তমান স্টক
                                            </p>

                                            <p className="mt-0.5 text-xl font-bold text-emerald-400">
                                                {toBanglaNumber(
                                                    currentStock
                                                )}
                                            </p>
                                        </div>

                                        <div className="border-r border-white/10 px-4 py-2.5 text-center">
                                            <p className="text-[11px] text-gray-400">
                                                গড় মূল্য
                                            </p>

                                            <p className="mt-0.5 text-xl font-bold text-yellow-400">
                                                ৳{" "}
                                                {toBanglaNumber(
                                                    good?.price
                                                )}
                                            </p>
                                        </div>

                                        <div className="px-4 py-2.5 text-center">
                                            <p className="text-[11px] text-gray-400">
                                                মোট ভ্যালু (বর্তমান)
                                            </p>

                                            <p className="mt-0.5 text-xl font-bold text-blue-400">
                                                {toBanglaNumber(
                                                    currentStock *
                                                        Number(
                                                            good?.price ||
                                                                0
                                                        )
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white pt-3">
                            <div className="flex items-center border-b border-gray-200">
                                <TabButton
                                    active={activeTab === "stock"}
                                    icon={
                                        <MapPin className="h-3.5 w-3.5" />
                                    }
                                    label="চলমান ইস্যু"
                                    onClick={() =>
                                        setActiveTab("stock")
                                    }
                                />

                                <TabButton
                                    active={activeTab === "delivery"}
                                    icon={
                                        <Clock3 className="h-3.5 w-3.5" />
                                    }
                                    label="রিটার্ন হিস্ট্রি"
                                    onClick={() =>
                                        setActiveTab("delivery")
                                    }
                                />

                                <TabButton
                                    active={activeTab === "purchase"}
                                    icon={
                                        <Landmark className="h-3.5 w-3.5" />
                                    }
                                    label="ক্রয় হিস্ট্রি"
                                    onClick={() =>
                                        setActiveTab("purchase")
                                    }
                                />
                            </div>

                            <div className="py-4">
                                {activeTab === "stock" && (
                                    <CurrentIssueTab good={good} />
                                )}

                                {activeTab === "delivery" && (
                                    <ReturnHistortTab good={good} />
                                )}

                                {activeTab === "purchase" && (
                                    <PurchaseHistoryTab good={good} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CustomModal>

            {/* Update Modal */}
            {good && (
                <UpdateProductEntryModal
                    id={good.id}
                    isOpen={openEditModal}
                    onClose={handleCloseEdit}
                />
            )}
        </>
    );
}