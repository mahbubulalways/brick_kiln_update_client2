"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomSelect2 from "@/components/Reusable/CustomSelect2";
import { TablePagination } from "@/components/Reusable/TablePagination";

import { TQuery } from "@/interface/query";
import { IApprovalRequest, TApprovalStatus } from "@/interface/approval";
import { TMetaConfig } from "@/interface/meta";

import { useChangeApprovalStatusMutation, useGetAllApprovalRequestQuery } from "@/redux/features/approval";

import ApprovalViewModal from "./ApprovalViewModal";
import Swal from "sweetalert2";

const approvalStatusOptions = [
    {
        label: "অপেক্ষমাণ",
        value: "PENDING",
    },
    {
        label: "অনুমোদিত",
        value: "APPROVED",
    },
    {
        label: "বাতিল",
        value: "CANCELLED",
    },
];

const ApprovalRequestPage = ({ page, limit }: TQuery) => {
    const [isOpenViewModal, setIsOpenViewModal] = useState(false);
    const [statusChangeAsync, { isLoading: statusLoading }] = useChangeApprovalStatusMutation()
    const [selectedApproval, setSelectedApproval] =
        useState<IApprovalRequest | null>(null);

    const { isLoading, data } = useGetAllApprovalRequestQuery({
        page,
        limit,
    });

    const approvals = (data?.data?.data || []) as IApprovalRequest[];

    const meta = data?.data?.meta as TMetaConfig;

    const handleView = (approval: IApprovalRequest) => {
        setSelectedApproval(approval);
        setIsOpenViewModal(true);
    };



    const handleStatusChange = async (
        id: string,
        value: string | number,
    ) => {
        const status = value as TApprovalStatus;

        const getApprovalStatusLabel = (
            status: TApprovalStatus,
        ) => {
            return (
                approvalStatusOptions.find(
                    (item) => item.value === status,
                )?.label || status
            );
        };

        const statusLabel = getApprovalStatusLabel(status);

        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: `অনুমোদনের স্ট্যাটাস ${statusLabel} করতে চান?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            const info = {
                id,
                data: {
                    status,
                },
            };

            const response = await statusChangeAsync(info).unwrap();

            await Swal.fire({
                title: "স্ট্যাটাস পরিবর্তন হয়েছে!",
                text: response?.message || `অনুমোদনের স্ট্যাটাস ${statusLabel} করা হয়েছে।`,
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            console.log(error)
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "অনুমোদনের স্ট্যাটাস পরিবর্তন করা যায়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };
    const getModuleName = (
        module: IApprovalRequest["module"],
    ) => {
        const moduleNames: Record<
            IApprovalRequest["module"],
            string
        > = {
            CHALLAN: "চালান",
            DELIVERY: "ডেলিভারি",
            CUSTOMER: "কাস্টমার",
            PAYMENT: "পেমেন্ট",
            STOCK: "স্টক",
            LEDGER: "লেজার",
            DUE: "বাকি",
            CASH: "ক্যাশ",
            INVOICE: "ইনভয়েস",
            CLASS_RATE: "শ্রেণি ও রেট",
            TASK: "টাস্ক",
            DRIVER: "ড্রাইভার",
        };

        return moduleNames[module];
    };

    const getActionName = (
        action: IApprovalRequest["action"],
    ) => {
        if (action === "UPDATE") return "আপডেট";
        if (action === "DELETE") return "ডিলেট";

        return action;
    };

    const getStatusName = (
        status: IApprovalRequest["status"],
    ) => {
        if (status === "PENDING") return "অপেক্ষমাণ";
        if (status === "APPROVED") return "অনুমোদিত";
        if (status === "CANCELLED") return "বাতিল";
        if (status === "DEFAULT") return "ডিফল্ট";

        return status;
    };

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between px-2 pt-2">
                <h1 className="py-3 text-xl font-semibold text-gray-900">
                    অনুমোদনের অনুরোধ
                </h1>
            </div>

            <div className="rounded-md border bg-white">
                <div className="rounded-t-md">
                    <table className="min-w-full border-collapse overflow-x-auto">
                        <thead>
                            <tr className="bg-[#039A63] text-center text-white">
                                <TableHead th="#" />
                                <TableHead th="মডিউল" />
                                <TableHead th="অ্যাকশন" />
                                <TableHead th="অনুরোধকারী" />
                                <TableHead th="স্ট্যাটাস" />
                                <TableHead th="তারিখ" />
                                <TableHead th="বাটন" />
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7}>
                                        <CustomLoader cls="h-[30vh]" />
                                    </td>
                                </tr>
                            ) : !approvals.length ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-gray-600"
                                    >
                                        কোনো অনুমোদনের অনুরোধ পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                approvals.map(
                                    (
                                        row: IApprovalRequest,
                                        index: number,
                                    ) => (
                                        <tr
                                            key={row.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <TableData td={index + 1} />

                                            <TableData
                                                td={getModuleName(
                                                    row.module,
                                                )}
                                            />

                                            <TableData
                                                td={getActionName(
                                                    row.action,
                                                )}
                                            />

                                            <TableData
                                                td={
                                                    row?.requestedBy?.name ||
                                                    "-"
                                                }
                                            />

                                            <td className="w-36 border p-2">
                                                <CustomSelect2
                                                    options={
                                                        approvalStatusOptions
                                                    }
                                                    value={row.status}
                                                    disabled={
                                                        row?.status !== "PENDING" || statusLoading
                                                    }
                                                    placeholder="স্ট্যাটাস নির্বাচন করুন"
                                                    onChange={(value) => {
                                                        handleStatusChange(
                                                            row.id,
                                                            value,
                                                        );
                                                    }}
                                                />
                                            </td>

                                            <TableData
                                                td={new Date(
                                                    row.createdAt,
                                                ).toLocaleDateString(
                                                    "bn-BD",
                                                )}
                                            />

                                            <td className="border p-2">
                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleView(row)
                                                        }
                                                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ),
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={approvals.length}
                    title="অনুমোদনের অনুরোধ"
                />
            </div>

            {isOpenViewModal && selectedApproval && (
                <ApprovalViewModal
                    isOpen={isOpenViewModal}
                    onClose={() => {
                        setIsOpenViewModal(false);
                        setSelectedApproval(null);
                    }}
                    approval={selectedApproval}
                />
            )}
        </div>
    );
};

export default ApprovalRequestPage;