import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const loadInfoApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL LOAD INFO
        getAllLoadInfo: builder.query({
            query: (query: TQuery) => ({
                url: "/load-info/all",
                method: "GET",
                params: {
                    page: query.page,
                    limit: query.limit,
                    search: query.search,
                    date: query.date,
                },
            }),
            providesTags: ["LOAD_INFO", "SEASON"],
        }),

        // GET SINGLE LOAD INFO
        getSingleLoadInfo: builder.query({
            query: (id) => ({
                url: `/load-info/single/${id}`,
                method: "GET",
            }),
            providesTags: ["LOAD_INFO"],
        }),

        // CREATE LOAD INFO
        createLoadInfo: builder.mutation({
            query: (payload) => ({
                url: "/load-info/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["LOAD_INFO", "ROUND"],
        }),

        // UPDATE LOAD INFO
        updateLoadInfo: builder.mutation({
            query: (payload) => ({
                url: `/load-info/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["LOAD_INFO"],
        }),

        // DELETE LOAD INFO
        deleteLoadInfo: builder.mutation({
            query: (id) => ({
                url: `/load-info/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LOAD_INFO"],
        }),
    }),
});

export const {
    useGetAllLoadInfoQuery,
    useGetSingleLoadInfoQuery,
    useCreateLoadInfoMutation,
    useUpdateLoadInfoMutation,
    useDeleteLoadInfoMutation,
} = loadInfoApi;