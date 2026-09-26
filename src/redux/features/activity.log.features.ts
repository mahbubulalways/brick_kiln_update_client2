import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const activityLogApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    getAllActivityLog: builder.query({
      query: (query: TQuery) => ({
        url: "/activity/all",
        method: "GET",
        params: {
          page: query.page,
          limit: query.limit,
        },
      }),
      providesTags: ["ACTIVITY_LOG"],
    }),
  }),
});

export const { useGetAllActivityLogQuery } = activityLogApi;
