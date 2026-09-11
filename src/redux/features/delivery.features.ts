import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const deliveryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET ALL CLASS AND RATE
    getNextDeliveryNo: builder.query({
      query: () => ({
        url: `/delivery/next-delivery-no`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Delivery"],
    }),

    // CREATE NEW DELIVERY
    createDelivery: builder.mutation({
      query: (payload) => ({
        url: "/delivery/create-delivery",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Delivery"],
    }),

    // GET TODAYS DELIVERY
    getTodaysDelivery: builder.query({
      query: (query: TQuery) => ({
        url: `/delivery/todays-delivery?page=${query.page}&limit=${query.limit}&date=${query.date}`,
        method: "GET",
      }),
      providesTags: ["Delivery", "InvoiceItem", "SEASON"],
      keepUnusedDataFor: 0,
    }),

    // GET ALL DELIVERY
    getAllDeliveryList: builder.query({
      query: (query: TQuery) => ({
        url: `/delivery/delivery-list?page=${query.page}&limit=${query.limit}&date=${query.date}&search=${query.search}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Delivery", "InvoiceItem", "SEASON"],
    }),

    // GET TODAY HAVE DELIVERY
    getDeliveryHaveToday: builder.query({
      query: (query: TQuery) => ({
        url: `/delivery/today-have-delivery?limit=${query.limit}&page=${query.page}&search=${query.search}&date=${query.date}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["InvoiceItem", "SEASON"],
    }),

    // GET SINGLE
    getSingleDelivery: builder.query({
      query: (id) => ({
        url: `/delivery/single-delivery/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

  }),
});

export const {
  useGetTodaysDeliveryQuery,
  useGetNextDeliveryNoQuery,
  useCreateDeliveryMutation,
  useGetDeliveryHaveTodayQuery,
  useGetAllDeliveryListQuery,
  useGetSingleDeliveryQuery,
} = deliveryApi;
