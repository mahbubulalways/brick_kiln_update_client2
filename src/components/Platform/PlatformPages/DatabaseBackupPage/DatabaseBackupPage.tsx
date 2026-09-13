"use client"
import { TQuery } from "@/interface/query";
import DatabaseBackupPermission from "./DatabaseBackupPermission";
import DatabaseBackup from "./DatabaseBackup";
import { useGetAllDatabaseBackupQuery, useGetDatabaseBackupPermissionQuery } from "@/redux/system.features/backup.features";

export default function DatabaseBackupPage({ limit, page }: TQuery) {
    const {
        data: backupData,
        isLoading: backupLoading,
    } = useGetAllDatabaseBackupQuery({ limit, page }, { refetchOnMountOrArgChange: true });

    const {
        data: permissionData,
        isLoading: permissionLoading,
    } = useGetDatabaseBackupPermissionQuery(undefined);
    return (
        <div className="space-y-4">
            <DatabaseBackupPermission
                data={permissionData?.data}
                isLoading={permissionLoading}
            />

            <DatabaseBackup
                data={backupData?.data?.data}
                isLoading={backupLoading}
                meta={backupData?.data?.meta}
                summary={backupData?.data?.summary}
            />
        </div>
    );
}