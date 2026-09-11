import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const goodStockApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL 
        getAllGoodsStock: builder.query({
            query: () => ({
                url: `/goods/all`,
                method: "GET",
            }),
            providesTags: ["GOODS", "GOOD_ISSUE_REFUND", "GOOD_ISSUE"],
        }),

        // GET SINGLE GOOD 
        getSingleGoodsStock: builder.query({
            query: (id: string) => ({
                url: `/goods/single/${id}`,
                method: "GET",
            }),
            providesTags: ["GOODS"],
        }),

        // GET SINGLE GOOD 
        getSingleGoodsStockInfoForUpdate: builder.query({
            query: (id: string) => ({
                url: `/goods/single-info/${id}`,
                method: "GET",
            }),
            providesTags: ["GOODS"],
        }),

        // CREATE 
        createNewGoodStock: builder.mutation({
            query: (payload) => ({
                url: "/goods/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["GOODS"],
        }),

        // OPTIONS
        getGoodsStockOptions: builder.query({
            query: () => ({
                url: `/goods/options`,
                method: "GET",
            }),
            providesTags: ["GOODS"],
        }),

        // GET DEMAGE GOOD
        getDemageGoodsStock: builder.query({
            query: () => ({
                url: `/goods/demage`,
                method: "GET",
            }),
            providesTags: ["GOODS"],
        }),

        // GET DEMAGE GOOD
        getLostGoodsStock: builder.query({
            query: () => ({
                url: `/goods/lost`,
                method: "GET",
            }),
            providesTags: ["GOODS"],
        }),


        // GET GOOD LOSSS
        getSingleGoodsLoss: builder.query({
            query: (id: string) => ({
                url: `/goods/loss/${id}`,
                method: "GET",
            }),
            providesTags: ["GOODS"],
        }),

        // GET GOOD LOSSS
        updateGoodsLoss: builder.mutation({
            query: (payload) => ({
                url: `/goods/loss/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["GOODS"],
        }),

        // GET GOOD STOCK
        updateGoodsStock: builder.mutation({
            query: (payload) => ({
                url: `/goods/update-good/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["GOODS"],
        }),

        // DELETE GOOD
        deleteGoodStock: builder.mutation({
            query: (id: string) => ({
                url: `/goods/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["GOODS"],
        }),
    }),
});

export const {
    useCreateNewGoodStockMutation,
    useGetAllGoodsStockQuery,
    useGetGoodsStockOptionsQuery,
    useGetDemageGoodsStockQuery,
    useGetLostGoodsStockQuery,
    useGetSingleGoodsLossQuery,
    useUpdateGoodsLossMutation,
    useDeleteGoodStockMutation,
    useGetSingleGoodsStockQuery,
    useGetSingleGoodsStockInfoForUpdateQuery,
    useUpdateGoodsStockMutation
} = goodStockApi;