
"use client";

import CustomModal from "@/components/Reusable/CustomModal";

import { IApprovalRequest } from "@/interface/approval";

import {
    fieldNameMap,
    getModuleName,
} from "./approval.field";

interface ApprovalViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    approval: IApprovalRequest;
}

type TData = Record<string, unknown>;

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

    const isEmptyValue = (value: unknown) => {
        return (
            value === null ||
            value === undefined ||
            value === ""
        );
    };

    const normalizeValue = (value: unknown): unknown => {
        if (isEmptyValue(value)) {
            return "";
        }

        if (typeof value === "string") {
            const trimmedValue = value.trim();

            if (
                trimmedValue !== "" &&
                !Number.isNaN(Number(trimmedValue))
            ) {
                return Number(trimmedValue);
            }

            return trimmedValue;
        }

        if (typeof value === "number") {
            return value;
        }

        if (typeof value === "boolean") {
            return value;
        }

        if (Array.isArray(value)) {
            return value.map((item) =>
                normalizeValue(item),
            );
        }

        if (
            typeof value === "object" &&
            value !== null
        ) {
            const normalizedObject: TData = {};

            Object.entries(
                value as TData,
            ).forEach(([key, itemValue]) => {
                normalizedObject[key] =
                    normalizeValue(itemValue);
            });

            return normalizedObject;
        }

        return value;
    };

    const isValueChanged = (
        oldValue: unknown,
        newValue: unknown,
    ) => {
        const normalizedOldValue =
            normalizeValue(oldValue);

        const normalizedNewValue =
            normalizeValue(newValue);

        return (
            JSON.stringify(normalizedOldValue) !==
            JSON.stringify(normalizedNewValue)
        );
    };

    const renderValue = (value: unknown) => {
        if (isEmptyValue(value)) {
            return "-";
        }

        if (typeof value === "boolean") {
            return value ? "হ্যাঁ" : "না";
        }

        if (Array.isArray(value)) {
            return `${value.length}টি`;
        }

        if (
            typeof value === "object" &&
            value !== null
        ) {
            return JSON.stringify(
                value,
                null,
                2,
            );
        }

        return String(value);
    };

    const getFieldName = (
        module: string,
        key: string,
    ) => {
        return (
            fieldNameMap?.[module]?.[key] ||
            key
        );
    };

    const getDataParts = (
        data: TData | null | undefined,
    ) => {
        if (!data) {
            return {
                mainData: null,
                items: [],
            };
        }

        if (
            data.invoice &&
            typeof data.invoice === "object" &&
            !Array.isArray(data.invoice)
        ) {
            return {
                mainData: data.invoice as TData,
                items: Array.isArray(data.items)
                    ? data.items
                    : [],
            };
        }

        return {
            mainData: data,
            items: Array.isArray(data.items)
                ? data.items
                : [],
        };
    };

    const renderItems = (
        items: unknown[],
        oldItems: unknown[] = [],
        highlightChanged = false,
    ) => {
        if (!items.length) {
            return (
                <div className="rounded-md border bg-gray-50 p-4 text-sm text-gray-500">
                    কোনো পণ্য নেই
                </div>
            );
        }

        const oldItemMap = new Map<string, TData>();

        oldItems.forEach((item, index) => {
            if (
                item &&
                typeof item === "object" &&
                !Array.isArray(item)
            ) {
                const itemData = item as TData;

                if (
                    itemData.id !== undefined &&
                    itemData.id !== null
                ) {
                    oldItemMap.set(
                        String(itemData.id),
                        itemData,
                    );
                }

                oldItemMap.set(
                    `index-${index}`,
                    itemData,
                );
            }
        });

        return (
            <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="whitespace-nowrap border-b px-3 py-2 text-left font-semibold text-gray-600">
                                #
                            </th>

                            {[
                                "class",
                                "rate",
                                "quantity",
                                "price",
                            ].map((key) => (
                                <th
                                    key={key}
                                    className="whitespace-nowrap border-b px-3 py-2 text-left font-semibold text-gray-600"
                                >
                                    {getFieldName(
                                        "CHALLAN_ITEM",
                                        key,
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {items.map((item, index) => {
                            if (
                                !item ||
                                typeof item !== "object" ||
                                Array.isArray(item)
                            ) {
                                return null;
                            }

                            const itemData = item as TData;

                            const itemId =
                                itemData.id !== undefined &&
                                    itemData.id !== null
                                    ? String(itemData.id)
                                    : `index-${index}`;

                            const oldItem =
                                oldItemMap.get(itemId) ||
                                oldItemMap.get(`index-${index}`);

                            const renderItemCell = (
                                key: string,
                            ) => {
                                const value =
                                    itemData[key];

                                const oldValue =
                                    oldItem?.[key];

                                const changed =
                                    highlightChanged &&
                                    oldItem !== undefined &&
                                    isValueChanged(
                                        oldValue,
                                        value,
                                    );

                                return (
                                    <td
                                        className={`whitespace-nowrap px-3 py-2 ${changed
                                                ? "bg-yellow-50 font-semibold text-yellow-900"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        {renderValue(value)}
                                    </td>
                                );
                            };

                            return (
                                <tr
                                    key={itemId}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-2 text-gray-500">
                                        {index + 1}
                                    </td>

                                    {renderItemCell("class")}

                                    {renderItemCell("rate")}

                                    {renderItemCell("quantity")}

                                    {renderItemCell("price")}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderData = (
        data:
            | Record<string, unknown>
            | null
            | undefined,
        module: string,
        highlightChanged = false,
        oldData:
            | Record<string, unknown>
            | null
            | undefined = null,
    ) => {
        if (!data) {
            return (
                <div className="rounded-md border bg-gray-50 p-4 text-sm text-gray-500">
                    কোনো তথ্য নেই
                </div>
            );
        }

        const {
            mainData,
            items,
        } = getDataParts(data);

        const {
            items: oldItems,
        } = getDataParts(oldData);

        if (!mainData) {
            return (
                <div className="rounded-md border bg-gray-50 p-4 text-sm text-gray-500">
                    কোনো তথ্য নেই
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="max-h-72 overflow-auto rounded-md border bg-gray-50">
                    <div className="divide-y">
                        {Object.entries(
                            mainData,
                        ).map(
                            ([
                                key,
                                value,
                            ]) => {
                                const oldValue =
                                    oldData
                                        ? getDataParts(
                                            oldData,
                                        )
                                            .mainData?.[
                                        key
                                        ]
                                        : undefined;

                                const changed =
                                    highlightChanged &&
                                    isValueChanged(
                                        oldValue,
                                        value,
                                    );

                                return (
                                    <div
                                        key={
                                            key
                                        }
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
                                            {getFieldName(
                                                module,
                                                key,
                                            )}
                                        </div>

                                        <div
                                            className={`break-all whitespace-pre-wrap text-xs ${changed
                                                ? "font-semibold text-yellow-900"
                                                : "text-gray-700"
                                                }`}
                                        >
                                            {renderValue(
                                                value,
                                            )}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>

                {module === "CHALLAN" &&
                    items.length > 0 && (
                        <div>
                            <p className="mb-2 text-xs font-semibold text-gray-700">
                                চালানের পণ্য
                            </p>

                            {renderItems(
                                items,
                                oldItems,
                                highlightChanged,
                            )}
                        </div>
                    )}
            </div>
        );
    };

    const oldData =
        approval.oldData as
        | Record<string, unknown>
        | null;

    const newData =
        approval.newData as
        | Record<string, unknown>
        | null;

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            width="xxl"
            title="অনুমোদনের বিস্তারিত"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-md border bg-gray-50 p-3">
                        <p className="mb-1 text-xs text-gray-500">
                            মডিউল
                        </p>

                        <p className="font-medium text-gray-900">
                            {getModuleName(
                                approval.module,
                            )}
                        </p>
                    </div>

                    <div className="rounded-md border bg-gray-50 p-3">
                        <p className="mb-1 text-xs text-gray-500">
                            অ্যাকশন
                        </p>

                        <p className="font-medium text-gray-900">
                            {getActionName(
                                approval.action,
                            )}
                        </p>
                    </div>

                    <div className="rounded-md border bg-gray-50 p-3">
                        <p className="mb-1 text-xs text-gray-500">
                            স্ট্যাটাস
                        </p>

                        <p className="font-medium text-gray-900">
                            {getStatusName(
                                approval.status,
                            )}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">
                        অনুরোধকারী
                    </p>

                    <div className="rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                        {approval.requestedBy
                            ?.name || "-"}
                    </div>
                </div>

                <div
                    className={
                        approval.action ===
                            "UPDATE"
                            ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                            : "grid grid-cols-1"
                    }
                >
                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-800">
                            বর্তমান তথ্য
                        </p>

                        {renderData(
                            oldData,
                            approval.module,
                        )}
                    </div>

                    {approval.action ===
                        "UPDATE" && (
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
                                    newData,
                                    approval.module,
                                    true,
                                    oldData,
                                )}
                            </div>
                        )}
                </div>
            </div>
        </CustomModal>
    );
};

export default ApprovalViewModal;

