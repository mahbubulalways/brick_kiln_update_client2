"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TQuery } from "@/interface/query";
import { useGetAllCarRentQuery, useDeleteCarRentMutation } from "@/redux/features/carRent.features";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TMetaConfig } from "@/interface/meta";
import SearchBar from "@/components/Reusable/SearchBar";
import CreateCarRentModal from "@/components/Dashboard/Modals/CreateCarRentModal";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import UpdateCarRentModal from "@/components/Dashboard/Modals/EditModals/UpdateCarRentModal";
import Swal from "sweetalert2";
import CustomStatus from "@/components/Reusable/CustomStatus";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import approvalButtonDisable from "@/utils/approvalButtonDisable";

export default function CarRentPage({
    limit,
    page,
    search,
}: TQuery) {
    const {
        data,
        isLoading,
        isError
    } = useGetAllCarRentQuery(
        {
            limit,
            page,
            search,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const [deleteCarRent, { isLoading: deleteLoading }] =
        useDeleteCarRentMutation();

    const [openCarRent, setOpenCarRent] =
        useState<boolean>(false);

    const [openUpdateCarRent, setOpenUpdateCarRent] =
        useState<boolean>(false);

    const [searchItems, setSearchItem] = useState("");

    const [carRentId, setSelectCarRenttId] =
        useState<number | undefined>(undefined);

    const carRentData = data?.data?.data ?? [];
    const meta = data?.data?.meta as TMetaConfig;

    // DELETE CAR RENT
    const handleDeleteCarRent = async (id: number) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই গাড়ি ভাড়ার তথ্যটি ডিলেট করলে আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            const result = await deleteCarRent(id).unwrap();

            await Swal.fire({
                title: "ডিলেট হয়েছে!",
                text: result?.message,
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "গাড়ি ভাড়ার তথ্যটি ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    return (
        <div className="bg-white rounded-md shadow border">
            <div className="flex w-full p-2 items-center justify-between gap-2 sm:w-auto sm:gap-3">
                <div className="min-w-0 flex-1 sm:w-[240px] sm:flex-none">
                    <SearchBar
                        value={searchItems}
                        onChange={(e) =>
                            setSearchItem(e.target.value)
                        }
                        onClear={() => setSearchItem("")}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setOpenCarRent(true)}
                    className="
                shrink-0 rounded-md
                bg-[#039A63]
                px-3 h-9
                text-xs font-medium text-white
                transition hover:bg-[#028653]
                sm:px-4 sm:text-sm
            "
                >
                    + নতুন ভাড়া
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-t-md border border-gray-200">
                <table className="min-w-full border-collapse">

                    {/* Table Header */}
                    <thead>
                        <tr className="bg-[#039A63] text-center text-white">

                            <TableHead th="#" />

                            <TableHead th="ঠিকানা" />

                            <TableHead th="এরিয়া" />

                            <TableHead th="ভাড়া" />

                            <TableHead th="বাটন" />

                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="text-center">

                        {isLoading ? (
                            <TableLazyLoading
                                smallColumns={5}
                                largeColumns={5}
                                rows={6}
                            />
                        ) : isError ?
                            (
                                <tr>
                                    <td colSpan={5}>
                                        <CustomStatus
                                            type="error"
                                            description={SERVER_ERROR_MESSAGE}
                                        />
                                    </td>
                                </tr>
                            )

                            : !carRentData?.length ? (
                                <tr>
                                    <td colSpan={5}>
                                        <CustomStatus
                                            type="empty"
                                            description="কোনো গাড়ির ভাড়া পাওয়া যায়নি"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                carRentData.map(
                                    (row: any, index: number) => (
                                        <tr
                                            key={row?.id}
                                            className="h-[56px] border-b border-gray-200 transition-colors hover:bg-gray-50"
                                        >
                                            {/* # */}
                                            <TableData
                                                td={
                                                    ((page ?? 1) - 1) *
                                                    (limit ?? 10) +
                                                    index +
                                                    1
                                                }
                                            />

                                            {/* ঠিকানা */}
                                            <TableData
                                                td={row?.address ?? "-"}
                                            />

                                            {/* এরিয়া */}
                                            <TableData
                                                td={row?.area ?? "-"}
                                            />

                                            {/* ভাড়া */}
                                            <TableData
                                                td={
                                                    row?.rent
                                                        ? `৳ ${row.rent}`
                                                        : row?.rate
                                                            ? `৳ ${row.rate}`
                                                            : "৳ ০"
                                                }
                                            />

                                            <td className="border p-2">
                                                <div className="flex justify-center gap-3">
                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenUpdateCarRent(true);
                                                            setSelectCarRenttId(
                                                                row?.id
                                                            );
                                                        }}

                                                        disabled={approvalButtonDisable(row?.updateStatus)}
                                                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"

                                                        disabled={deleteLoading
                                                            || approvalButtonDisable(row?.deleteStatus)
                                                        }
                                                        onClick={() =>
                                                            handleDeleteCarRent(
                                                                row?.id
                                                            )
                                                        }
                                                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                )
                            )}

                    </tbody>
                </table>

                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={carRentData?.length}
                    title="ভাড়া"
                />
            </div>

            {/* Create Modal */}
            {openCarRent && (
                <CreateCarRentModal
                    isOpen={openCarRent}
                    onClose={() => setOpenCarRent(false)}
                />
            )}

            {/* Update Modal */}
            {openUpdateCarRent && (
                <UpdateCarRentModal
                    isOpen={openUpdateCarRent}
                    onClose={() => {
                        setOpenUpdateCarRent(false);
                    }}
                    id={carRentId}
                    setSelectCarRenttId={setSelectCarRenttId}
                />
            )}
        </div>
    );
}