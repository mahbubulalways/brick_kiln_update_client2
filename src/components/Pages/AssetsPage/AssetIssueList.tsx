"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
    ChevronLeft,
    ChevronRight,
    Eye,
} from "lucide-react";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";

import { useGetAllGoodIssueQuery } from "@/redux/features/goods_issue.features";
import { TGoodsIssue } from "@/interface/good_stock";
import CreateGoodIssueRefundModal from "@/components/Dashboard/Modals/CreateGoodIssueRefundModal";
import ImageViewModal from "@/components/Dashboard/common/ImageViewModal";

export default function AssetIssueList() {
    const {
        isError,
        isLoading,
        data,
    } = useGetAllGoodIssueQuery(undefined);

    const issues = (data?.data as TGoodsIssue[]) || [];
    const [imageModal, setImageModal] = useState(false);
    const [image, setImage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [refundId, setRefundId] = useState<string | null>(null);
    const [refundModal, setRefundModal] = useState(false);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(
        issues.length / itemsPerPage
    );

    const paginatedIssues = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return issues.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [issues, currentPage]);

    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );
        } else {
            pages.push(
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages
            );
        }

        return pages;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    const formatNumber = (value: number) => {
        return Number(value).toLocaleString("bn-BD");
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="bg-[#039A63] text-center text-white">
                                <TableHead
                                    th="ছবি"
                                    cls="w-[80px]"
                                />

                                <TableHead
                                    th="প্রোডাক্ট"
                                    cls="text-left"
                                />

                                <TableHead
                                    th="ক্যাটাগরি"
                                    cls="text-left"
                                />

                                <TableHead
                                    th="কার কাছে"
                                    cls="text-left"
                                />

                                <TableHead
                                    th="লোকেশন"
                                    cls="text-left"
                                />

                                <TableHead th="পরিমাণ" />

                                <TableHead th="ইস্যু তারিখ" />

                                <TableHead
                                    th="অ্যাকশন"
                                    cls="w-[110px]"
                                />
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {isLoading && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-10"
                                    >
                                        <CustomLoader cls="h-[20vh]" />
                                    </td>
                                </tr>
                            )}

                            {!isLoading && isError && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-sm text-red-500"
                                    >
                                        তথ্য লোড করতে সমস্যা হয়েছে।
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError &&
                                !issues.length && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-8 text-sm text-gray-500"
                                        >
                                            কোনো ইস্যুর তথ্য পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                )}

                            {!isLoading &&
                                !isError &&
                                paginatedIssues.map(
                                    (issue: TGoodsIssue) => (
                                        <tr
                                            key={issue.id}
                                            className="border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="w-[80px] border-r border-gray-100 px-3 py-3">
                                                <div className="flex items-center justify-center">
                                                    {issue.good?.image ? (
                                                        <div
                                                            onClick={() => {
                                                                setImage(issue?.good.image);
                                                                setImageModal(true);
                                                            }}
                                                            className="relative cursor-pointer h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                                            <Image
                                                                fill
                                                                unoptimized
                                                                src={`${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${issue.good.image}`}
                                                                alt={
                                                                    issue.good.name ||
                                                                    "Product"
                                                                }
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                                                            <span className="text-[10px] text-gray-400">
                                                                ছবি নেই
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <TableData
                                                td={issue.good?.name || "-"}
                                                cls="text-left font-semibold"
                                            />

                                            <TableData
                                                td={
                                                    issue.good?.category
                                                        ?.name || "-"
                                                }
                                                cls="text-left"
                                            />

                                            <TableData
                                                td={issue.name || "-"}
                                                cls="text-left font-medium"
                                            />

                                            <TableData
                                                td={issue.location || "-"}
                                                cls="text-left"
                                            />

                                            <TableData
                                                td={formatNumber(
                                                    issue.quantity
                                                )}
                                                cls="font-semibold text-blue-600"
                                            />

                                            <TableData
                                                td={formatDate(issue.date)}
                                            />
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setRefundId(issue.id);
                                                        setRefundModal(true);
                                                    }}
                                                    type="button"
                                                    className="text-sm rounded-md text-white bg-[#1EA66F]
                                                     px-2 py-1.5 font-medium cursor-pointer"
                                                >
                                                    ফেরত নেওয়া
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!isLoading &&
                !isError &&
                issues.length > 0 &&
                (
                    <div className="flex items-center justify-end border-t border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    handlePageChange(
                                        currentPage - 1
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
                                                handlePageChange(
                                                    page
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
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    handlePageChange(
                                        currentPage + 1
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

            {refundModal &&
                <CreateGoodIssueRefundModal
                    id={refundId}
                    isOpen={refundModal}
                    onClose={() => {
                        setRefundModal(false);
                        setRefundId(null);
                    }}
                />
            }

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
        </div>
    );
}