import { baseApi } from "../baseApi";

const subscriptionPaymentApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({

        // CREATE SUBSCRIPTION PAYMENT
        createSubscriptionPayment: builder.mutation({
            query: (payload) => ({
                url: "/subscription-payment/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["SOFTWARE_PAYMENT"],
        }),

        // GET ALL SEASONS
        getVatasSubscriptionPaymentHistory: builder.query({
            query: () => ({
                url: "/subscription-payment/history",
                method: "GET",
            }),
            providesTags: ["SOFTWARE_PAYMENT"],
        }),

        // ADMIN 

        // GET PENDING PAYMENTS
        getPendingPaymentAdmin: builder.query({
            query: () => ({
                url: "/subscription-payment/pending",
                method: "GET",
            }),
            providesTags: ["SOFTWARE_PAYMENT"],
        }),


        // GET OTHER PAYMENTS
        getOtherPaymentHistoryAdmin: builder.query({
            query: () => ({
                url: "/subscription-payment/other",
                method: "GET",
            }),
            providesTags: ["SOFTWARE_PAYMENT"],
        }),



        // CREATE SUBSCRIPTION PAYMENT
        updateSubscriptionPaymentStatusAdmin: builder.mutation({
            query: (payload) => ({
                url: `/subscription-payment/update-status/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["SOFTWARE_PAYMENT"],
        }),

    }),
});

export const {
    useCreateSubscriptionPaymentMutation,
    useGetVatasSubscriptionPaymentHistoryQuery,
    useGetPendingPaymentAdminQuery,
    useUpdateSubscriptionPaymentStatusAdminMutation,
    useGetOtherPaymentHistoryAdminQuery
} = subscriptionPaymentApi;