import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const vataSmsSettingApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET SINGLE CAR RENT
    getVataSmsSittings: builder.query({
      query: () => ({
        url: `/vata/sms-sittings`,
        method: "GET",
      }),
      providesTags: ["VATA_SMS_SITTINGS"],
    }),

    // CREATE USER
    createOrUpdateVataSmsSettings: builder.mutation({
      query: (payload) => ({
        url: "/vata/sms-sittings/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["VATA_SMS_SITTINGS"],
    }),
  }),
});

export const {
  useCreateOrUpdateVataSmsSettingsMutation,
  useGetVataSmsSittingsQuery,
} = vataSmsSettingApi;
