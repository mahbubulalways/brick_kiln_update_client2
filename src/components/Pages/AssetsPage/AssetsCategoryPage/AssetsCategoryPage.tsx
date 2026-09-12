"use client";

import { useState } from "react";

import Swal from "sweetalert2";

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

import {
    useDeleteGoodsCategoryMutation,
    useGetAllGoodsCategoryQuery,
} from "@/redux/features/goods_stock_category.features";

import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { SERVER_ERROR_MESSAGE } from "@/constant";

import UpdateAssetsCategoryModal from "@/components/Dashboard/Modals/EditModals/UpdateAssetsCategoryModal";

export default function AssetsCategoryPage() {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [deleteGoodsCategory, { isLoading: isDeleting }] =
        useDeleteGoodsCategoryMutation();

    const [openUpdateModal, setOpenUpdateModal] =
        useState<boolean>(false);

    const [selectedCategory, setSelectedCategory] =
        useState<any>(null);

    const {
        isError,
        isLoading,
        data,
    } = useGetAllGoodsCategoryQuery(undefined);

    const categories = data?.data || [];

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        setOpenUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
        setSelectedCategory(null);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই ক্যাটাগরি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteGoodsCategory(id).unwrap();

            await Swal.fire({
                title: "ডিলেট হয়েছে!",
                text: "মালামালের ক্যাটাগরি সফলভাবে ডিলেট করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "মালামালের ক্যাটাগরি ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    return (
        <div className="rounded-md border bg-white shadow">
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

            <div className="mt-2 overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#039A63] text-center text-white">
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
                        ) : isError ? (
                            <tr>
                                <td colSpan={4}>
                                    <CustomStatus
                                        type="error"
                                        description={SERVER_ERROR_MESSAGE}
                                    />
                                </td>
                            </tr>
                        ) : !categories?.length ? (
                            <tr>
                                <td colSpan={4}>
                                    <CustomStatus
                                        type="empty"
                                        description="কোনো ক্যাটাগরি পাওয়া যায়নি"
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
                                                category._count
                                                    ?.goodsStocks || 0
                                            }
                                        />

                                        <td>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                >
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
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handleEdit(
                                                                category,
                                                            )
                                                        }
                                                    >
                                                        <CustomDropDownMenuItem
                                                            Icon={Pencil}
                                                            title="এডিট"
                                                        />
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id,
                                                            )
                                                        }
                                                    >
                                                        <CustomDropDownMenuItem
                                                            Icon={Trash}
                                                            title={
                                                                isDeleting
                                                                    ? "ডিলেট হচ্ছে..."
                                                                    : "ডিলেট"
                                                            }
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

            {openUpdateModal && (
                <UpdateAssetsCategoryModal
                    isOpen={openUpdateModal}
                    onClose={handleCloseUpdateModal}
                    data={selectedCategory}
                />
            )}
        </div>
    );
}