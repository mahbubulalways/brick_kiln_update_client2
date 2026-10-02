"use client";

import { useCreateBackupMutation, useGetBackupQuery } from "@/redux/features/backup.features";
import FileSaver from "file-saver";
import {
    DatabaseBackup,
    Download,
    FileJson,
    FileCode2,
    RefreshCw,
    ShieldCheck,
    Clock3,
    HardDrive,
    Table2,
    Database,
    Info,
    CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";

type BackupFile = {
    fileName: string;
    filePath: string;
    fileSize: string;
};

type BackupInfo = {
    id: string;
    vataId: string;
    vataCode: string;

    json: BackupFile;

    sql: BackupFile;

    tableCount: number;
    totalRowCount: string;

    createdAt: string;

    backupPeriod?: {
        days: number;
        startDate?: string;
        endDate?: string;
    };
};

const formatFileSize = (
    bytes: number | string,
) => {
    const size = Number(bytes);

    if (!size) {
        return "0 B";
    }

    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
    }

    if (size < 1024 * 1024 * 1024) {
        return `${(
            size /
            (1024 * 1024)
        ).toFixed(2)} MB`;
    }

    return `${(
        size /
        (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
};

const formatDate = (
    date: string,
) => {
    return new Intl.DateTimeFormat(
        "bn-BD",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(new Date(date));
};

const toBanglaNumber = (
    value: string | number,
) => {
    const banglaDigits =
        "০১২৩৪৫৬৭৮৯";

    return String(value).replace(
        /\d/g,
        (digit) =>
            banglaDigits[
            Number(digit)
            ],
    );
};

export default function VataBackupPage() {
    const {
        data: backupResponse,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetBackupQuery(
        undefined,
    );

    const [
        createBackup,
        {
            isLoading: isCreating,
            isError: isCreateError,
            error: createError,
        },
    ] = useCreateBackupMutation();

    const backup =
        backupResponse?.data as
        | BackupInfo
        | null
        | undefined;

    const loading =
        isLoading ||
        isFetching ||
        isCreating;

    const getErrorMessage = (
        errorData: any,
        defaultMessage: string,
    ) => {
        if (
            errorData?.data?.message
        ) {
            return errorData.data
                .message;
        }

        if (
            errorData?.error
        ) {
            return errorData.error;
        }

        return defaultMessage;
    };

    const handleCreateBackup =
        async () => {
            const result =
                await Swal.fire({
                    title: "নতুন ব্যাকআপ নিতে চান?",
                    text: "আগের ব্যাকআপটি প্রতিস্থাপিত হয়ে নতুন ৩০ দিনের ব্যাকআপ তৈরি হবে।",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor:
                        "#039A63",
                    cancelButtonColor:
                        "#d33",
                    confirmButtonText:
                        "হ্যাঁ, ব্যাকআপ নিন",
                    cancelButtonText:
                        "বাতিল",
                });

            if (
                !result.isConfirmed
            ) {
                return;
            }

            try {
                const response =
                    await createBackup(
                        undefined,
                    ).unwrap();

                if (
                    response?.message
                ) {
                    await Swal.fire({
                        title: "ব্যাকআপ সম্পন্ন!",
                        text:
                            response?.message ||
                            "নতুন ব্যাকআপ সফলভাবে তৈরি হয়েছে।",
                        icon: "success",
                        confirmButtonColor:
                            "#039A63",
                        confirmButtonText:
                            "ঠিক আছে",
                    });
                }

                await refetch();
            } catch (
            errorData: any
            ) {
                await Swal.fire({
                    title: "ব্যাকআপ ব্যর্থ!",
                    text: getErrorMessage(
                        errorData,
                        "ব্যাকআপ তৈরি করা যায়নি।",
                    ),
                    icon: "error",
                    confirmButtonColor:
                        "#039A63",
                    confirmButtonText:
                        "ঠিক আছে",
                });
            }
        };

    const handleDownload = (
        type: "json" | "sql",
    ) => {
        if (!backup) {
            return;
        }

        const file =
            type === "json"
                ? backup.json
                : backup.sql;

        if (!file?.fileName) {
            Swal.fire({
                title: `${type.toUpperCase()} Backup`,
                html: `
                    <div style="text-align:left">
                        <p style="margin-bottom:8px">
                            <strong>File:</strong>
                            ${file?.fileName ?? "File পাওয়া যায়নি"}
                        </p>

                        <p>
                            <strong>Size:</strong>
                            ${file
                        ? formatFileSize(
                            file.fileSize,
                        )
                        : "N/A"
                    }
                        </p>
                    </div>
                `,
                icon: "info",
                confirmButtonColor:
                    "#039A63",
                confirmButtonText:
                    "ঠিক আছে",
            });

            return;
        }

        const date = new Date(
            backup.createdAt,
        );

        const formattedDate =
            date
                .toLocaleDateString(
                    "en-US",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    },
                )
                .replace(
                    / /g,
                    "-",
                );

        const fileName =
            `Backup_${formattedDate}_${file.fileName}`;

        const url =
            `${process.env.NEXT_PUBLIC_BACKEND_API}` +
            `/uploads/vata_backupfile/` +
            `${backup.vataCode}/` +
            `${file.fileName}`;

        FileSaver.saveAs(
            url,
            fileName,
        );
    };

    const backupFiles = backup
        ? [
            {
                type: "json" as const,
                title: "JSON Backup",
                label: "JSON",
                file: backup.json,
                icon: FileJson,
                iconBg:
                    "bg-orange-50",
                iconColor:
                    "text-orange-500",
                badgeBg:
                    "bg-orange-50",
                badgeColor:
                    "text-orange-600",
            },
            {
                type: "sql" as const,
                title: "SQL Backup",
                label: "SQL",
                file: backup.sql,
                icon: FileCode2,
                iconBg:
                    "bg-blue-50",
                iconColor:
                    "text-blue-500",
                badgeBg:
                    "bg-blue-50",
                badgeColor:
                    "text-blue-600",
            },
        ]
        : [];

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw
                        size={32}
                        className="animate-spin text-[#039A63]"
                    />

                    <p className="text-sm font-medium text-gray-600">
                        ব্যাকআপ তথ্য লোড হচ্ছে...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#039A63]/10">
                            <DatabaseBackup
                                size={25}
                                className="text-[#039A63]"
                            />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
                                ডাটাবেজ ব্যাকআপ
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                আপনার ভাটার গুরুত্বপূর্ণ তথ্য নিরাপদে সংরক্ষণ করুন
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleCreateBackup
                        }
                        disabled={
                            loading
                        }
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#039A63] px-5 text-sm font-semibold text-white transition hover:bg-[#028755] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={18}
                            className={
                                isCreating
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {isCreating
                            ? "ব্যাকআপ নেওয়া হচ্ছে..."
                            : "নতুন ব্যাকআপ নিন"}
                    </button>
                </div>

                {/* Information Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                <ShieldCheck
                                    size={21}
                                    className="text-[#039A63]"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    নিরাপত্তা
                                </p>

                                <p className="mt-0.5 font-bold text-gray-800">
                                    ডাটা সুরক্ষিত রাখুন
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            নিয়মিত ব্যাকআপ রাখলে গুরুত্বপূর্ণ তথ্য হারিয়ে যাওয়ার ঝুঁকি কমে যায়।
                        </p>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                <Clock3
                                    size={21}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Backup Information
                                </p>

                                <p className="mt-0.5 font-bold text-gray-800">
                                    শেষ ৩০ দিনের তথ্য
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            সর্বশেষ ৩০ দিনের তথ্য নিয়ে নতুন ব্যাকআপ তৈরি করা হয়।
                        </p>
                    </div>

                    <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                <Database
                                    size={21}
                                    className="text-purple-600"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Backup Format
                                </p>

                                <p className="mt-0.5 font-bold text-gray-800">
                                    JSON + SQL
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            একই ব্যাকআপ থেকে JSON এবং SQL দুই ধরনের ফাইল সংরক্ষণ করা হয়।
                        </p>
                    </div>

                </div>

                {/* No Backup */}
                {!backup ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                            <DatabaseBackup
                                size={28}
                                className="text-gray-400"
                            />
                        </div>

                        <h2 className="mt-4 font-bold text-gray-800">
                            কোনো ব্যাকআপ পাওয়া যায়নি
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            আপনার Vata-এর জন্য এখনো কোনো ব্যাকআপ তৈরি করা হয়নি।
                        </p>

                        {!isError && (
                            <button
                                type="button"
                                onClick={
                                    handleCreateBackup
                                }
                                disabled={
                                    isCreating
                                }
                                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#039A63] px-5 text-sm font-semibold text-white transition hover:bg-[#028755] disabled:opacity-60"
                            >
                                <DatabaseBackup
                                    size={18}
                                />

                                নতুন ব্যাকআপ নিন
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                        {/* Backup Header */}
                        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-bold text-gray-800">
                                    সর্বশেষ ব্যাকআপ
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    আপনার Vata-এর সর্বশেষ backup details
                                </p>
                            </div>

                            <div className="flex w-fit items-center gap-2 rounded-full bg-[#039A63]/10 px-3 py-1.5 text-xs font-medium text-[#039A63]">
                                <span className="h-2 w-2 rounded-full bg-[#039A63]" />
                                সফলভাবে সংরক্ষিত
                            </div>
                        </div>

                        <div className="p-5">

                            {/* Main Backup Info */}
                            <div className="rounded-2xl border border-[#039A63]/10 bg-gradient-to-r from-[#039A63]/5 to-transparent p-5">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#039A63]/10">
                                            <DatabaseBackup
                                                size={28}
                                                className="text-[#039A63]"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-gray-800">
                                                    Vata Database Backup
                                                </h3>

                                                <span className="rounded-full bg-[#039A63] px-2 py-0.5 text-[10px] font-semibold text-white">
                                                    LATEST
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Backup নেওয়া হয়েছে{" "}
                                                <span className="font-medium text-gray-700">
                                                    {formatDate(
                                                        backup.createdAt,
                                                    )}
                                                </span>
                                            </p>

                                            {backup.backupPeriod && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    শেষ{" "}
                                                    {toBanglaNumber(
                                                        backup
                                                            .backupPeriod
                                                            .days,
                                                    )}{" "}
                                                    দিনের data
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
                                        <CheckCircle2
                                            size={18}
                                            className="text-[#039A63]"
                                        />

                                        <span className="text-sm font-medium text-gray-700">
                                            Backup Ready
                                        </span>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

                                    <div className="rounded-xl bg-white p-4">
                                        <div className="flex items-center gap-2">
                                            <Table2
                                                size={17}
                                                className="text-gray-400"
                                            />

                                            <span className="text-xs text-gray-500">
                                                মোট টেবিল
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xl font-bold text-gray-800">
                                            {toBanglaNumber(
                                                backup.tableCount,
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-white p-4">
                                        <div className="flex items-center gap-2">
                                            <Database
                                                size={17}
                                                className="text-gray-400"
                                            />

                                            <span className="text-xs text-gray-500">
                                                মোট রেকর্ড
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xl font-bold text-gray-800">
                                            {toBanglaNumber(
                                                backup.totalRowCount,
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-white p-4">
                                        <div className="flex items-center gap-2">
                                            <FileJson
                                                size={17}
                                                className="text-gray-400"
                                            />

                                            <span className="text-xs text-gray-500">
                                                JSON Size
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xl font-bold text-gray-800">
                                            {formatFileSize(
                                                backup
                                                    .json
                                                    .fileSize,
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-white p-4">
                                        <div className="flex items-center gap-2">
                                            <FileCode2
                                                size={17}
                                                className="text-gray-400"
                                            />

                                            <span className="text-xs text-gray-500">
                                                SQL Size
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xl font-bold text-gray-800">
                                            {formatFileSize(
                                                backup
                                                    .sql
                                                    .fileSize,
                                            )}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Backup Files */}
                            <div className="mt-6">
                                <div className="mb-3">
                                    <h3 className="text-sm font-bold text-gray-800">
                                        Backup Files
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        প্রয়োজন অনুযায়ী যেকোনো ফাইল ডাউনলোড করুন
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    {backupFiles.map(
                                        (item) => {
                                            const Icon =
                                                item.icon;

                                            return (
                                                <div
                                                    key={
                                                        item.type
                                                    }
                                                    className="group flex items-center justify-between rounded-2xl border border-gray-200 p-4 transition hover:border-[#039A63]/30 hover:bg-gray-50"
                                                >
                                                    <div className="flex min-w-0 items-center gap-4">

                                                        <div
                                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                                                        >
                                                            <Icon
                                                                size={
                                                                    25
                                                                }
                                                                className={
                                                                    item.iconColor
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-gray-800">
                                                                    {
                                                                        item.title
                                                                    }
                                                                </p>

                                                                <span
                                                                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${item.badgeBg} ${item.badgeColor}`}
                                                                >
                                                                    {
                                                                        item.label
                                                                    }
                                                                </span>
                                                            </div>

                                                            <p className="mt-1 truncate text-xs text-gray-500">
                                                                {
                                                                    item
                                                                        .file
                                                                        .fileName
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs font-medium text-gray-400">
                                                                {formatFileSize(
                                                                    item
                                                                        .file
                                                                        .fileSize,
                                                                )}
                                                            </p>

                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDownload(
                                                                item.type,
                                                            )
                                                        }
                                                        className="ml-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63] transition hover:bg-[#039A63] hover:text-white"
                                                        title={`${item.label} Download`}
                                                    >
                                                        <Download
                                                            size={
                                                                19
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            );
                                        },
                                    )}

                                </div>
                            </div>

                            {/* Warning */}
                            <div className="mt-5 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                                <Info
                                    size={19}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />

                                <div>
                                    <p className="text-xs font-semibold text-amber-800">
                                        গুরুত্বপূর্ণ তথ্য
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-700">
                                        নতুন ব্যাকআপ তৈরি করলে এই Vata-এর আগের ব্যাকআপটি প্রতিস্থাপিত হবে। নতুন ব্যাকআপে সর্বশেষ ৩০ দিনের তথ্য থাকবে।
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Storage Info */}
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#039A63]/10">
                        <HardDrive
                            size={20}
                            className="text-[#039A63]"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            Backup Storage
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            সর্বশেষ Vata backup JSON এবং SQL দুই ফরম্যাটে নিরাপদভাবে সংরক্ষণ করা হয়।
                        </p>
                    </div>
                </div>

                {isCreateError && (
                    <div className="hidden">
                        {String(
                            createError,
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}