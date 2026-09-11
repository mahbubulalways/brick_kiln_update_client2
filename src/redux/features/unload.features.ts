import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const unloadApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // // GET ALL LOAD INFO
        getAllUnloadInfo: builder.query({
            query: (query: TQuery) => ({
                url: "/unload/all",
                method: "GET",
                params: {
                    page: query.page,
                    limit: query.limit,
                    search: query.search,
                    date: query.date,
                },
            }),
            providesTags: ["UNLOAD", "SEASON"],
        }),

        // GET REPORT
        getAllUnloadReport: builder.query({
            query: () => ({
                url: "/unload/report",
                method: "GET",
            }),
            providesTags: ["UNLOAD", "SEASON"],
        }),

        // GET SINGLE LOAD INFO
        // getSingleLoadInfo: builder.query({
        //     query: (id) => ({
        //         url: `/load-info/single/${id}`,
        //         method: "GET",
        //     }),
        //     providesTags: ["LOAD_INFO"],
        // }),

        // CREATE UNLOAD INFO
        createUnloadInfo: builder.mutation({
            query: (payload) => ({
                url: "/unload/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["UNLOAD"],
        }),

        // DELETE LOAD INFO
        deleteUnloadInfo: builder.mutation({
            query: (id) => ({
                url: `/unload/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["UNLOAD"],
        }),
    }),
});

export const {
    useCreateUnloadInfoMutation,
    useGetAllUnloadInfoQuery,
    useDeleteUnloadInfoMutation,
    useGetAllUnloadReportQuery
} = unloadApi;