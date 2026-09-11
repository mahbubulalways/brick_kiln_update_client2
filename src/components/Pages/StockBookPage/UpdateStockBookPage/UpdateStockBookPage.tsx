"use client";

import CreateNewUpdateStockModal from "@/components/Dashboard/Modals/CreateNewUpdateStockModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TMetaConfig } from "@/interface/meta";
import { TQuery } from "@/interface/query";
import { TStockBook } from "@/interface/stock_book";
import { useDeleteStockMutation, useGetAllStocksQuery } from "@/redux/features/stock_book.features";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

import { LayoutDashboard, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function UpdateStockBookPage({
    limit,
    page,
}: TQuery) {
    const [openModal, setOpenModal] = useState(false);

    const {
        data,
        isLoading,
    } = useGetAllStocksQuery(
        {
            limit,
            page,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );


    const [deleteStock, {isLoading:deleteLoading}]=useDeleteStockMutation()

    const stocks = (data?.data?.data ?? []) as TStockBook[];
    const meta = data?.data?.meta as TMetaConfig;




   const handleDelete = async (id:string) => {
    const result = await Swal.fire({
        title: "আপনি কি নিশ্চিত?",
        text: "এই স্টকটি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#039A63",
        cancelButtonColor: "#d33",
        confirmButtonText: "হ্যাঁ, ডিলেট করুন",
        cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;
    try {
        await deleteStock(id).unwrap();

        await Swal.fire({
            title: "ডিলেট হয়েছে!",
            text: "স্টকের তথ্য সফলভাবে ডিলেট করা হয়েছে।",
            icon: "success",
            confirmButtonColor: "#039A63",
            confirmButtonText: "ঠিক আছে",
        });
    } catch (error: any) {
        await Swal.fire({
            title: "ডিলেট ব্যর্থ!",
            text:
                error?.data?.message ||
                "স্টকের তথ্য ডিলেট করা সম্ভব হয়নি।",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "ঠিক আছে",
        });
    }
};

    return (
        <div className="bg-white rounded-md border border-gray-200 shadow-sm">
            {/* ================= Top Button ================= */}
            <div className="flex items-center gap-2 border-b border-gray-200 bg-white p-4">
                <Link
                    href="/dashboard/stock-book"
                    className="flex items-center justify-center gap-2 rounded bg-[#039A63] px-3 py-1.5 font-medium text-white transition hover:bg-[#028a58]"
                >
                    <LayoutDashboard size={17} />

                    স্টক খাতা
                </Link>

                <button
                    onClick={() => setOpenModal(true)}
                    type="button"
                    className="rounded border border-[#039A63] bg-white px-3 py-1.5 font-medium text-[#039A63] transition hover:bg-green-50"
                >
                    আপডেট স্টক
                </button>
            </div>
            <div>
                <table className="overflow-x-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-[#039A63] text-center text-white">
                            <TableHead th="তারিখ" />
                            <TableHead th="বিবরণ" />
                            <TableHead th="শ্রেণি" />
                            <TableHead
                                th="স্টক ++"
                                cls="text-green-100"
                            />
                            <TableHead
                                th="স্টক --"
                                cls="text-red-100"
                            />
                            <TableHead th="ইউজার" />
                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {isLoading  ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-10"
                                >
                                    <CustomLoader cls="h-[20vh]" />
                                </td>
                            </tr>
                        ) : !stocks.length ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-8 text-gray-500"
                                >
                                    কোনো স্টকের তথ্য পাওয়া যায়নি।
                                </td>
                            </tr>
                        ) : (
                            stocks.map((stock: TStockBook) => (
                                <tr
                                    key={stock.id}
                                    className="border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-50"
                                >
                                    <TableData
                                        td={formatBanglaDate({
                                            date: stock.createdAt,
                                        })}
                                    />

                                    <TableData
                                        td={stock.description || "-"}
                                        cls="text-left"
                                    />

                                    <TableData
                                        td={stock.class || "-"}
                                    />

                                    <TableData
                                        td={toBanglaNumber(stock.stockIn)}
                                        cls="font-medium text-green-600"
                                    />

                                    <TableData
                                        td={toBanglaNumber(stock.stockOut)}
                                        cls="font-medium text-red-500"
                                    />

                                    <TableData
                                        td={stock?.createdBy?.name || "-"}
                                    />

                                    <td className="px-4 py-1">
                                        <button
                                            type="button"
                                            disabled={deleteLoading}
                                            onClick={() => {
                                                handleDelete(stock.id);
                                            }}
                                            className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-500 transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                                            title="ডিলিট"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={stocks.length}
                    title="স্টক"
                />
            </div>

            {openModal && (
                <CreateNewUpdateStockModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </div>
    );
}