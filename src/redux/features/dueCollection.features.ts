import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const dueCollectionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // POST A NEW DUE
    collectionDue: builder.mutation({
      query: (payload) => ({
        url: "/due/collection",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DueCollection"],
    }),

    // GET SINGLE CUSTOMERS DUE
    getCustomerDue: builder.query({
      query: (id: string) => ({
        url: `/due/customer-due/${id}`,
        method: "GET",
      }),
      //   providesTags: ["ClassAndRate"],
    }),

    // GET TODAY HAVE DUE
    getTodayHaveDue: builder.query({
      query: (query: TQuery) => ({
        url: `/due/today-have-due?date=${query.date}&page=${query.page}&limit=${query.limit}&search=${query.search}`,
        method: "GET",
      }),
      providesTags: ['DueCollection', "SEASON"]
    }),

    // SEARCH CUSTOMER FOR DWU
    searchCustomerForDeu: builder.query({
      query: (query: TQuery) => ({
        url: `/due/search-customer?search=${query.search}`,
        method: "GET",
      }),
      providesTags: ['DueCollection']
    }),


    // GET TODAY PAID
    getTodayPaid: builder.query({
      query: (query: TQuery) => ({
        url: `/due/today-paid?date=${query.date}&page=${query.page}&limit=${query.limit}`,
        method: "GET",
      }),
      providesTags: ["DueCollection", "SEASON"],
    }),

    // GET ALL DUES
    getAllDueList: builder.query({
      query: (query: TQuery) => ({
        url: `/due/all-due?date=${query.date}&page=${query.page}&limit=${query.limit}&search=${query.search}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["DueCollection", "SEASON"]
    }),


    // GET SINGLE DUE
    getSingleDue: builder.query({
      query: (id) => ({
        url: `/due/get-single/${id}`,
        method: "GET",
      }),
    }),

    // GET SINGLE DUE DATE
    getSingleDueDate: builder.query({
      query: (id) => ({
        url: `/due/get-single-date/${id}`,
        method: "GET",
      }),
    }),

    // UPDATE DUE COLLECTION
    updateDueCollection: builder.mutation({
      query: (payload) => ({
        url: `/due/update/${payload.id}`,
        method: "PATCH",
        body: payload.payload,
      }),
      invalidatesTags: ["DueCollection"],
    }),

    // UPDATE DUE COLLECTION DATE
    updateDueCollectionDate: builder.mutation({
      query: (payload) => ({
        url: `/due/update-date/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["DueCollection", "CUSTOMER"],
    }),
  }),
});

export const {
  useCollectionDueMutation,
  useGetCustomerDueQuery,
  useGetTodayHaveDueQuery,
  useGetTodayPaidQuery,
  useGetAllDueListQuery,
  useGetSingleDueQuery,
  useUpdateDueCollectionMutation,
  useGetSingleDueDateQuery,
  useUpdateDueCollectionDateMutation,
  useSearchCustomerForDeuQuery
} = dueCollectionApi;
