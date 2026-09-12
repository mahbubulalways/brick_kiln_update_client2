import { baseApi } from "../baseApi";

const aboutUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAboutUs: builder.mutation({
      query: (data) => ({
        url: "/system/about/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ABOUT_US"],
    }),

    getAboutUs: builder.query({
      query: () => ({
        url: "/system/about",
        method: "GET",
      }),
      providesTags: ["ABOUT_US"],
    }),
  }),
});

export const { useCreateAboutUsMutation, useGetAboutUsQuery } = aboutUsApi;
