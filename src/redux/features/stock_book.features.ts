import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const stockBookApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // CREATE STOCK BOOK
        createNewStockBook: builder.mutation({
            query: (payload) => ({
                url: "/stock-book/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["STOCK_BOOK"],
        }),

        getAllStocks: builder.query({
            query: (query: TQuery) => ({
                url: `/stock-book/all?page=${query.page}&limit=${query.limit}`,
                method: "GET",
            }),
            providesTags: ["STOCK_BOOK"],
        }),


        getMainStock: builder.query({
            query: () => ({
                url: `/stock-book/main`,
                method: "GET",
            }),
            providesTags: ["STOCK_BOOK"],
        }),

        deleteStock: builder.mutation({
            query: (id) => ({
                url: `/stock-book/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["STOCK_BOOK"],
        }),
    }),
});

export const {
    useCreateNewStockBookMutation,
    useGetAllStocksQuery,
    useDeleteStockMutation,
    useGetMainStockQuery
} = stockBookApi;