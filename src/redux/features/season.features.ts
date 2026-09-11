import { baseApi } from "../baseApi";

const seasonApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL SEASONS
        getAllSeasons: builder.query({
            query: () => ({
                url: "/season",
                method: "GET",
            }),
            providesTags: ["SEASON"],
        }),

        // GET ACTIVE SEASON
        getActiveSeason: builder.query({
            query: () => ({
                url: "/season/active",
                method: "GET",
            }),
            providesTags: ["SEASON"],
        }),

        changeActiveSeason: builder.mutation({
            query: (id) => ({
                url: `/season/select/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["SEASON"],
        }),
    }),
});

export const {
    useGetAllSeasonsQuery,
    useGetActiveSeasonQuery,
    useChangeActiveSeasonMutation
} = seasonApi;