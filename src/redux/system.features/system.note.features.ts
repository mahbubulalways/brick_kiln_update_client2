import { baseApi } from "../baseApi";

const NoteApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET SMS RATE
    getNote: builder.query({
      query: () => ({
        url: "/note",
        method: "GET",
      }),
      providesTags: ["NOTE"],
    }),

    // CREATE OR UPDATE SMS RATE
    createOrUpdateNoteApi: builder.mutation({
      query: (payload) => ({
        url: "/note/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["NOTE"],
    }),
  }),
});

export const { useGetNoteQuery, useCreateOrUpdateNoteApiMutation } = NoteApi;
