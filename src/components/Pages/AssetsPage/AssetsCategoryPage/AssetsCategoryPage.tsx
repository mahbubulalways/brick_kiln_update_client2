"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash } from "lucide-react";

import CustomNewButton from "@/components/Reusable/CustomNewButton";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CreateNewAssetsCategoryModal from "@/components/Dashboard/Modals/CreateAssetsCategoryModal";

import { useGetAllGoodsCategoryQuery } from "@/redux/features/goods_stock_category.features";
import CustomLoader from "@/components/Reusable/CustomLoader";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { SERVER_ERROR_MESSAGE } from "@/constant";

export default function AssetsCategoryPage() {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const {
        isError,
        isLoading,
        data,
    } = useGetAllGoodsCategoryQuery(undefined);

    const categories = data?.data || [];

    return (
        <div className="bg-white rounded-md shadow border">
            <div className="flex items-center justify-between gap-3 p-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        মালামালের ক্যাটাগরি
                    </h2>

                    <p className="text-sm text-gray-500">
                        মালামালের বিভিন্ন ক্যাটাগরি পরিচালনা করুন
                    </p>
                </div>

                <CustomNewButton
                    title="নতুন ক্যাটাগরি"
                    onClick={() => setOpenModal(true)}
                />
            </div>

            <div className="overflow-x-auto mt-2  ">
                <table className="min-w-full border-collapse ">
                    <thead>
                        <tr className="bg-[#039A63] text-white text-center">
                            <TableHead th="#" />
                            <TableHead th="ক্যাটাগরির নাম" />
                            <TableHead th="পণ্য" />
                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <TableLazyLoading
                                smallColumns={4}
                                largeColumns={4}
                                rows={4}
                            />
                        ) : isError ?
                            (
                                <tr>
                                    <td colSpan={4}>
                                        <CustomStatus
                                            type="error"
                                            description={SERVER_ERROR_MESSAGE}
                                        />
                                    </td>
                                </tr>
                            )

                            : !categories?.length ? (
                                <tr>
                                    <td colSpan={4}>
                                        <CustomStatus
                                            type="empty"
                                            description="কোনো আনলোড পাওয়া যায়নি"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                categories.map(
                                    (category: any, index: number) => (
                                        <tr
                                            key={category.id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <TableData td={index + 1} />

                                            <TableData
                                                td={category.name}
                                                cls="font-medium"
                                            />

                                            <TableData
                                                td={
                                                    category._count.goodsStocks || 0
                                                }
                                            />

                                            <td>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="mx-auto flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
                                                        >
                                                            <MoreVertical
                                                                size={18}
                                                            />
                                                        </button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-40"
                                                    >
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <CustomDropDownMenuItem
                                                                Icon={Pencil}
                                                                title="এডিট"
                                                            />
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <CustomDropDownMenuItem
                                                                Icon={Trash}
                                                                title="ডিলিট"
                                                            />
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ),
                                )
                            )}
                    </tbody>
                </table>
            </div>

            {openModal && (
                <CreateNewAssetsCategoryModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </div>
    );
}