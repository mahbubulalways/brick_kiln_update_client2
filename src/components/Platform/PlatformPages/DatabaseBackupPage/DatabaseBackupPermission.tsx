"use client";

import { showToast } from "@/components/Toast/CustomToast";
import { useUpdateDatabaseBackupPermissionMutation } from "@/redux/system.features/backup.features";
import { FiDatabase, FiEdit2, FiShield } from "react-icons/fi";



type BackupType = "MANUAL" | "AUTO";

interface DatabaseBackupPermissionData {
    id: string;
    type: BackupType;
}

interface DatabaseBackupPermissionProps {
    data?: DatabaseBackupPermissionData;
    isLoading: boolean;
}

const DatabaseBackupPermission = ({
    data,
    isLoading,
}: DatabaseBackupPermissionProps) => {
    const [updateBackupPermission, { isLoading: isUpdating }] =
        useUpdateDatabaseBackupPermissionMutation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-100" />

                    <div className="space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-44 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>

                <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-100" />
            </div>
        );
    }

    const backupType = data?.type || "MANUAL";

    const handleChangeBackup = async () => {
        const newBackupType: BackupType =
            backupType === "AUTO" ? "MANUAL" : "AUTO";

        try {
            const result = await updateBackupPermission({
                type: newBackupType,
            }).unwrap();

            if (result?.success) {
                showToast(
                    { type: "success", title: "ব্যাকআপ পদ্ধতি সফলভাবে পরিবর্তন হয়েছে", }
                );
            }
        } catch (error: any) {
            showToast(
                {
                    type: "error", title: error?.data?.message ||
                        "ব্যাকআপ পদ্ধতি পরিবর্তন করা যায়নি",
                }

            );
        }
    };

    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10 text-[#039A63]">
                    <FiDatabase size={19} />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                            ডেটাবেজ ব্যাকআপ
                        </p>

                        <span className="flex items-center gap-1 rounded-full bg-[#039A63]/10 px-2 py-0.5 text-[10px] font-semibold text-[#039A63]">
                            <FiShield size={11} />
                            সক্রিয়
                        </span>
                    </div>

                    <p className="mt-0.5 text-xs text-gray-500">
                        বর্তমান ব্যাকআপ পদ্ধতি:{" "}
                        <span className="font-semibold text-gray-700">
                            {backupType === "AUTO"
                                ? "স্বয়ংক্রিয়"
                                : "ম্যানুয়াল"}
                        </span>
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={handleChangeBackup}
                disabled={isUpdating}
                className="flex items-center gap-1.5 rounded-lg border border-[#039A63] px-3 py-2 text-xs font-semibold text-[#039A63] transition-all duration-200 hover:bg-[#039A63] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                <FiEdit2 size={13} />

                {isUpdating
                    ? "পরিবর্তন হচ্ছে..."
                    : "পরিবর্তন করুন"}
            </button>
        </div>
    );
};

export default DatabaseBackupPermission;