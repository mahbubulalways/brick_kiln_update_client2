import { baseApi } from "../baseApi";

const smsRateApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET SMS RATE
        getSmsRate: builder.query({
            query: () => ({
                url: "/system/sms",
                method: "GET",
            }),
            providesTags: ["SMS_RATE"],
        }),

        // CREATE OR UPDATE SMS RATE
        createOrUpdateSmsRateApi: builder.mutation({
            query: (payload) => ({
                url: "/system/sms/update",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["SMS_RATE"],
        }),
    }),
});

export const {
    useGetSmsRateQuery,
    useCreateOrUpdateSmsRateApiMutation,
} = smsRateApi;