import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const dueMateApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL RECEIVABLE & PAYABLE
        getAllDueMate: builder.query({
            query: (query: TQuery) => ({
                url: `/due-mate/all?page=${query.page}&limit=${query.limit}`,
                method: "GET",
            }),
            providesTags: ["DUE_MATE"],
        }),

        // GET SINGLE DUE
        getSingleDueMate: builder.query({
            query: (id) => ({
                url: `/due-mate/single/${id}`,
                method: "GET",
            }),
            providesTags: ["DUE_MATE"],
        }),

        // GET DUE OPTIONS
        getDueOptions: builder.query({
            query: () => ({
                url: "/receivable-payable/options",
                method: "GET",
            }),
        }),

        // CREATE RECEIVABLE / PAYABLE
        createDue: builder.mutation({
            query: (payload) => ({
                url: "/due-mate/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["DUE_MATE"],
        }),

        // UPDATE DUE
        updateDue: builder.mutation({
            query: (payload) => ({
                url: `/receivable-payable/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["DUE_MATE"],
        }),

        // DELETE DUE
        deleteDue: builder.mutation({
            query: (id) => ({
                url: `/receivable-payable/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DUE_MATE"],
        }),

        // GET CURRENT AMOUNT
        getCurrentAmount: builder.query({
            query: (id) => ({
                url: `/due-mate/amount/${id}`,
                method: "GET",
            }),
            providesTags: ["DUE_MATE"],
        }),

        // CREATE TRANSATION
                // CREATE RECEIVABLE / PAYABLE
        createTransaction: builder.mutation({
            query: (payload) => ({
                url: `/due-mate/transaction/${payload.id}`,
                method: "POST",
                body: payload.data,
            }),
            invalidatesTags: ["DUE_MATE"],
        }),

    }),
});

export const {
    useGetAllDueMateQuery,
    useGetSingleDueMateQuery,
    useGetDueOptionsQuery,
    useCreateDueMutation,
    useUpdateDueMutation,
    useDeleteDueMutation,
    useGetCurrentAmountQuery,
    useCreateTransactionMutation
} = dueMateApi;



//   // TAKEN
//         getAllTakenDue: builder.query({
//             query: (query: TQuery) => ({
//                 url: `/receivable-payable/all?page=${query.page}&limit=${query.limit}`,
//                 method: "GET",
//             }),
//             providesTags: ["DUE_MATE"],
//         }),
