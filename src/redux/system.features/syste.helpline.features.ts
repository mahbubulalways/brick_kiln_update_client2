import { baseApi } from "../baseApi";

const helpLine = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET ALL YOUTUBE LINKS
    getHelpLine: builder.query({
      query: () => ({
        url: "/system/helpline",
        method: "GET",
      }),
      providesTags: ["HELP_LINE"],
    }),

    // CREATE YOUTUBE LINK
    createOrUpdateHelpLine: builder.mutation({
      query: (payload) => ({
        url: "/system/helpline/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["HELP_LINE"],
    }),
  }),
});

export const { useCreateOrUpdateHelpLineMutation, useGetHelpLineQuery } =
  helpLine;
