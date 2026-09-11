import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const weatherApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET SINGLE CAR RENT
        getWeather: builder.query({
            query: () => ({
                url: `/weather/all`,
                method: "GET",
            }),
            providesTags: ["WEATHER"],
        }),

        // CREATE USER
        createWeatherApi: builder.mutation({
            query: (payload) => ({
                url: "/weather/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["WEATHER"],
        })
    }),
});

export const {
    useCreateWeatherApiMutation,
    useGetWeatherQuery
} = weatherApi;