import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const contactApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL CONTACT
        getAllContacts: builder.query({
            query: (query:TQuery) => ({
                url: `/contact/all?page=${query.page}&limit=${query.limit}&search=${query.search}`,
                method: "GET",
            }),
            providesTags: ["CONTACT"],
        }),

        // GET SINGLE CONTACT
        getSingleContact: builder.query({
            query: (id) => ({
                url: `/contact/single/${id}`,
                method: "GET",
            }),
            providesTags: ["CONTACT"],
        }),

        // CREATE CONTACT
        createNewContact: builder.mutation({
            query: (payload) => ({
                url: "/contact/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["CONTACT"],
        }),

        // UPDATE CONTACT
        updateContact: builder.mutation({
            query: (payload) => ({
                url: `/contact/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["CONTACT"],
        }),

        // DELETE CONTACT
        deleteContact: builder.mutation({
            query: (id) => ({
                url: `/contact/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CONTACT"],
        }),
    }),
});

export const {
    useGetAllContactsQuery,
    useGetSingleContactQuery,
    useCreateNewContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation,
} = contactApi;