import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // GET ALL NOTIFICATIONS
    getAllNotifications: builder.query({
      query: ({ limit, page }: TQuery) => ({
        url: `/notification/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["NOTIFICATION"],
    }),

    // GET UNREAD NOTIFICATIONS NUMBER
    getUnreadNotificationsNumber: builder.query({
      query: () => ({
        url: "/notification/unread",
        method: "GET",
      }),
      providesTags: ["NOTIFICATION"],
    }),

    // TOGGLE NOTIFICATION READ STATUS
    updateNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/update/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["NOTIFICATION"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetUnreadNotificationsNumberQuery,
  useUpdateNotificationMutation,
} = notificationApi;
