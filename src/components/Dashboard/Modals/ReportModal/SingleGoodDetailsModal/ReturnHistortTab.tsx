import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { TSingleGoodStock } from "@/interface/good_stock";
import { EmptyState } from "./Common";
import Image from "next/image";
import renderImage from "@/utils/renderImage";
import ImageViewModal from "@/components/Dashboard/common/ImageViewModal";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

export function ReturnHistortTab({
    good,
}: {
    good: TSingleGoodStock;
}) {
    const history = good?.goodHistoryLogs || [];
    const [currentPage, setCurrentPage] = useState(1);
    const [imageModal, setImageModal] = useState(false);
    const [image, setImage] = useState("");
    const itemsPerPage = 5;
    const totalPages = Math.ceil(history.length / itemsPerPage);

    const currentHistorys = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return history.slice(startIndex, endIndex);
    }, [history, currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);
    };

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-gray-200">
                {/* Header */}
                <div className="grid grid-cols-4 bg-[#039A63] text-sm font-semibold text-white">
                    <div className="px-4 py-3">তারিখ</div>
                    <div className="px-4 py-3">ফেরতকারী</div>
                    <div className="px-4 py-3">অবস্থা</div>
                    <div className="px-4 py-3">প্রমাণ</div>
                </div>

                {/* Data */}
                {currentHistorys.length > 0 ? (
                    currentHistorys.map((history, index) => (
                        <div
                            key={`${history.id}-${index}`}
                            className="grid grid-cols-4 items-center border-t border-gray-100 text-sm"
                        >
                            <div className="px-4 py-2 font-medium text-gray-700">
                                {formatBanglaDate({ date: history.date })}
                            </div>

                            <div className="px-4 py-2 text-gray-600">
                                {history.returnBy || "-"}
                            </div>

                            <div className="px-4 py-2 font-semibold text-[#039A63]">

                                {history.type ===
                                    "ISSUE" ? (
                                    <span className="text-gray-400">
                                        -
                                    </span>
                                ) : (
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {
                                            history?.okay ?
                                                <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-600">
                                                    G:{history.okay}
                                                </span> : ""
                                        }

                                        {
                                            history?.damage ?
                                                <span className="rounded bg-orange-50 px-2 py-1 text-xs text-orange-600">
                                                    D:{history.damage}
                                                </span> : ""
                                        }

                                        {
                                            history.lost ?
                                                <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-600">
                                                    L:{history.lost}
                                                </span> : ""
                                        }
                                    </div>
                                )}

                            </div>

                            <div className="px-4 py-3">
                                {history?.image ? (
                                    <Image
                                        onClick={() => {
                                            setImage(history.image);
                                            setImageModal(true);
                                        }}
                                        width={100}
                                        height={100}
                                        unoptimized
                                        src={renderImage(history?.image)}
                                        alt={history?.image || "history image"}
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