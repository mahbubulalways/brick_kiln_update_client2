import { baseApi } from "../baseApi";

const carRentApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL CAR RENT
        getAllCarRent: builder.query({
            query: (query) => ({
                url: "/car-rent/all",
                params: {
                    page: query?.page,
                    limit: query?.limit,
                    search: query?.search,
                },
            }),
            providesTags: ["CAR_RENT"],
        }),

        // GET SINGLE CAR RENT
        getSingleCarRent: builder.query({
            query: (id) => ({
                url: `/car-rent/single/${id}`,
                method: "GET",
            }),
            providesTags: ["CAR_RENT"],
        }),

        // CREATE CAR RENT
        createCarRent: builder.mutation({
            query: (payload) => ({
                url: "/car-rent/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["CAR_RENT"],
        }),

        // UPDATE CAR RENT
        updateCarRent: builder.mutation({
            query: (payload) => ({
                url: `/car-rent/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["CAR_RENT"],
        }),

        // DELETE CAR RENT
        deleteCarRent: builder.mutation({
            query: (id) => ({
                url: `/car-rent/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CAR_RENT"],
        }),
    }),
});

export const {
    useGetAllCarRentQuery,
    useGetSingleCarRentQuery,
    useCreateCarRentMutation,
    useUpdateCarRentMutation,
    useDeleteCarRentMutation,
} = carRentApi;