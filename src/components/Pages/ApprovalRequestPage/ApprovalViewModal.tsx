"use client";

import CustomModal from "@/components/Reusable/CustomModal";

import { IApprovalRequest } from "@/interface/approval";
import { fieldNameMap, getModuleName } from "./approval.field";

interface ApprovalViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    approval: IApprovalRequest;
}

const ApprovalViewModal = ({
    isOpen,
    onClose,
    approval,
}: ApprovalViewModalProps) => {
    if (!isOpen) return null;



    const getActionName = (
        action: IApprovalRequest["action"],
    ) => {
        const actionNames: Record<
            IApprovalRequest["action"],
            string
        > = {
            UPDATE: "আপডেট",
            DELETE: "ডিলেট",
        };

        return actionNames[action];
    };

    const getStatusName = (
        status: IApprovalRequest["status"],
    ) => {
        const statusNames: Record<
            IApprovalRequest["status"],
            string
        > = {
            DEFAULT: "ডিফল্ট",
            PENDING: "অপেক্ষমাণ",
            APPROVED: "অনুমোদিত",
            CANCELLED: "বাতিল",
        };

        return statusNames[status];
    };

    const isValueChanged = (key: string) => {
        if (!approval.oldData || !approval.newData) {
            return false;
        }

        return (
            JSON.stringify(approval.oldData[key]) !==
            JSON.stringify(approval.newData[key])
        );
    };

    const renderData = (
        data: Record<string, unknown> | null | undefined,
        module: string,
        highlightChanged = false,
    ) => {
        if (!data) {
            return (
                <div className="rounded-md border bg-gray-50 p-4 text-sm text-gray-500">
                    কোনো তথ্য নেই
                </div>
            );
        }

        return (
            <div className="max-h-72 overflow-auto rounded-md border bg-gray-50">
                <div className="divide-y">

                    {Object.entries(data).map(
                        ([key, value]) => {
                            const changed =
                                highlightChanged &&
                                isValueChanged(key);

                            return (
                                <div
                                    key={key}
                                    className={`grid grid-cols-1 gap-1 px-3 py-2 sm:grid-cols-[160px_1fr] sm:gap-3 ${changed
                                        ? "bg-yellow-50"
                                        : ""
                                        }`}
                                >
                                    <div
                                        className={`text-xs font-semibold ${changed
                                            ? "text-yellow-800"
                                            : "text-gray-600"
                                            }`}
                                    >
                                        {fieldNameMap?.[module]?.[key] || key}
                                    </div>

                                    <div
                                        className={`break-all text-xs ${changed
                                            ? "font-semibold text-yellow-900"
                                            : "text-gray-700"
                                            }`}
                                    >
                                        {typeof value === "object" &&
                                            value !== null
                                            ? JSON.stringify(
                                                value,
                                                null,
                                                2,
                                            )
                                            : String(
                                                value ?? "",
                                            )}
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            </div>
        );
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            width="xxl"
            title="অনুমোদনের বিস্তারিত"
        >
            <div className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-md border bg-gray-50 p-3">
                        <p className="mb-1 text-xs text-gray-500">
                            মডিউল
                        </p>

                        <p className="font-medium text-gray-900">
                            {getModuleName(approval.module)}
                        </p>
                    </div>

                    <div className="rounded-md border bg-gray-50 p-3">
                        <p className="mb-1 text-xs text-gray-500">
                            অ্যাকশন
                        </p>

                        <p className="font-medium text-gray-900">
                            {getActionName(approval.action)}
                        </p>
                    </div>

                    <div className="rounded-md border bg-gray-50 p-3">
                        <p className="mb-1 text-xs text-gray-500">
                            স্ট্যাটাস
                        </p>

                        <p className="font-medium text-gray-900">
                            {getStatusName(approval.status)}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">
                        অনুরোধকারী
                    </p>

                    <div className="rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                        {approval.requestedBy?.name || "-"}
                    </div>
                </div>

                <div
                    className={
                        approval.action === "UPDATE"
                            ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                            : "grid grid-cols-1"
                    }
                >
                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-800">
                            বর্তমান তথ্য
                        </p>

                        {renderData(approval.oldData, approval?.module)}
                    </div>

                    {approval.action === "UPDATE" && (
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-800">
                                    নতুন তথ্য
                                </p>

                                <span className="rounded bg-yellow-100 px-2 py-1 text-[11px] font-medium text-yellow-800">
                                    পরিবর্তিত তথ্য
                                </span>
                            </div>

                            {renderData(
                                approval.newData,
                                approval.module,
                                true,
                            )}
                        </div>
                    )}
                </div>
            </div>
        </CustomModal>
    );
};

export default ApprovalViewModal;