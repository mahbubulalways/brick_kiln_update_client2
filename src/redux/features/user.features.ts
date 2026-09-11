import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // GET ALL USER
        getAllUsers: builder.query({
            query: () => ({
                url: "/user/all",
            }),
            providesTags: ["USER"],
        }),

        // GET SINGLE CAR RENT
        getSingleUser: builder.query({
            query: (id) => ({
                url: `/user/single/${id}`,
                method: "GET",
            }),
            providesTags: ["USER"],
        }),

        // OPTIONS
        getUserOptions: builder.query({
            query: () => ({
                url: `/user/options`,
                method: "GET",
            }),
        }),

        // CREATE USER
        createNewUser: builder.mutation({
            query: (payload) => ({
                url: "/user/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["USER"],
        }),

        // UPDATE CAR RENT
        updateUser: builder.mutation({
            query: (payload) => ({
                url: `/user/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["USER"],
        }),

        // DELETE CAR RENT
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["USER"],
        }),

        // GET USER LOGIN HISTORY
        getUserLoginHistory: builder.query({
            query: (query:TQuery) => ({
                url: `/user/history?page=${query.page}&limit=${query.limit}`,
            }),
        }),
    }),
});

export const {
    useCreateNewUserMutation,
    useGetAllUsersQuery,
    useGetSingleUserQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUserLoginHistoryQuery,
    useGetUserOptionsQuery
} = userApi;