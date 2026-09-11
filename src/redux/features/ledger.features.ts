import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const ledgerAPi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET LEDGER COUNT
    getLedgerCount: builder.query({
      query: () => ({
        url: `/ledger/count`,
        method: "GET",
      }),
      providesTags: ["LEDGER"],
    }),

    // GET ALL LEDGER
    getAllLedger: builder.query({
      query: () => ({
        url: `/ledger/all`,
        method: "GET",
      }),
      providesTags: ["LEDGER","SEASON"],
    }),
    // GET ALL LEDGER
    getAllLedgerPagination: builder.query({
      query: (query:TQuery) => ({
        url: `/ledger/all-ledgers?page=${query.page}&limit=${query.limit}&search=${query.search}`,
        method: "GET",
      }),
      providesTags: ["LEDGER","SEASON"],
    }),

    // GET ALL LEDGER WITH AMOUNT
    // GET ALL LEDGER
    getAllLedgerWithAmount: builder.query({
      query: () => ({
        url: `/ledger/all-amount`,
        method: "GET",
      }),
      providesTags: ["LEDGER"],
    }),

    getAllLedgerDetails: builder.query({
      query: (payload) => ({
        url: `/ledger/details/${payload.id}?page=${payload?.params?.page}&limit=${payload?.params?.page}&date=${payload.date}`,
        method: "GET",
      }),
      providesTags: ["LEDGER"],
    }),


    // GET LEDGER OPTION
    getLedgerOption: builder.query({
      query: () => ({
        url: `/ledger/options`,
        method: "GET",
      }),
      providesTags: ["LEDGER"],
    }),

    // CREATE NEW LEDGER
    createLedger: builder.mutation({
      query: (payload) => ({
        url: "/ledger/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LEDGER"],
    }),

    // GET SINGLE
      getSingleLedger: builder.query({
      query: (id) => ({
        url: `/ledger/single/${id}`,
        method: "GET",
      }),
      providesTags: ["LEDGER"],
    }),
    // GET SINGLE
      updateLedger: builder.mutation({
      query: (payload) => ({
        url: `/ledger/update/${payload.id}`,
        method: "PATCH",
        body:payload.data
      }),
      invalidatesTags: ["LEDGER"],
    }),
    // GET SINGLE
      deleteleLedger: builder.mutation({
      query: (id) => ({
        url: `/ledger/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LEDGER"],
    }),

  }),
});

export const {
  useGetLedgerCountQuery,
  useCreateLedgerMutation,
  useGetLedgerOptionQuery,
  useGetAllLedgerQuery,
  useGetAllLedgerWithAmountQuery,
  useGetAllLedgerDetailsQuery,
  useGetAllLedgerPaginationQuery,
  useGetSingleLedgerQuery,
  useDeleteleLedgerMutation,
  useUpdateLedgerMutation
} = ledgerAPi;
