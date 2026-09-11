"use client";

import Image from "next/image";
import { useState } from "react";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    CircleCheck,
    Wrench,
} from "lucide-react";

import { useGetGoodIssueHistoryQuery } from "@/redux/features/goods_issue.features";

import CustomLoader from "@/components/Reusable/CustomLoader";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import ImageViewModal from "@/components/Dashboard/common/ImageViewModal";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

import { TGoodsIssueHistory } from "@/interface/good_stock";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";

export default function AssetHistory({ limit, page }: TQuery) {
    const {
        data,
        isLoading,
        isError,
    } = useGetGoodIssueHistoryQuery({
        limit,
        page,
    });

    const [imageModal, setImageModal] = useState(false);
    const [image, setImage] = useState("");

    const issues: TGoodsIssueHistory[] = data?.data?.data || [];
    const meta = data?.data?.meta as TMetaConfig;

    // =========================
    // Summary
    // =========================

    const totalIssue = issues
        .filter((item) => item.type === "ISSUE")
        .reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
        );

    const totalReturn = issues
        .filter((item) => item.type === "RETURN")
        .reduce(
            (sum, item) =>
                sum +
                Number(item.okay || 0) +
                Number(item.damage || 0) +
                Number(item.lost || 0),
            0,
        );

    const totalDamage = issues.reduce(
        (sum, item) => sum + Number(item.damage || 0),
        0,
    );

    const totalLost = issues.reduce(
        (sum, item) => sum + Number(item.lost || 0),
        0,
    );

    // =========================
    // Type Badge
    // =========================

    const renderTypeBadge = (type: string) => {
        switch (type) {
            case "ISSUE":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-500">
                        <ArrowUpFromLine size={13} />
                        ইস্যু
                    </span>
                );

            case "RETURN":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-500">
                        <ArrowDownToLine size={13} />
                        ফেরত
                    </span>
                );

            case "LOST":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                        <CircleCheck size={13} />
                        উদ্ধার
                    </span>
                );

            case "DAMAGED_REPAIRED":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-500">
                        <Wrench size={13} />
                        মেরামত
                    </span>
                );

            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                        -
                    </span>
                );
        }
    };

    // =========================
    // Status
    // =========================

    const renderStatus = (issue: TGoodsIssueHistory) => {
        if (issue.type === "ISSUE") {
            return (
                <span className="text-gray-400">
                    -
                </span>
            );
        }

        return (
            <div className="flex flex-wrap justify-center gap-1.5">
                {issue.okay ? (
                    <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-600">
                        G:{issue.okay}
                    </span>
                ) : ""}

                {issue.damage ? (
                    <span className="rounded bg-orange-50 px-2 py-1 text-xs text-orange-600">
                        D:{issue.damage}
                    </span>
                ) : ""}

                {issue.lost ? (
                    <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-600">
                        L:{issue.lost}
                    </span>
                ) : ""}

                {!issue.okay ?
                    !issue.damage &&
                    !issue.lost && (
                        <span className="text-gray-400">
                            -
                        </span>
                    ) : ""}
            </div>
        );
    };

    // =========================
    // Description
    // =========================

    const renderDescription = (issue: TGoodsIssueHistory) => {
        if (issue.description) {
            return <p>{issue.description}</p>;
        }

        if (issue.receiveBy || issue.returnBy) {
            return (
                <div className="space-y-1 text-sm">
                    {issue.receiveBy && (
                        <p className="text-gray-700">
                            নিয়েছে: {issue.receiveBy}
                        </p>
                    )}

                    {issue.returnBy && (
                        <p className="text-blue-600">
                            দিয়েছে: {issue.returnBy}
                        </p>
                    )}
                </div>
            );
        }

        return (
            <span className="text-gray-400">
                -
            </span>
        );
    };

    return (
        <div className="w-full space-y-5">
            <div>
                <h1 className="text-xl font-semibold text-gray-800">
                    মালামালের হিস্টোরি
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    ইস্যু এবং ফেরত আসা সকল মালামালের তথ্য
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Issue */}
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                    <p className="text-sm text-gray-500">
                        মোট ইস্যু
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-[#159B6B]">
                        {toBanglaNumber(totalIssue)}
                    </h2>
                </div>

                {/* Total Return */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm text-gray-500">
                        মোট ফেরত
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-blue-600">
                        {toBanglaNumber(totalReturn)}
                    </h2>
                </div>

                {/* Total Damage */}
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <p className="text-sm text-gray-500">
                        মোট নষ্ট
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-orange-500">
                        {toBanglaNumber(totalDamage)}
                    </h2>
                </div>

                {/* Total Lost */}
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-sm text-gray-500">
                        মোট হারানো
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-red-500">
                        {toBanglaNumber(totalLost)}
                    </h2>
                </div>
            </div>


            <div>
                <div className="overflow-x-auto mt-5 border rounded-t-md">
                    <table className="min-w-full border-collapse rounded-t-md">
                        <thead className="rounded-t-md">
                            <tr className="bg-[#159B6B] text-white">
                                <TableHead th="তারিখ" />
                                <TableHead th="টাইপ" />
                                <TableHead th="মালামাল" />
                                <TableHead th="বিবরণ" />
                                <TableHead th="পরিমাণ" />
                                <TableHead th="অবস্থা" />
                                <TableHead th="প্রমাণ" />
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {/* Loading */}
                            {isLoading && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-10"
                                    >
                                        <CustomLoader cls="h-[20vh]" />
                                    </td>
                                </tr>
                            )}

                            {/* Error */}
                            {!isLoading && isError && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-sm text-red-500"
                                    >
                                        তথ্য লোড করতে সমস্যা হয়েছে।
                                    </td>
                                </tr>
                            )}

                            {/* Empty */}
                            {!isLoading &&
                                !isError &&
                                issues.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 text-sm text-gray-500"
                                        >
                                            কোনো তথ্য পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                )}

                            {/* Data */}
                            {!isLoading &&
                                !isError &&
                                issues.map((issue) => (
                                    <tr
                                        key={issue.id}
                                        className="border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-50"
                                    >
                                        {/* Date */}
                                        <TableData
                                            td={formatBanglaDate({
                                                date: issue.date,
                                            })}
                                        />

                                        {/* Type */}
                                        <td className="border-r border-gray-100 px-3 py-3">
                                            {renderTypeBadge(
                                                issue.type,
                                            )}
                                        </td>

                                        {/* Good */}
                                        <TableData
                                            td={
                                                issue.good?.name || "-"
                                            }
                                        />

                                        {/* Description */}
                                        <td className="border-r border-gray-100 px-3 py-3 text-nowrap">
                                            {renderDescription(issue)}
                                        </td>

                                        {/* Quantity */}
                                        <TableData
                                            td={toBanglaNumber(
                                                issue.quantity || 0,
                                            )}
                                            cls="font-semibold"
                                        />

                                        {/* Status */}
                                        <td className="border-r border-gray-100 px-3 py-3 text-nowrap">
                                            {renderStatus(issue)}
                                        </td>

                                        {/* Image */}
                                        <td className="px-3 py-3">
                                            {issue.image ? (
                                                <Image
                                                    onClick={() => {
                                                        setImage(
                                                            issue.image!,
                                                        );
                                                        setImageModal(
                                                            true,
                                                        );
                                                    }}
                                                    unoptimized
                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${issue.image}`}
                                                    alt="প্রমাণ"
                                                    height={100}
                                                    width={100}
                                                    className="mx-auto h-10 w-10 cursor-pointer object-cover"
                                                />
                                            ) : (
                                                <span className="text-center text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={issues.length}
                    title="হিস্টোরি"
                />
            </div>


            {imageModal && image && (
                <ImageViewModal
                    image={image}
                    isOpen={imageModal}
                    onClose={() => {
                        setImageModal(false);
                        setImage("");
                    }}
                />
            )}
        </div>
    );
}