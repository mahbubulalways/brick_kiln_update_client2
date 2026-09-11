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
      providesTags: ["VATA_SMS_SITTINGS"],
    }),
  }),
});

export const { useGetAllSendSmsQuery } = sendSmsAPi;
