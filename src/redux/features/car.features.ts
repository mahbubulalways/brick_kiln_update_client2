import { baseApi } from "../baseApi";

const carApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET ALL CAR 
        getAllCar: builder.query({
            query: () => ({
                url: "/car/all",
            }),
            providesTags: ["CAR"],
        }),

        // CREATE CAR 
        createNewCar: builder.mutation({
            query: (payload) => ({
                url: "/car/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["CAR"],
        }),

        // GET SINGLE CAR INCOME
        getSingleCarIncome: builder.query({
            query: (id: string) => ({
                url: `/car/single/income/${id}`,
            }),
            providesTags: ["CAR"],
        }),


    }),
});

export const {
    useGetAllCarQuery,
    useCreateNewCarMutation,
    useGetSingleCarIncomeQuery
} = carApi;