import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const smsApi = baseApi.injectEndpoints({
  overrideExisting: true,

  //   GET SMS PURCHASE HISTORY
  endpoints: (builder) => ({
    getSmsPurchaseHistory: builder.query({
      query: (query: TQuery) => ({
        url: `/sms/purchase-history?page=${query.page}&limit=${query.limit}`,
        method: "GET",
      }),
      providesTags: ["SMS"],
    }),

    // GET MY VATAR SMS
    getMyVataSmsInfo: builder.query({
      query: () => ({
        url: "/sms/vata",
        method: "GET",
      }),
      providesTags: ["SMS"],
    }),

    // PURCHASE SMS
    purchaseSms: builder.mutation({
      query: (payload) => ({
        url: "/sms/purchase",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SMS"],
    }),

    // ADMIN ACTIONS
    getSmsPurchaseRequest: builder.query({
      query: (query: TQuery) => ({
        url: `/sms/admin/purchase-request?page=${query.page}&limit=${query.limit}`,
        method: "GET",
      }),
      providesTags: ["SMS"],
    }),

    // ADMIN ACTIONS
    getSmsPurchasePaymentHistory: builder.query({
      query: (query: TQuery) => ({
        url: `/sms/admin/payment-history?page=${query.page}&limit=${query.limit}`,
        method: "GET",
      }),
      providesTags: ["SMS"],
    }),

    updateSmsPurchaseStatus: builder.mutation({
      query: (payload) => ({
        url: `/sms/admin/update-status/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["SMS"],
    }),
  }),
});

export const {
  useGetSmsPurchaseHistoryQuery,
  useGetMyVataSmsInfoQuery,
  usePurchaseSmsMutation,
  useGetSmsPurchaseRequestQuery,
  useGetSmsPurchasePaymentHistoryQuery,
  useUpdateSmsPurchaseStatusMutation,
} = smsApi;
