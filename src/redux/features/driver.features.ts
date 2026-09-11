import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const driverApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // CREATE DRIVER
        createDriver: builder.mutation({
            query: (payload) => ({
                url: "/driver/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["DRIVER"],
        }),

        // GET ALL DRIVER
        getAllDrivers: builder.query({
            query: (payload: TQuery) => ({
                url: `/driver/all?page=${payload.page}&limit=${payload.limit}`,
                method: "GET",
            }),
            providesTags: ["DRIVER"],
        }),

        // GET DRIVER OPTINS
        getDriverOptions: builder.query({
            query: () => ({
                url: `/driver/options`,
                method: "GET",
            }),
            providesTags: ["DRIVER"],
        }),

        // GET SINGLE DRIVER
        getSingleDriver: builder.query({
            query: (id: string) => ({
                url: `/driver/single/${id}`,
                method: "GET",
            }),
            providesTags: ["DRIVER"],
        }),

        // UPDATE DRIVER
        updateDriver: builder.mutation({
            query: (payload) => ({
                url: `/driver/update/${payload.id}`,
                method: "PATCH",
                body: payload.payload,
            }),
            invalidatesTags: ["DRIVER"],
        }),

        // DELETE DRIVER
        deleteDriver: builder.mutation({
            query: (id: string) => ({
                url: `/driver/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DRIVER"],
        }),
    }),
});

export const {
    useCreateDriverMutation,
    useGetAllDriversQuery,
    useGetSingleDriverQuery,
    useUpdateDriverMutation,
    useDeleteDriverMutation,
    useGetDriverOptionsQuery
} = driverApi;