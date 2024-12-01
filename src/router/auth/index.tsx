import { RouteObject } from "react-router-dom";
import { SignIn, ForgotPassword, ResetPassword } from "@/pages";
import { AuthLayout } from "@/layouts";

const AuthRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
];

export default AuthRoutes;
