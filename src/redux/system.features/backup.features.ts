import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const databaseBackup = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // CREATE DATABASE BACKUP
    createDatabaseBackup: builder.mutation({
      query: () => ({
        url: "/system/database/backup",
        method: "POST",
      }),
      invalidatesTags: ["DATABASE_BACKUP"],
    }),

    // GET ALL DATABASE BACKUPS
    getAllDatabaseBackup: builder.query({
      query: (query: TQuery) => ({
        url: `/system/database/backup`,
        method: "GET",
        params: {
          page: query.page,
          limit: query.limit,
        },
      }),
      providesTags: ["DATABASE_BACKUP"],
    }),

    // GET BACKUP PERMISSION
    getDatabaseBackupPermission: builder.query({
      query: () => ({
        url: "/system/database/backup-permission",
        method: "GET",
      }),
      providesTags: ["DATABASE_BACKUP_PERMISSION"],
    }),

    // UPDATE BACKUP PERMISSION
    updateDatabaseBackupPermission: builder.mutation({
      query: (payload) => ({
        url: "/system/database/update-backup-permission",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DATABASE_BACKUP_PERMISSION"],
    }),

    // DELETE DATABASE BACKUP
    deleteDatabaseBackup: builder.mutation({
      query: (id: string) => ({
        url: `/system/database/backup/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DATABASE_BACKUP"],
    }),
  }),
});

export const {
  useCreateDatabaseBackupMutation,
  useGetAllDatabaseBackupQuery,
  useGetDatabaseBackupPermissionQuery,
  useUpdateDatabaseBackupPermissionMutation,
  useDeleteDatabaseBackupMutation,
} = databaseBackup;
