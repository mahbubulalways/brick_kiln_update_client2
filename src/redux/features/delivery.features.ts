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
    }),

    // GET ALL DELIVERY
    getAllDeliveryList: builder.query({
      query: (query: TQuery) => ({
        url: `/delivery/delivery-list?page=${query.page}&limit=${query.limit}&date=${query.date}&search=${query.search}`,
        method: "GET",
      }),
      providesTags: ["Delivery", "InvoiceItem", "SEASON"],
    }),

    // GET TODAY HAVE DELIVERY
    getDeliveryHaveToday: builder.query({
      query: (query: TQuery) => ({
        url: `/delivery/today-have-delivery?limit=${query.limit}&page=${query.page}&search=${query.search}&date=${query.date}`,
        method: "GET",
      }),
      providesTags: ["InvoiceItem", "SEASON", "Delivery"],
    }),

    // GET SINGLE
    getSingleDelivery: builder.query({
      query: (id) => ({
        url: `/delivery/single-delivery/${id}`,
        method: "GET",
      }),
    }),

    //  CHANGE DELIVERY STATUS
    changeDeliveryStatus: builder.mutation({
      query: (payload) => ({
        url: `/delivery/status/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["Delivery"],
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
  useChangeDeliveryStatusMutation,
} = deliveryApi;
