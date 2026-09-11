import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const systemVataApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // CREATE VATA
        createNewVata: builder.mutation({
            query: (payload) => ({
                url: "/system/vata/create",
                method: "POST",
                body: payload,
            }),

        }),

        // GET ALL VATA
        getAllVata: builder.query({
            query: () => ({
                url: "/system/vata/all",
            }),
            providesTags: ["ADMIN_VATA"]
        }),

        // GET ALL VATA
        getInactiveVata: builder.query({
            query: () => ({
                url: "/system/vata/inactive",
            }),
        }),

        // GET SINGLE VATA
        getSingleVata: builder.query({
            query: (id: string) => ({
                url: `/system/vata/single/${id}`,
            }),
        }),

        // GET SINGLE VATA FOR UPDATE
        getSingleVataInfor: builder.query({
            query: (id: string) => ({
                url: `/system/vata/info/${id}`,
            }),
        }),

        // DOMAIN
        // verifySubDomain: builder.mutation({
        //     query: (payload) => ({
        //         url: "/vata/verify-domain",
        //         method: "POST",
        //         body: payload,
        //     }),
        // }),
        // DOMAIN

        // UPDATE VATA
        updateVataInformation: builder.mutation({
            query: (payload) => ({
                url: `/system/vata/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["ADMIN_VATA"]
        }),

        // UPDATE VATA SUBSCRIPTION
        updateVataSubscription: builder.mutation({
            query: (payload) => ({
                url: `/system/vata/update-vata-subscription/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["ADMIN_VATA"]
        }),

    }),
});

export const {
    useCreateNewVataMutation,
    useGetAllVataQuery,
    useGetSingleVataQuery,
    useGetInactiveVataQuery,
    useGetSingleVataInforQuery,
    useUpdateVataInformationMutation,
    useUpdateVataSubscriptionMutation
} = systemVataApi;