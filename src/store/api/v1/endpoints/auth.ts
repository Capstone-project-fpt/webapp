import { api } from "..";
import {
  ChangePasswordType,
  ForgotPasswordType,
  ResetPasswordType,
  SignInType,
} from "@/types";

const authEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body: SignInType) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body: ForgotPasswordType) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body: ResetPasswordType) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body: ChangePasswordType) => ({
        url: "/change-password",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authEndPoint;
