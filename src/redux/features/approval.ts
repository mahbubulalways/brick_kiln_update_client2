import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const approvalApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // // GET ALL
    getAllApprovalRequest: builder.query({
      query: (query: TQuery) => ({
        url: "/approval/all",
        method: "GET",
        params: {
          page: query.page,
          limit: query.limit,
        },
      }),
      providesTags: ["UNLOAD", "SEASON"],
    }),

    // GET REPORT
    getAllUnloadReport: builder.query({
      query: () => ({
        url: "/unload/report",
        method: "GET",
      }),
      providesTags: ["UNLOAD", "SEASON"],
    }),

    // CREATE UNLOAD INFO
    createUnloadInfo: builder.mutation({
      query: (payload) => ({
        url: "/unload/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UNLOAD", "STOCK_BOOK"],
    }),

    // DELETE LOAD INFO
    deleteUnloadInfo: builder.mutation({
      query: (id) => ({
        url: `/unload/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UNLOAD"],
    }),
  }),
});

export const { useGetAllApprovalRequestQuery } = approvalApi;
