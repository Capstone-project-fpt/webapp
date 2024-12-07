import { ForgotPasswordType, ResetPasswordType, SignInType } from "@/types";
import * as yub from "yup";

export const signInSchema: yub.ObjectSchema<SignInType> = yub.object({
  email: yub
    .string()
    .email("Email is invalid")
    .required("Email field is required"),
  password: yub.string().required("Password field is required"),
});

export const forgotPasswordSchema: yub.ObjectSchema<ForgotPasswordType> =
  yub.object({
    email: yub
      .string()
      .email("Email is invalid")
      .required("Email field is required"),
  });

export const resetPasswordSchema: yub.ObjectSchema<ResetPasswordType> =
  yub.object({
    password: yub
      .string()
      .required("Password field is required")
      .min(8, "Password must be at least 8 characters")
      .max(32, "password only maximum 32 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    token: yub.string(),
  });
