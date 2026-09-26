import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const approvalApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    getAllApprovalRequest: builder.query({
      query: (query: TQuery) => ({
        url: "/approval/all",
        method: "GET",
        params: {
          page: query.page,
          limit: query.limit,
        },
      }),
      providesTags: ["APPROVAL"],
    }),

    // CREATE UNLOAD INFO
    changeApprovalStatus: builder.mutation({
      query: (payload) => ({
        url: `/approval/update-status/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["APPROVAL"],
    }),
  }),
});

export const {
  useGetAllApprovalRequestQuery,
  useChangeApprovalStatusMutation,
} = approvalApi;
