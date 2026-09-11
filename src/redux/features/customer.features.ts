import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";
const roundApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: (query: TQuery) => ({
        url: `/customer/all?page=${query.page}&limit=${query.limit}&search=${query.search}`,
      }),
      providesTags: ["CUSTOMER", "SEASON"],
    }),

    // GET OLD
    getOldCustomer: builder.query({
      query: (search) => ({
        url: `/customer/old?search=${search}`,
      }),
      providesTags: ["CUSTOMER"],
    }),

    getSingleCutomerInfo: builder.query({
      query: (id: string) => ({
        url: `/customer/info/${id}`,
      }),
      // providesTags: [""],
    }),

    // GET SINGLE CUSTOMER
    getSingleCustomerInfo: builder.query({
      query: (id: string) => ({
        url: `/customer/single/${id}`,
      }),
      // providesTags: [""],
    }),

    // GET SINGLE CUSTOMER INVOICES
    getSingleCustomerInvoice: builder.query({
      query: (payload: {
        customerId: number;
        formatDate: string;
        query: TQuery;
      }) => ({
        url:
          `/customer/invoices/${payload.customerId}` +
          `?date=${payload.formatDate}` +
          `&page=${payload.query.page}` +
          `&limit=${payload.query.limit}`,
      }),
    }),

    // GET SINGLE CUSTOMER DELIVERY
    getSingleCustomerDelivery: builder.query({
      query: (payload: {
        customerId: number;
        formatDate: string;
        query: TQuery;
      }) => ({
        url:
          `/customer/deliveries/${payload?.customerId}` +
          `?date=${payload.formatDate}` +
          `&page=${payload.query?.page}` +
          `&limit=${payload.query?.limit}`,
      }),
    }),
    // GET SINGLE CUSTOMER DELIVERY
    getSingleCustomerDueCollection: builder.query({
      query: (payload: {
        customerId: number;
        formatDate: string;
        query: TQuery;
      }) => ({
        url:
          `/customer/dues/${payload?.customerId}` +
          `?date=${payload.formatDate}}` +
          `&page=${payload.query?.page}` +
          `&limit=${payload.query?.limit}`,
      }),
    }),

    // UPDATE
    updateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer/update/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["CUSTOMER"],
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetSingleCustomerInfoQuery,
  useGetSingleCustomerInvoiceQuery,
  useGetSingleCustomerDeliveryQuery,
  useGetSingleCustomerDueCollectionQuery,
  useGetSingleCutomerInfoQuery,
  useUpdateCustomerMutation,
  useLazyGetOldCustomerQuery,
} = roundApi;
