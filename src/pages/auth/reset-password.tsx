import { InputPassword, PageNotFoundError } from "@/components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isTokenExpired } from "@/lib/utils";
import { useTheme } from "@/services/providers/theme-provider";
import { resetPasswordSchema } from "@/services/schemas";
import { useResetPasswordMutation } from "@/store/api/v1/endpoints/auth";
import { ResetPasswordType } from "@/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./components/logo";
import MobileLogo from "./components/mobile-logo";
import { toast } from "@/hooks/use-toast";

const ResetPassword: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [resetPassword, resetPasswordData] = useResetPasswordMutation();

  const initialValues: ResetPasswordType = {
    password: "",
    token: token || "",
  };

  const handleSubmit = async (values: ResetPasswordType) => {
    await resetPassword(values);
  };

  useEffect(() => {
    const isSuccess = resetPasswordData?.isSuccess;
    if (isSuccess) {
      navigate("/auth/sign-in");
    }

    if (resetPasswordData?.data) {
      toast({
        duration: 3000,
        variant: "default",
        title: "Reset Password",
        description: "Reset Password Successfully.",
      });
    }
    if (resetPasswordData?.error) {
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Reset Password",
        description:
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  }, [resetPasswordData]);

  useEffect(() => {
    if (token) {
      const isExpired = isTokenExpired(token);
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Reset Password",
        description:
          "The reset password link has expired. Please request a new one.",
      });
      if (isExpired) {
        navigate("/auth/forgot-password");
      }
    }
  }, [token, navigate]);

  if (!token) {
    return <PageNotFoundError />;
  }

  return (
    <div className=" w-screen h-screen flex flex-col lg:flex-row gap-5 lg:gap-0 justify-center items-center">
      <Logo />
      <div className=" lg:basis-1/2 dark:bg-white dark:text-dark flex flex-col justify-center lg:flex-row items-center h-screen ">
        <div className=" lg:w-7/12 w-screen px-4 lg:mt-0 lg:px-0 mx-auto ">
          <MobileLogo />
          <div className=" text-2xl mb-6 ">Reset Password</div>
          <Formik
            initialValues={initialValues}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleBlur, handleChange, isSubmitting }) => (
              <Form className=" flex flex-col gap-3 ">
                <div className="flex flex-col gap-2 ">
                  <Label htmlFor="password">New Password</Label>
                  <InputPassword
                    name="password"
                    id="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="******"
                  />
                  <ErrorMessage
                    name="password"
                    component={"div"}
                    className="text-sm text-danger"
                  />
                </div>
                <Button
                  type="submit"
                  variant={theme == "light" ? "default" : "secondary"}
                  disabled={isSubmitting}
                  className=" w-full "
                >
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reset Password
                </Button>
                <Link to="/auth/sign-in" className="text-sm">
                  <Button variant="secondary" className=" w-full ">
                    Back to Sign In
                  </Button>
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
