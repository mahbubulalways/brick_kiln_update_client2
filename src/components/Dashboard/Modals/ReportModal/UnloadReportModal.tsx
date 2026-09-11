/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import CustomModal from "@/components/Reusable/CustomModal";
import { TClassAndRate } from "@/types/types";
import { useGetAllUnloadReportQuery } from "@/redux/features/unload.features";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { TUnloadResponse } from "@/interface/unload";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import { SERVER_ERROR_MESSAGE } from "@/constant";

type TUploadReporty = {
    isOpen: boolean;
    onClose: () => void;
    classes: TClassAndRate[];
};

const UnloadReportModal = ({
    isOpen,
    onClose,
    classes = [],
}: TUploadReporty) => {
    const [activeTab, setActiveTab] = useState<
        "quantity" | "percentage" | "brick"
    >("quantity");

    const tabs = [
        {
            id: "quantity",
            title: "সংখ্যায় আনলোডের রিপোর্ট",
        },
        {
            id: "percentage",
            title: "শতকায় আনলোডের রিপোর্ট",
        },
        {
            id: "brick",
            title: "ইট এবং আধার রিপোর্ট",
        },
    ] as const;

    const {
        isError,
        isLoading,
        data,
    } = useGetAllUnloadReportQuery(undefined, {
        skip: !isOpen,
    });

    const reportData = (data?.data ?? []) as TUnloadResponse[];

    const totalColumns = classes.length + 4;

    const getClassQuantity = (
        row: TUnloadResponse,
        classId: string | number
    ) => {
        const classData = row.items?.find(
            (item) => String(item.class?.id) === String(classId)
        );

        return Number(classData?.quantity ?? 0);
    };

    const getRowTotal = (row: TUnloadResponse) => {
        return (
            row.items?.reduce(
                (sum, item) => sum + Number(item.quantity ?? 0),
                0
            ) ?? 0
        );
    };

    const getPercentage = (quantity: number, total: number) => {
        if (!total || !quantity) return 0;

        return (quantity / total) * 100;
    };

    const renderQuantityReport = () => {
        const classTotals = classes.reduce<Record<string, number>>(
            (acc, classItem) => {
                const classId = String(classItem.id);

                acc[classId] = reportData.reduce((sum, row) => {
                    return sum + getClassQuantity(row, classItem.id!);
                }, 0);

                return acc;
            },
            {}
        );

        const grandTotal = reportData.reduce(
            (sum, row) => sum + getRowTotal(row),
            0
        );

        return (
            <div className="w-full overflow-x-auto">
                <table className="min-w-full border-t text-center">
                    <thead className="bg-[#039A63] text-white">
                        <tr>
                            <TableHead th="তারিখ" />

                            <TableHead
                                th="রাউন্ড"
                                cls="hidden lg:table-cell"
                            />

                            {classes.map((classItem) => (
                                <TableHead
                                    key={classItem.id}
                                    th={classItem.className}
                                />
                            ))}

                            <TableHead th="মোট ইট" />

                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={totalColumns}>
                                    <CustomLoader cls="h-[30vh]" />
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td
                                    colSpan={totalColumns}
                                    className="py-8"
                                >
                                    {SERVER_ERROR_MESSAGE}
                                </td>
                            </tr>
                        ) : !reportData.length ? (
                            <tr>
                                <td
                                    colSpan={totalColumns}
                                    className="py-8 text-gray-600"
                                >
                                    {data?.message ||
                                        "কোনো তথ্য পাওয়া যায়নি"}
                                </td>
                            </tr>
                        ) : (
                            <>
                                {reportData.map((row, idx) => {
                                    const total = getRowTotal(row);

                                    return (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50"
                                        >
                                            <TableData
                                                td={new Date(
                                                    row.date
                                                ).toLocaleDateString(
                                                    "bn-BD"
                                                )}
                                            />

                                            <TableData
                                                td={toBanglaNumber(
                                                    row.round?.name || "-"
                                                )}
                                                cls="hidden lg:table-cell"
                                            />

                                            {classes.map((classItem) => {
                                                const quantity =
                                                    getClassQuantity(
                                                        row,
                                                        classItem.id!
                                                    );

                                                return (
                                                    <TableData
                                                        key={classItem.id}
                                                        td={toBanglaNumber(
                                                            quantity
                                                        )}
                                                    />
                                                );
                                            })}

                                            <TableData
                                                td={toBanglaNumber(total)}
                                            />

                                            <td className="border px-3 py-2"></td>
                                        </tr>
                                    );
                                })}

                                <tr className="bg-orange-50 font-bold text-[#FF480D]">
                                    <TableData td="মোট" />

                                    <TableData
                                        td=""
                                        cls="hidden lg:table-cell"
                                    />

                                    {classes.map((classItem) => (
                                        <TableData
                                            key={classItem.id}
                                            td={toBanglaNumber(
                                                classTotals[
                                                String(classItem.id)
                                                ] ?? 0
                                            )}
                                        />
                                    ))}

                                    <TableData
                                        td={toBanglaNumber(grandTotal)}
                                    />

                                    <td className="border"></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderPercentageReport = () => {
        const grandTotal = reportData.reduce(
            (total, row) => total + getRowTotal(row),
            0
        );

        const getClassTotal = (classId: string | number) => {
            return reportData.reduce((total, row) => {
                return total + getClassQuantity(row, classId);
            }, 0);
        };

        return (
            <div className="w-full overflow-x-auto">
                <table className="min-w-full border-collapse text-center text-[14px]">
                    <thead className="bg-[#039A63] text-white">
                        <tr>
                            <th className="whitespace-nowrap border border-white/20 px-3 py-2">
                                রাউন্ড
                            </th>

                            {classes.map((classItem) => (
                                <th
                                    key={classItem.id}
                                    className="whitespace-nowrap border border-white/20 px-3 py-2"
                                >
                                    {classItem.className}
                                </th>
                            ))}

                            <th className="whitespace-nowrap border border-white/20 px-3 py-2">
                                মোট ইট
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportData.map((row, idx) => {
                            const rowTotal = getRowTotal(row);

                            return (
                                <tr
                                    key={idx}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap border px-3 py-2 font-medium">
                                        {row.round?.name || "-"}
                                    </td>

                                    {classes.map((classItem) => {
                                        const quantity =
                                            getClassQuantity(
                                                row,
                                                classItem.id!
                                            );

                                        const percentage =
                                            getPercentage(
                                                quantity,
                                                rowTotal
                                            );

                                        return (
                                            <td
                                                key={classItem.id}
                                                className="whitespace-nowrap border px-3 py-2"
                                            >
                                                {toBanglaNumber(
                                                    percentage.toFixed(2)
                                                )}
                                                %
                                            </td>
                                        );
                                    })}

                                    <td className="whitespace-nowrap border px-3 py-2 font-semibold text-[#FF480D]">
                                        {rowTotal > 0
                                            ? `${toBanglaNumber(
                                                "100.00"
                                            )}%`
                                            : "০.০০%"}
                                    </td>
                                </tr>
                            );
                        })}

                        <tr className="bg-orange-50 font-bold text-[#FF480D]">
                            <td className="border px-3 py-2">
                                মোট
                            </td>

                            {classes.map((classItem) => {
                                const classTotal = getClassTotal(
                                    classItem.id!
                                );

                                const percentage =
                                    grandTotal > 0
                                        ? (classTotal / grandTotal) *
                                        100
                                        : 0;

                                return (
                                    <td
                                        key={classItem.id}
                                        className="whitespace-nowrap border px-3 py-2"
                                    >
                                        {toBanglaNumber(
                                            percentage.toFixed(2)
                                        )}
                                        %
                                    </td>
                                );
                            })}

                            <td className="whitespace-nowrap border px-3 py-2">
                                {grandTotal > 0
                                    ? `${toBanglaNumber("100.00")}%`
                                    : "০.০০%"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const renderBrickReport = () => {
        const getRowData = (row: TUnloadResponse) => {
            const brick =
                row.items?.reduce(
                    (sum, item) =>
                        item.class?.classType === "ইট"
                            ? sum + Number(item.quantity ?? 0)
                            : sum,
                    0
                ) ?? 0;

            const adhar =
                row.items?.reduce(
                    (sum, item) =>
                        item.class?.classType === "আধলা"
                            ? sum + Number(item.quantity ?? 0)
                            : sum,
                    0
                ) ?? 0;

            const total = brick + adhar;

            const brickPercentage =
                total > 0 ? (brick / total) * 100 : 0;

            const adharPercentage =
                total > 0 ? (adhar / total) * 100 : 0;

            return {
                brick,
                adhar,
                total,
                brickPercentage,
                adharPercentage,
            };
        };

        const grandBrick = reportData.reduce(
            (sum, row) => sum + getRowData(row).brick,
            0
        );

        const grandAdhar = reportData.reduce(
            (sum, row) => sum + getRowData(row).adhar,
            0
        );

        const grandTotal = grandBrick + grandAdhar;

        const grandBrickPercentage =
            grandTotal > 0
                ? (grandBrick / grandTotal) * 100
                : 0;

        const grandAdharPercentage =
            grandTotal > 0
                ? (grandAdhar / grandTotal) * 100
                : 0;

        return (
            <div className="w-full overflow-x-auto">
                <table className="min-w-full border-collapse text-center">
                    <thead className="bg-[#039A63] text-white">
                        <tr>
                            <th className="border border-white/20 px-3 py-2">
                                রাউন্ড
                            </th>

                            <th className="border border-white/20 px-3 py-2">
                                লোড
                            </th>

                            <th className="border border-white/20 px-3 py-2">
                                ইট
                            </th>

                            <th className="border border-white/20 px-3 py-2">
                                আধলা
                            </th>

                            <th className="border border-white/20 px-3 py-2">
                                ইট %
                            </th>

                            <th className="border border-white/20 px-3 py-2">
                                আধলা %
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportData.map((row, idx) => {
                            const {
                                brick,
                                adhar,
                                total,
                                brickPercentage,
                                adharPercentage,
                            } = getRowData(row);

                            return (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap border px-3 py-2 font-medium">
                                        {row.round?.name || "-"}
                                    </td>

                                    <td className="border px-3 py-2">
                                        {toBanglaNumber(
                                            total.toLocaleString()
                                        )}
                                    </td>

                                    <td className="border px-3 py-2">
                                        {toBanglaNumber(
                                            brick.toLocaleString()
                                        )}
                                    </td>

                                    <td className="border px-3 py-2">
                                        {toBanglaNumber(
                                            adhar.toLocaleString()
                                        )}
                                    </td>

                                    <td className="border px-3 py-2">
                                        {toBanglaNumber(
                                            brickPercentage.toFixed(2)
                                        )}{" "}
                                        %
                                    </td>

                                    <td className="border px-3 py-2">
                                        {toBanglaNumber(
                                            adharPercentage.toFixed(2)
                                        )}{" "}
                                        %
                                    </td>
                                </tr>
                            );
                        })}

                        <tr className="bg-orange-50 font-bold text-[#FF480D]">
                            <td className="border px-3 py-2">
                                মোট
                            </td>

                            <td className="border px-3 py-2">
                                {toBanglaNumber(
                                    grandTotal.toLocaleString()
                                )}
                            </td>

                            <td className="border px-3 py-2">
                                {toBanglaNumber(
                                    grandBrick.toLocaleString()
                                )}
                            </td>

                            <td className="border px-3 py-2">
                                {toBanglaNumber(
                                    grandAdhar.toLocaleString()
                                )}
                            </td>

                            <td className="border px-3 py-2">
                                {toBanglaNumber(
                                    grandBrickPercentage.toFixed(2)
                                )}{" "}
                                %
                            </td>

                            <td className="border px-3 py-2">
                                {toBanglaNumber(
                                    grandAdharPercentage.toFixed(2)
                                )}{" "}
                                %
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="আনলোড রিপোর্ট"
            width="full"
        >
            <div className="w-full">
                <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-3">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() =>
                                    setActiveTab(tab.id)
                                }
                                className={`
                                    w-full
                                    rounded-[7px]
                                    border
                                    border-[#039A63]
                                    px-3
                                    py-2
                                    text-[15px]
                                    font-medium
                                    transition-all
                                    duration-300
                                    ${isActive
                                        ? "bg-[#039A63] text-white shadow-sm"
                                        : "bg-white text-[#039A63] hover:bg-[#039A63] hover:text-white"
                                    }
                                `}
                            >
                                {tab.title}
                            </button>
                        );
                    })}
                </div>

                {isLoading && (
                    <div className="py-10">
                        <CustomLoader cls="h-[25vh]" />
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="py-10 text-center text-red-500">
                        রিপোর্ট লোড করা সম্ভব হয়নি।
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    !reportData.length && (
                        <div className="py-10 text-center text-gray-500">
                            কোনো রিপোর্ট পাওয়া যায়নি।
                        </div>
                    )}

                {!isLoading &&
                    !isError &&
                    reportData.length > 0 &&
                    activeTab === "quantity" &&
                    renderQuantityReport()}

                {!isLoading &&
                    !isError &&
                    reportData.length > 0 &&
                    activeTab === "percentage" &&
                    renderPercentageReport()}

                {!isLoading &&
                    !isError &&
                    reportData.length > 0 &&
                    activeTab === "brick" &&
                    renderBrickReport()}
            </div>
        </CustomModal>
    );
};

export default UnloadReportModal;