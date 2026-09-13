"use client";

import {
    FiArchive,
    FiCalendar,
    FiDatabase,
    FiDownload,
    FiFileText,
    FiHardDrive,
    FiLayers,
    FiPlus,
    FiTrash2,
    FiUsers,
} from "react-icons/fi";

import { showToast } from "@/components/Toast/CustomToast";

import {
    useCreateDatabaseBackupMutation,
    useDeleteDatabaseBackupMutation,
} from "@/redux/system.features/backup.features";

import FileSaver from "file-saver";
import Swal from "sweetalert2";

import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";

interface DatabaseBackupSummary {
    totalBackup: number;
    totalFileSize: string;
    totalTableCount: number;
    totalRowCount: string;
}

interface DatabaseBackupData {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number | string;
    tableCount: number;
    totalRowCount: number | string;
    tableRowCounts?: Record<string, number> | null;
    createdAt: string;
}

interface DatabaseBackupProps {
    data?: DatabaseBackupData[];
    isLoading: boolean;
    meta: TMetaConfig;
    summary: DatabaseBackupSummary;
}

const formatNumber = (value: number | string) => {
    return Number(value || 0).toLocaleString("bn-BD");
};

const formatFileSize = (bytes: number | string) => {
    const size = Number(bytes || 0);

    if (size === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];

    const index = Math.min(
        Math.floor(Math.log(size) / Math.log(1024)),
        units.length - 1,
    );

    const value = size / Math.pow(1024, index);

    return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("bn-BD", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
};

const DatabaseBackup = ({
    data = [],
    isLoading,
    meta,
    summary,
}: DatabaseBackupProps) => {
    const [
        createDatabaseBackup,
        { isLoading: isCreatingBackup },
    ] = useCreateDatabaseBackupMutation();

    const [
        deleteDatabaseBackup,
        { isLoading: isDeleting },
    ] = useDeleteDatabaseBackupMutation();

    const totalBackup = summary?.totalBackup ?? 0;
    const totalSize = summary?.totalFileSize ?? "0";
    const totalTables = summary?.totalTableCount ?? 0;
    const totalRows = summary?.totalRowCount ?? "0";

    const handleCreateBackup = async () => {
        try {
            const result = await createDatabaseBackup(undefined).unwrap();

            if (result?.success) {
                showToast({
                    type: "success",
                    title: "ডেটাবেজ ব্যাকআপ সফলভাবে তৈরি হয়েছে",
                });
            }
        } catch (error: any) {
            showToast({
                type: "error",
                title:
                    error?.data?.message ||
                    "ডেটাবেজ ব্যাকআপ তৈরি করা যায়নি",
            });
        }
    };

    const handleDownload = (fileName: string) => {
        if (!fileName) return;

        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/database/${fileName}`;

        FileSaver.saveAs(url, fileName);
    };

    const handleDelete = async (backup: DatabaseBackupData) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            await deleteDatabaseBackup(backup.id).unwrap();

            await Swal.fire({
                title: "ডিলেট হয়েছে!",
                text: "ব্যাকআপটি সফলভাবে ডিলেট করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "ব্যাকআপটি ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-14 animate-pulse rounded-xl bg-gray-100" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-[105px] animate-pulse rounded-xl border border-gray-200 bg-white"
                        />
                    ))}
                </div>

                <div className="h-[400px] animate-pulse rounded-xl border border-gray-200 bg-white" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10 text-[#039A63]">
                        <FiDatabase size={20} />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-gray-800">
                            ডেটাবেজ ব্যাকআপ
                        </h2>

                        <p className="mt-0.5 text-[11px] text-gray-400">
                            আপনার ডেটাবেজের নিরাপদ ব্যাকআপ তৈরি ও পরিচালনা করুন
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreateBackup}
                    disabled={isCreatingBackup}
                    className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[#039A63] px-4 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#027f52] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isCreatingBackup ? (
                        <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ব্যাকআপ নেওয়া হচ্ছে...
                        </>
                    ) : (
                        <>
                            <FiPlus size={15} />
                            ব্যাকআপ নিন
                        </>
                    )}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total Backup */}
                <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500">
                                মোট ব্যাকআপ
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-gray-800">
                                {formatNumber(totalBackup)}
                            </h3>

                            <p className="mt-1 text-[11px] text-gray-400">
                                সংরক্ষিত ব্যাকআপ
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63] transition-all group-hover:bg-[#039A63] group-hover:text-white">
                            <FiArchive size={21} />
                        </div>
                    </div>
                </div>

                {/* Total Storage */}
                <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500">
                                মোট স্টোরেজ
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-gray-800">
                                {formatFileSize(totalSize)}
                            </h3>

                            <p className="mt-1 text-[11px] text-gray-400">
                                ব্যাকআপ ফাইলের মোট সাইজ
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                            <FiHardDrive size={21} />
                        </div>
                    </div>
                </div>

                {/* Total Tables */}
                <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500">
                                মোট টেবিল
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-gray-800">
                                {formatNumber(totalTables)}
                            </h3>

                            <p className="mt-1 text-[11px] text-gray-400">
                                সব ব্যাকআপ মিলিয়ে
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-all group-hover:bg-purple-600 group-hover:text-white">
                            <FiLayers size={21} />
                        </div>
                    </div>
                </div>

                {/* Total Records */}
                <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500">
                                মোট রেকর্ড
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-gray-800">
                                {formatNumber(totalRows)}
                            </h3>

                            <p className="mt-1 text-[11px] text-gray-400">
                                সব টেবিলের মোট ডেটা
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-all group-hover:bg-orange-600 group-hover:text-white">
                            <FiUsers size={21} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Backup History */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#039A63]/10 text-[#039A63]">
                            <FiDatabase size={18} />
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-gray-800">
                                ব্যাকআপ হিস্টোরি
                            </h2>

                            <p className="text-[11px] text-gray-400">
                                তারিখ অনুযায়ী সকল ডেটাবেজ ব্যাকআপ
                            </p>
                        </div>
                    </div>

                    <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                        {formatNumber(totalBackup)} টি ব্যাকআপ
                    </span>
                </div>

                {!data.length ? (
                    <div className="flex min-h-[280px] flex-col items-center justify-center px-4 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <FiDatabase size={25} />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-700">
                            কোনো ব্যাকআপ পাওয়া যায়নি
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                            উপরের “ব্যাকআপ নিন” বাটনে ক্লিক করে প্রথম ব্যাকআপ
                            তৈরি করুন।
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/80">
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500">
                                            #
                                        </th>

                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500">
                                            ব্যাকআপ ফাইল
                                        </th>

                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500">
                                            তারিখ ও সময়
                                        </th>

                                        <th className="px-5 py-3 text-center text-[11px] font-bold text-gray-500">
                                            টেবিল
                                        </th>

                                        <th className="px-5 py-3 text-center text-[11px] font-bold text-gray-500">
                                            রেকর্ড
                                        </th>

                                        <th className="px-5 py-3 text-center text-[11px] font-bold text-gray-500">
                                            সাইজ
                                        </th>

                                        <th className="px-5 py-3 text-right text-[11px] font-bold text-gray-500">
                                            অ্যাকশন
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((backup, index) => {
                                        const serial =
                                            ((meta?.page ?? 1) - 1) *
                                            (meta?.limit ?? data.length) +
                                            index +
                                            1;

                                        return (
                                            <tr
                                                key={backup.id}
                                                className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-[11px] font-bold text-gray-500">
                                                        {formatNumber(serial)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10 text-[#039A63]">
                                                            <FiFileText size={17} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="max-w-[300px] truncate text-xs font-semibold text-gray-700">
                                                                {backup.fileName}
                                                            </p>

                                                            <p className="mt-0.5 text-[10px] text-gray-400">
                                                                SQL Database
                                                                Backup
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar
                                                            size={13}
                                                            className="text-blue-500"
                                                        />

                                                        <span className="text-xs font-semibold text-gray-700">
                                                            {formatDate(
                                                                backup.createdAt,
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-600">
                                                        {formatNumber(
                                                            backup.tableCount,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-600">
                                                        {formatNumber(
                                                            backup.totalRowCount,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="text-xs font-semibold text-gray-600">
                                                        {formatFileSize(
                                                            backup.fileSize,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    backup.fileName,
                                                                )
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                                            title="Download"
                                                        >
                                                            <FiDownload
                                                                size={14}
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    backup,
                                                                )
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2
                                                                size={14}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            page={meta?.page ?? 1}
                            totalPages={meta?.totalPages ?? 1}
                            dataLength={data.length}
                            title="ব্যাকআপ"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default DatabaseBackup;