"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";

import NewClassModal from "@/components/Dashboard/Modals/NewClassModal";
import EditClassAndRateModal from "@/components/Dashboard/Modals/EditModals/EditClassAndRateModal";
import {
    useDeleteClassAndRateMutation,
    useGetAllClassAndRateQuery,
} from "@/redux/features/classAndRate.features";
import { TClassAndRate } from "@/types/types";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TQuery } from "@/interface/query";
import { getUserInformation } from "@/service/auth.services";

const ChangeClassAndRate = ({ limit, page }: TQuery) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [classId, setClassId] = useState<number>();

    const [deleteClassAndRate, { isLoading: isDeleting }] =
        useDeleteClassAndRateMutation();

    // Get data
    const { isLoading, data: fetchedData } =
        useGetAllClassAndRateQuery({ limit, page });

    const classAndRates = fetchedData?.data?.data || [];
    const meta = fetchedData?.data?.meta

    //  USER ROLE
    const userRole = getUserInformation().role
    // Delete
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই শ্রেণি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await deleteClassAndRate(id).unwrap();
            await Swal.fire({
                title: "ডিলেট",
                text: response?.message,
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ডিলেট ব্যর্থ হয়েছে!",
                text:
                    error?.data?.message ||
                    "শ্রেণি এবং রেটটি ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="py-3 text-xl font-semibold text-gray-900">
                    শ্রেণি এবং রেট পরিবর্তন
                </h1>

                <button
                    onClick={() => setIsOpen(true)}
                    className="cursor-pointer rounded bg-[#039A63] px-4 py-1.5 font-medium text-gray-100"
                >
                    + নতুন শ্রেণি
                </button>
            </div>

            <div className="bg-white border rounded-md">
                <div className=" rounded-t-md ">
                    <table className="min-w-full border-collapse overflow-x-auto">
                        <thead>
                            <tr className="bg-[#039A63] text-center text-white">
                                <TableHead th="#" />
                                <TableHead th="শ্রেণির নাম" />
                                <TableHead th="শ্রেণির ধরণ" />
                                <TableHead th="রেগুলার/সিজন রেট" />
                                <TableHead th="আনসিজন রেট" />
                                <TableHead th="বাটন" />
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5}>
                                        <CustomLoader cls="h-[30vh]" />
                                    </td>
                                </tr>
                            ) : !classAndRates?.length ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-8 text-gray-600"
                                    >
                                        কোনো শ্রেণি এবং রেটের ডাটা পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                classAndRates?.map(
                                    (row: TClassAndRate, index: number) => (
                                        <tr
                                            key={row.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <TableData td={index + 1} />

                                            <TableData td={row.className} />

                                            <TableData td={row.classType} />

                                            <TableData
                                                td={`৳ ${row.rate}`}
                                            />

                                            <TableData
                                                td={`৳ ${row.advanceRate}`}
                                            />

                                            <td className="border p-2">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        disabled={
                                                            userRole !== "ADMIN" &&
                                                            userRole !== "OWNER" &&
                                                            row?.updateStatus === "PENDING"
                                                        }
                                                        type="button"
                                                        onClick={() => {
                                                            setIsOpenEditModal(true);
                                                            setClassId(row.id as number);
                                                        }}
                                                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isDeleting ||
                                                            (userRole !== "ADMIN" &&
                                                                userRole !== "OWNER" &&
                                                                row?.deleteStatus === "PENDING")
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                row.id as number
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
                </div>
                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={classAndRates?.length}
                    title="শ্রেণি "
                />
            </div>



            {/* Create Modal */}
            {isOpen && (
                <NewClassModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            )}

            {/* Edit Modal */}
            {isOpenEditModal && (
                <EditClassAndRateModal
                    isOpen={isOpenEditModal}
                    onClose={() => setIsOpenEditModal(false)}
                    id={classId!}
                />
            )}
        </div>
    );
};

export default ChangeClassAndRate;