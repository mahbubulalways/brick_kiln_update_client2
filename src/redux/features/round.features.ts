import { baseApi } from "../baseApi";

type TGetAllLoadQuery = {
    page?: number;
    limit?: number;
    search?: string;
    date?: string;
};

const roundApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        getAllRound: builder.query({
            query: () => ({
                url: "/round/all",

            }),
            providesTags: ["ROUND","LOAD_INFO"],
        }),
    }),
});

export const {
    useGetAllRoundQuery
} = roundApi;