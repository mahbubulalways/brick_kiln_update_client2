import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const goodStockCategoryApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL 
        getAllGoodsCategory: builder.query({
            query: () => ({
                url: `/goods-category/all`,
                method: "GET",
            }),
            providesTags: ["GOODS_CATEGORY"],
        }),

        getGoodsCategoryOptions: builder.query({
            query: () => ({
                url: `/goods-category/options`,
                method: "GET",
            }),
            providesTags: ["GOODS_CATEGORY"],
        }),

        // GET SINGLE 
        getSingleGoodsCategory: builder.query({
            query: (id) => ({
                url: `/goods-category/single/${id}`,
                method: "GET",
            }),
            providesTags: ["GOODS_CATEGORY"],
        }),

        // CREATE 
        createNewGoodsCategory: builder.mutation({
            query: (payload) => ({
                url: "/goods-category/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["GOODS_CATEGORY"],
        }),

        // UPDATE 
        updateGoodsCategory: builder.mutation({
            query: (payload) => ({
                url: `/goods-category/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["GOODS_CATEGORY"],
        }),

        // DELETE 
        deleteGoodsCategory: builder.mutation({
            query: (id) => ({
                url: `/goods-category/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["GOODS_CATEGORY"],
        }),
    }),
});

export const {
 useCreateNewGoodsCategoryMutation,
 useGetAllGoodsCategoryQuery,
 useDeleteGoodsCategoryMutation,
 useGetSingleGoodsCategoryQuery,
 useUpdateGoodsCategoryMutation,
 useGetGoodsCategoryOptionsQuery
} = goodStockCategoryApi;