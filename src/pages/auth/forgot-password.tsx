import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/services/providers/theme-provider";
import { forgotPasswordSchema } from "@/services/schemas";
import { useForgotPasswordMutation } from "@/store/api/v1/endpoints/auth";
import { ForgotPasswordType } from "@/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./components/logo";
import MobileLogo from "./components/mobile-logo";

const ForgotPassword: React.FC = () => {
  const { theme } = useTheme();
  const [forgotPassword, forgotPasswordData] = useForgotPasswordMutation();

  const initialValues: ForgotPasswordType = {
    email: "",
  };

  const handleSubmit = async (
    values: ForgotPasswordType,
    action: FormikHelpers<ForgotPasswordType>
  ) => {
    await forgotPassword(values);
    if (forgotPasswordData.isError) {
      action.setFieldError("email", "Not user found with this email");
    }
  };

  useEffect(() => {
    if (forgotPasswordData?.data) {
      toast({
        duration: 3000,
        variant: "default",
        title: "Forgot Password",
        description: "Forgot Password Successfully.",
      });
    }
  }, [forgotPasswordData]);

  const openEmailInbox = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className=" w-screen h-screen flex flex-col lg:flex-row gap-5 lg:gap-0 justify-center items-center">
      <Logo />
      <div className=" lg:basis-1/2 dark:bg-white dark:text-dark flex flex-col justify-center lg:flex-row items-center h-screen ">
        <div className=" lg:w-7/12 w-screen px-4 lg:mt-0 lg:px-0 mx-auto ">
          <MobileLogo />
          <div className=" text-2xl mb-6 ">Forgot Password</div>
          <div className="mb-6 text-center">
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleBlur, handleChange, isSubmitting }) => (
              <Form className=" flex flex-col gap-3 ">
                <div className=" flex flex-col gap-2 ">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                  <ErrorMessage
                    name="email"
                    component={"div"}
                    className=" text-sm text-danger "
                  />
                </div>
                {!forgotPasswordData.isSuccess ? (
                  <Button
                    type="submit"
                    variant={theme == "light" ? "default" : "secondary"}
                    disabled={isSubmitting}
                    className=" w-full "
                  >
                    {isSubmitting && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant={theme == "light" ? "default" : "secondary"}
                    className="w-full"
                    onClick={openEmailInbox}
                  >
                    Open your email
                  </Button>
                )}
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

export default ForgotPassword;
