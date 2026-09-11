"use client";

import CreateGoodLossUpdateModal from "@/components/Dashboard/Modals/CreateGoodLossUpdateModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import { useGetLostGoodsStockQuery } from "@/redux/features/good_stock.features";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function LostAssetList() {
    const { data, isLoading } =
        useGetLostGoodsStockQuery(undefined);

    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] =
        useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);

    const lostGoods = data?.data || [];

    const itemsPerPage = 10;

    const totalPages = Math.ceil(
        lostGoods.length / itemsPerPage
    );

    const paginatedLostGoods = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return lostGoods.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [lostGoods, currentPage]);

    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        if (currentPage <= 3) {
            pages.push(
                1,
                2,
                3,
                4,
                "...",
                totalPages
            );
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

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);
    };

    const handleOpenModal = (id: string) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedId("");
    };

    return (
        <>
            <div className="overflow-x-auto rounded-t-md border border-gray-200">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#039A63] text-center text-white">
                            <TableHead th="প্রোডাক্ট" />
                            <TableHead th="হারানো পরিমাণ" />
                            <TableHead th="ক্ষতি (টাকা)" />
                            <TableHead th="অ্যাকশন" />
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4}>
                                    <CustomLoader cls="h-[30vh]" />
                                </td>
                            </tr>
                        ) : !lostGoods.length ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-10 text-gray-500"
                                >
                                    কোনো ডাটা পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            paginatedLostGoods.map(
                                (row: any) => (
                                    <tr
                                        key={row?.id}
                                        className="h-[50px] border-b border-gray-200 transition-colors hover:bg-gray-50"
                                    >
                                        <TableData
                                            td={
                                                row?.good
                                                    ?.name ??
                                                "-"
                                            }
                                        />

                                        <TableData
                                            td={toBanglaNumber(
                                                row?.quantity ??
                                                    0
                                            )}
                                        />

                                        <TableData
                                            td={`৳ ${toBanglaNumber(
                                                row?.lossAmount ??
                                                    0
                                            )}`}
                                            cls="font-semibold text-yellow-500"
                                        />

                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenModal(
                                                        row?.id
                                                    )
                                                }
                                                className="cursor-pointer rounded bg-yellow-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-yellow-700"
                                            >
                                                পাওয়া গেছে
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading &&
                lostGoods.length > 0  && (
                    <div className="flex items-center justify-end border-t border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    handlePageChange(
                                        currentPage - 1
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft
                                    size={16}
                                />
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
                                            className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition ${
                                                currentPage ===
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
                                    handlePageChange(
                                        currentPage + 1
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight
                                    size={16}
                                />
                            </button>
                        </div>
                    </div>
                )}

            {openModal && selectedId && (
                <CreateGoodLossUpdateModal
                    id={selectedId}
                    type="LOST"
                    open={openModal}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}