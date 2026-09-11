import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // CREATE NEW PAYMENT
    createPayment: builder.mutation({
      query: (payload) => ({
        url: "/payment/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PAYMENT"],
    }),

    // GET LEDGER COUNT
    getPayment: builder.query({
      query: (query: TQuery) => ({
        url: `/payment/all?page=${query.page}&limit=${query.limit}&search=${query.search}&date=${query.date}`,
        method: "GET",
      }),
      providesTags: ["PAYMENT", "SEASON"],
    }),

    // GET PAYMENT REPORT
    getPaymentReport: builder.query({
      query: (date: string) => ({
        url: `/payment/report/${date}`,
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),

    // GET SINGLE PAYMENT REPORT
    getSinglePaymentReport: builder.query({
      query: (id: string) => ({
        url: `/payment/single/${id}`,
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),

    // UPDATE PAYMENT
    updatePayment: builder.mutation({
      query: (payload) => ({
        url: `/payment/update/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["PAYMENT"],
    }),

    // DELETE PAYMENT (SOFT DELETE)
    deletePayment: builder.mutation({
      query: (id: string) => ({
        url: `/payment/delete/${id}`,
        method: "PATCH",

      }),
      invalidatesTags: ["PAYMENT"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentQuery,
  useGetPaymentReportQuery,
  useGetSinglePaymentReportQuery,
  useUpdatePaymentMutation, useDeletePaymentMutation
} = paymentApi;
