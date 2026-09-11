
import { baseApi } from "../baseApi";

const goodIssueRefundApi = baseApi.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // CREATE 
        createNewGoodIssueRefund: builder.mutation({
            query: (payload) => ({
                url: "/goods-issue-refund/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["GOOD_ISSUE_REFUND"],
        }),

       

    }),
});

export const {
useCreateNewGoodIssueRefundMutation
} = goodIssueRefundApi;