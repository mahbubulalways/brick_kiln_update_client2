import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { TSingleGoodStock } from "@/interface/good_stock";
import { EmptyState } from "./Common";
import Image from "next/image";
import renderImage from "@/utils/renderImage";
import ImageViewModal from "@/components/Dashboard/common/ImageViewModal";

export function CurrentIssueTab({
    good,
}: {
    good: TSingleGoodStock;
}) {
    const issues = good?.goodsIssues || [];
    const [currentPage, setCurrentPage] = useState(1);
    const [imageModal, setImageModal] = useState(false);
    const [image, setImage] = useState("");
    const itemsPerPage = 5;
    const totalPages = Math.ceil(issues.length / itemsPerPage);

    const currentIssues = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return issues.slice(startIndex, endIndex);
    }, [issues, currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);
    };

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-gray-200">
                {/* Header */}
                <div className="grid grid-cols-4 bg-[#039A63] text-sm font-semibold text-white">
                    <div className="px-4 py-3">নাম</div>
                    <div className="px-4 py-3">লোকেশন</div>
                    <div className="px-4 py-3">পরিমাণ</div>
                    <div className="px-4 py-3">ছবি</div>
                </div>

                {/* Data */}
                {currentIssues.length > 0 ? (
                    currentIssues.map((issue, index) => (
                        <div
                            key={`${issue.name}-${index}`}
                            className="grid grid-cols-4 items-center border-t border-gray-100 text-sm"
                        >
                            <div className="px-4 py-2 font-medium text-gray-700">
                                {issue.name || "-"}
                            </div>

                            <div className="px-4 py-2 text-gray-600">
                                {issue.location || "-"}
                            </div>

                            <div className="px-4 py-2 font-semibold text-[#039A63]">
                                {issue.quantity || 0}
                            </div>

                            <div className="px-4 py-3">
                                {issue?.image ? (
                                    <Image
                                        onClick={() => {
                                            setImage(issue.image);
                                            setImageModal(true);
                                        }}
                                        width={100}
                                        height={100}
                                        unoptimized
                                        src={renderImage(issue?.image)}
                                        alt={issue?.name || "Issue image"}
                                        className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        ছবি নেই
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>


            <div className="mt-4 flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={() =>
                        handlePageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${currentPage === page
                            ? "bg-[#039A63] text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() =>
                        handlePageChange(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
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
        </div>
    );
}