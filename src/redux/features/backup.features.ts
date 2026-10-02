import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const backupApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    getBackup: builder.query({
      query: () => ({
        url: "/backup",
        method: "GET",
      }),
      providesTags: ["BACKUP"],
    }),

    // CREATE UNLOAD INFO
    createBackup: builder.mutation({
      query: () => ({
        url: `/backup/create`,
        method: "POST",
      }),
      invalidatesTags: ["BACKUP"],
    }),
  }),
});

export const { useCreateBackupMutation, useGetBackupQuery } = backupApi;
