import { baseApi } from "../baseApi";

const FaqApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET FAQ
    getFaq: builder.query({
      query: () => ({
        url: "/system/faq/all",
        method: "GET",
      }),
      providesTags: ["FAQ"],
    }),

    // CREATE FAQ
    createFaqApi: builder.mutation({
      query: (payload) => ({
        url: "/system/faq/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // UPDATE FAQ
    updateFaqApi: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/system/faq/update/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetFaqQuery,
  useCreateFaqApiMutation,
  useUpdateFaqApiMutation,
} = FaqApi;
