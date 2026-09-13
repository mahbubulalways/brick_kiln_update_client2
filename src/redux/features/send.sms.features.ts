import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const sendSmsAPi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET SINGLE CAR RENT
    getAllSendSms: builder.query({
      query: () => ({
        url: `/vata/send-sms/all`,
        method: "GET",
      }),
      providesTags: ["VATA_SMS_SITTINGS", "SEND_SMS"],
    }),

    sendSms: builder.mutation({
      query: (payload) => ({
        url: `/vata/send-sms/send`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SEND_SMS"],
    }),
  }),
});

export const { useGetAllSendSmsQuery, useSendSmsMutation } = sendSmsAPi;
