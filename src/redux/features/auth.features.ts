import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    logoutFromTheSystem: builder.mutation({
      query: (payload) => ({
        url: `/auth/logout`,
        method: "POST",
        body: payload,
      }),
    }),

    changePassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: payload,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: payload,
      }),
    }),

    resendCode: builder.mutation({
      query: (payload) => ({
        url: `/auth/resend-code`,
        method: "POST",
        body: payload,
      }),
    }),

    verifyCode: builder.mutation({
      query: (payload) => ({
        url: `/auth/verify-code`,
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLogoutFromTheSystemMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResendCodeMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = authApi;
