"use client";

import { useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    Search,
    Trash2,
} from "lucide-react";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TGoodsStock } from "@/interface/good_stock";
import { useDeleteGoodStockMutation, useGetAllGoodsStockQuery } from "@/redux/features/good_stock.features";
import Image from "next/image";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import CalculateAssets from "./CalculateAssets";
import Swal from "sweetalert2";
import ImageViewModal from "@/components/Dashboard/common/ImageViewModal";
import SingleGoodDetailsModal from "@/components/Dashboard/Modals/ReportModal/SingleGoodDetailsModal/SingleGoodDetailsModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";

export default function AssetList() {
    const { data, isError, isLoading } =
        useGetAllGoodsStockQuery(undefined);
    const [deleteGoodAsync, { isLoading: deleteLoading }] = useDeleteGoodStockMutation()
    const goods = (data?.data as TGoodsStock[]) || [];
    const [imageModal, setImageModal] = useState(false);
    // GOOD DETAILS
    const [isGoodDetailsOpen, setIsGoodDetailsOpen] = useState(false);
    const [selectedGoodId, setSelectedGoodId] = useState("");
    const [image, setImage] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("সকল ক্যাটাগরি");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const categories = useMemo(() => {
        const categoryList = goods
            .map((item) => item.category?.name)
            .filter(Boolean);

        return [
            "সকল ক্যাটাগরি",
            ...new Set(categoryList),
        ];
    }, [goods]);

    const filteredGoods = useMemo(() => {
        return goods.filter((item) => {
            const categoryMatch =
                category === "সকল ক্যাটাগরি" ||
                item.category?.name === category;

            const searchMatch =
                !search ||
                item.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            return categoryMatch && searchMatch;
        });
    }, [goods, category, search]);

    const totalPrice = filteredGoods.reduce(
        (sum, item) =>
            sum +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    );

    const totalPages = Math.ceil(
        filteredGoods.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedGoods = filteredGoods.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(
            totalPages - 1,
            currentPage + 1
        );

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };



    // function
    const handleOpenGoodDetails = (id: string) => {
        setSelectedGoodId(id);
        setIsGoodDetailsOpen(true);
    };

    const handleCloseGoodDetails = () => {
        setIsGoodDetailsOpen(false);
        setSelectedGoodId("");
    };

    const handleDeleteGood = async (id: string) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই মালামালটি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteGoodAsync(id).unwrap();

            await Swal.fire({
                title: "ডিলেট হয়েছে!",
                text: "মালামালটি সফলভাবে ডিলেট করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "মালামালটি ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    return (
        <div className="w-full">
            <CalculateAssets goods={goods} />

            <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Filter
                            size={17}
                            className="text-gray-500"
                        />

                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) =>
                                    handleCategoryChange(
                                        e.target.value
                                    )
                                }
                                className="h-9 w-[225px] appearance-none rounded-md border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-700 outline-none focus:border-[#039A63]"
                            >
                                {categories.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                ▾
                            </span>
                        </div>
                    </div>

                    <div className="rounded-full bg-gray-100 px-5 py-2">
                        <span className="text-sm text-gray-500">
                            মোট মূল্য:
                        </span>

                        <span className="ml-2 text-lg font-bold text-blue-600">
                            {toBanglaNumber(totalPrice)}
                        </span>
                    </div>

                    <div className="relative w-full md:w-[290px]">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                handleSearch(e.target.value)
                            }
                            placeholder="খুঁজুন..."
                            className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#039A63]"
                        />
                    </div>
                </div>
            </div>

            <div >
                <div className="overflow-x-auto mt-2  ">
                    <table className="min-w-full border-collapse ">
                        <thead>
                            <tr className="bg-[#039A63] text-white text-center">
                                <TableHead
                                    th="ছবি"

                                />

                                <TableHead
                                    th="প্রোডাক্ট"
                                    cls="text-left"
                                />

                                <TableHead
                                    th="ক্যাটাগরি"
                                    cls="text-left"
                                />

                                <TableHead th="মোট" />
                                <TableHead th="বর্তমান" />
                                <TableHead th="ইস্যু" />
                                <TableHead th="নষ্ট" />
                                <TableHead th="হারা" />
                                <TableHead th="একক মূল্য" />
                                <TableHead th="মোট মূল্য" />

                                <TableHead
                                    th="অ্যাকশন"
                                    cls="w-[110px]"
                                />
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {isLoading ? (
                                <TableLazyLoading
                                    smallColumns={6}
                                    largeColumns={11}
                                    rows={6}
                                />
                            ) : isError ?
                                (
                                    <tr>
                                        <td colSpan={11}>
                                            <CustomStatus
                                                type="error"
                                                description={SERVER_ERROR_MESSAGE}
                                            />
                                        </td>
                                    </tr>
                                )

                                : !filteredGoods?.length ? (
                                    <tr>
                                        <td colSpan={11}>
                                            <CustomStatus
                                                type="empty"
                                                description="কোনো অ্যাসেট পাওয়া যায়নি"
                                            />
                                        </td>
                                    </tr>
                                ) : !filteredGoods.length ? (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="py-8 text-sm text-gray-500"
                                        >
                                            কোনো তথ্য পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedGoods.map((item) => {
                                        const total = Number(
                                            item.quantity || 0
                                        );

                                        const issue = Number(
                                            item.totalIssue || 0
                                        );

                                        const damage = Number(
                                            item.totalDamage || 0
                                        );

                                        const lost = Number(
                                            item.totalLost || 0
                                        );

                                        const current =
                                            total -
                                            issue -
                                            damage -
                                            lost;

                                        const itemTotalPrice =
                                            Number(item.price || 0) *
                                            total;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-50"
                                            >
                                                <td className="w-[80px] border-r border-gray-200 px-3 py-3">
                                                    <div className="flex items-center justify-center">
                                                        {item.image ? (
                                                            <div
                                                                onClick={() => {
                                                                    setImage(item.image);
                                                                    setImageModal(true);
                                                                }}
                                                                className="relative cursor-pointer h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                                                <Image
                                                                    fill
                                                                    unoptimized
                                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${item.image}`}
                                                                    alt={
                                                                        item.name ||
                                                                        "product"
                                                                    }
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                                                                <span className="text-xs text-gray-400">
                                                                    ছবি নেই
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <TableData
                                                    td={
                                                        item.name || "-"
                                                    }
                                                    cls="border-r border-gray-200 text-left font-medium"
                                                />

                                                <TableData
                                                    td={
                                                        item.category
                                                            ?.name || "-"
                                                    }
                                                    cls="border-r border-gray-200 text-left"
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        total
                                                    )}
                                                    cls="border-r border-gray-200 font-medium"
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        current
                                                    )}
                                                    cls="border-r border-gray-200 font-medium text-green-600"
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        issue
                                                    )}
                                                    cls="border-r border-gray-200 font-medium text-blue-600"
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        damage
                                                    )}
                                                    cls="border-r border-gray-200 font-medium text-orange-500"
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        lost
                                                    )}
                                                    cls="border-r border-gray-200 font-medium text-red-500"
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        item.price
                                                    )}
                                                    cls="border-r border-gray-200"
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        itemTotalPrice
                                                    )}
                                                    cls="border-r border-gray-200 font-medium"
                                                />

                                                <td className="w-[110px] border-r border-gray-200 px-3 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenGoodDetails(item.id)}
                                                            type="button"
                                                            title="বিস্তারিত দেখুন"
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:border-[#039A63] hover:bg-green-50 hover:text-[#039A63]"
                                                        >
                                                            <Eye
                                                                size={15}
                                                            />
                                                        </button>

                                                        <button
                                                            disabled={deleteLoading}
                                                            onClick={() => handleDeleteGood(item?.id)}
                                                            type="button"
                                                            title="ডিলিট"
                                                            className="flex cursor-pointer h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                                                        >
                                                            <Trash2
                                                                size={15}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                        </tbody>
                    </table>
                </div>

                {!isLoading &&
                    !isError &&
                    filteredGoods.length > 0 && (
                        <div className="flex items-center justify-end border-t border-gray-200 px-4 py-3">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage(
                                            (prev) => prev - 1
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {getPageNumbers().map(
                                    (page, index) =>
                                        page === "..." ? (
                                            <span
                                                key={`dots-${index}`}
                                                className="flex h-8 w-8 items-center justify-center text-sm text-gray-500"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() =>
                                                    setCurrentPage(
                                                        page as number
                                                    )
                                                }
                                                className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition ${currentPage ===
                                                    page
                                                    ? "border-[#039A63] bg-[#039A63] text-white"
                                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                )}

                                <button
                                    type="button"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (prev) => prev + 1
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
            </div>

            {imageModal && image &&
                <ImageViewModal
                    image={image}
                    isOpen={imageModal}
                    onClose={() => {
                        setImageModal(false);
                        setImage("");
                    }}
                />
            }

            <SingleGoodDetailsModal
                id={selectedGoodId}
                isOpen={isGoodDetailsOpen}
                onClose={handleCloseGoodDetails}
            />
        </div>
    );
}