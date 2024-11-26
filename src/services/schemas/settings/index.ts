import { ChangePasswordType } from "@/types";
import * as yub from "yup";

export const ChangePasswordSchema: yub.ObjectSchema<ChangePasswordType> =
  yub.object({
    old_password: yub.string().required("Old password field is required"),
    new_password: yub
    .string()
    .required("New password field is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "password only maximum 32 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
    new_password_confirmation: yub
      .string()
      .required("New confirm password field is required")
      .oneOf([yub.ref("new_password")], "Password does not match"),
  });
