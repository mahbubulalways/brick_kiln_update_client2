import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const taskApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // ==========================================
        // GET PENDING TASKS
        // ==========================================
        getPendingTasks: builder.query({
            query: (query:TQuery) => ({
                url: `/task/pending?date=${query.date}`,
                method: "GET",
            }),
            providesTags: ["TASK"],
        }),

        // ==========================================
        // GET COMPLETE TASKS
        // ==========================================
        getCompleteTasks: builder.query({
            query: (query:TQuery) => ({
                url: `/task/complete?date=${query.date}`,
                method: "GET",
            }),
            providesTags: ["TASK"],
        }),

        // ==========================================
        // GET SINGLE TASK
        // ==========================================
        getSingleTask: builder.query({
            query: (id) => ({
                url: `/task/single/${id}`,
                method: "GET",
            }),
            providesTags: ["TASK"],
        }),

        // ==========================================
        // CREATE TASK
        // ==========================================
        createTask: builder.mutation({
            query: (payload) => ({
                url: "/task/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["TASK"],
        }),

        // ==========================================
        // UPDATE TASK
        // ==========================================
        updateTask: builder.mutation({
            query: (payload) => ({
                url: `/task/update/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: ["TASK"],
        }),

        // ==========================================
        // DELETE TASK
        // ==========================================
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/task/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TASK"],
        }),
    }),
});

export const {
    useGetPendingTasksQuery,
    useGetCompleteTasksQuery,
    useGetSingleTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = taskApi;