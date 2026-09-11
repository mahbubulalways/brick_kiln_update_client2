import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const goodIssueApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // CREATE 
        createNewGoodIssue: builder.mutation({
            query: (payload) => ({
                url: "/goods-issue/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["GOOD_ISSUE"],
        }),

        // GET ALL 
        getAllGoodIssue: builder.query({
            query: () => ({
                url: `/goods-issue/all`,
                method: "GET",
            }),
            providesTags: ["GOOD_ISSUE"],
        }),

        // GET SINGLE 
        getSingleGoodIssue: builder.query({
            query: (id: string) => ({
                url: `/goods-issue/single/${id}`,
                method: "GET",
            }),
            providesTags: ["GOOD_ISSUE"],
        }),

        // GET ISSUE HISTORY
        getGoodIssueHistory: builder.query({
            query: (query: TQuery) => ({
                url: `/goods-issue/history?limit=${query.limit}&page=${query.page}`,
                method: "GET",
            }),
            providesTags: ["GOOD_ISSUE","GOODS"],
        }),

    }),
});

export const {
    useCreateNewGoodIssueMutation,
    useGetAllGoodIssueQuery,
    useGetSingleGoodIssueQuery,
    useGetGoodIssueHistoryQuery
} = goodIssueApi;