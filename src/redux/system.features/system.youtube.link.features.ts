import { baseApi } from "../baseApi";

const youtubeLinkApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET ALL YOUTUBE LINKS
    getAllYoutubeLinksApi: builder.query({
      query: () => ({
        url: "/system/youtube-link/all",
        method: "GET",
      }),
      providesTags: ["YOUTUBE_LINK"],
    }),

    // CREATE YOUTUBE LINK
    createYoutubeLinkApi: builder.mutation({
      query: (payload) => ({
        url: "/system/youtube-link/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["YOUTUBE_LINK"],
    }),

    // DELETE YOUTUBE LINK
    deleteYoutubeLinkApi: builder.mutation({
      query: (id) => ({
        url: `/system/youtube-link/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["YOUTUBE_LINK"],
    }),
  }),
});

export const {
  useGetAllYoutubeLinksApiQuery,
  useCreateYoutubeLinkApiMutation,
  useDeleteYoutubeLinkApiMutation,
} = youtubeLinkApi;
