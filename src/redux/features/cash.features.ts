import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const cashApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET ALL CASH
    getAllCash: builder.query({
      query: (query) => ({
        url: "/cash/all",
        params: {
          page: query.page,
          limit: query.limit,
          search: query.search,
          date: query.date,
        },
      }),
      providesTags: ["CASH", "SEASON"],
    }),


    // GET REPORT
    getCashReport: builder.query({
      query: (query:TQuery) => ({
        url: "/cash/report",
        params: {
          date: query.date,
        },
      }),
    }),

    // GET SINGLE CASH
    getSingleCash: builder.query({
      query: (id) => ({
        url: `/cash/single/${id}`,
        method: "GET",
      }),
      providesTags: ["CASH"],
    }),

    // CREATE NEW CASH
    createCash: builder.mutation({
      query: (payload) => ({
        url: "/cash/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CASH"],
    }),

    // UPDATE CASH
    updateCash: builder.mutation({
      query: (payload) => ({
        url: `/cash/update/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["CASH"],
    }),

    // DELETE CASH
    deleteCash: builder.mutation({
      query: (id) => ({
        url: `/cash/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CASH"],
    }),
  }),
});

export const {
  useGetAllCashQuery,
  useGetSingleCashQuery,
  useCreateCashMutation,
  useUpdateCashMutation,
  useDeleteCashMutation,
  useGetCashReportQuery
} = cashApi;