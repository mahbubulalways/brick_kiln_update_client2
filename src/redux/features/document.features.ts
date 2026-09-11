import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const unloadApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // CREATE FOLDER
        createFolder: builder.mutation({
            query: (payload) => ({
                url: "/document/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["DOCUMENT"],
        }),

        // GET ALL DOCUMENT
        getAllDocuments: builder.query({
            query: () => ({
                url: "/document/all",
                method: "GET",
            }),
            providesTags: ["DOCUMENT"],
        }),

        // GET ALL DOCUMENT
        getSingleFolderDocuments: builder.query({
            query: (id) => ({
                url: `/document/folder/${id}`,
                method: "GET",
            }),
            providesTags: ["DOCUMENT"],
        }),

        // GET SINGLE FOLDER 
        getSingleFolderName: builder.query({
            query: (id) => ({
                url: `/document/folder-name/${id}`,
                method: "GET",
            }),
        }),

        // DELETE FILE
        deleteFile: builder.mutation({
            query: (id) => ({
                url: `/document/delete-file/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DOCUMENT"],
        }),

        // UPDATE FOLDER NAME
        updateFolderName: builder.mutation({
            query: (payload) => ({
                url: `/document/update-folder/${payload.id}`,
                method: "PATCH",
                body: payload.data,

            }),
            invalidatesTags: ["DOCUMENT"],
        }),

         deleteFolder: builder.mutation({
            query: (id) => ({
                url: `/document/delete-folder/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DOCUMENT"],
        }),


    }),
});

export const {
    useCreateFolderMutation,
    useGetAllDocumentsQuery,
    useGetSingleFolderDocumentsQuery,
    useDeleteFileMutation,
    useUpdateFolderNameMutation,
    useGetSingleFolderNameQuery,
    useDeleteFolderMutation
} = unloadApi;