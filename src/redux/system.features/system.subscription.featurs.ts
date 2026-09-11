import { baseApi } from "../baseApi";

const systemSubscriptionApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // CREATE SUBSCRIPTION
        createSubscription: builder.mutation({
            query: (payload) => ({
                url: "/system/subscription/create",
                method: "POST",
                body: payload,
            }),
        }),

        // GET ALL SUBSCRIPTION
        getAllSubscription: builder.query({
            query: () => ({
                url: "/system/subscription/all",
            }),
        }),

        // GET  SUBSCRIPTION OPTIONS
        getSubscriptionOptions: builder.query({
            query: () => ({
                url: "/system/subscription/options",
            }),
        }),

        // GET SINGLE SUBSCRIPTION 
        getSingleSubscription: builder.query({
            query: (id) => ({
                url: `/system/subscription/single/${id}`,
            }),
        }),

        // GET VATA'S RUNNING SUBSCRIPTION 
        getVataRunningSubscription: builder.query({
            query: (id) => ({
                url: `/system/subscription/vata-subscription/${id}`,
            }),
        }),

        // CREATE SUBSCRIPTION
        updateSubscription: builder.mutation({
            query: (payload) => ({
                url: `/system/subscription/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
        }),
      



    }),
});

export const {
    useCreateSubscriptionMutation,
    useGetAllSubscriptionQuery,
    useGetSubscriptionOptionsQuery,
    useGetSingleSubscriptionQuery,
    useUpdateSubscriptionMutation,
    useGetVataRunningSubscriptionQuery,
} = systemSubscriptionApi;