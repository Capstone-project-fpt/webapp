import { InputPassword } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/services/providers/theme-provider";
import { signInSchema } from "@/services/schemas";
import { useSignInMutation } from "@/store/api/v1/endpoints/auth";
import { useLazyGetMeQuery } from "@/store/api/v1/endpoints/user";
import { saveUserInfo, setUserInfo } from "@/store/slice/auth";
import { SignInType } from "@/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import React, { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./components/logo";
import MobileLogo from "./components/mobile-logo";

const SignIn: React.FC = () => {
  const { theme } = useTheme();
  const [signIn, signInData] = useSignInMutation();
  const [triggerGetMe] = useLazyGetMeQuery();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  // TODO: Remove this values
  const initialValues: SignInType = {
    email: "admin@gmail.com",
    password: "123456",
  };

  const handleSubmit = async (
    values: SignInType,
    action: FormikHelpers<SignInType>,
  ) => {
    await signIn(values);
    signInData.isSuccess && action.resetForm();
  };

  useEffect(() => {
    const isSuccess = signInData?.isSuccess;
    if (isSuccess) {
      dispatch(
        saveUserInfo({
          token: signInData?.data?.data?.access_token,
        }),
      );
      navigate("/");
      triggerGetMe({})
        .unwrap()
        .then((data) => {
          dispatch(setUserInfo(data?.data));
        })
        .catch((error) => console.log("Failed to fetch user data:", error));
    }
    // Toast
    if (signInData?.data || signInData?.error) {
      toast({
        duration: 1000,
        variant: `${isSuccess ? "default" : "destructive"}`,
        title: `${isSuccess ? "Sign In" : "Sign In Failed"}`,
        description: `${
          isSuccess
            ? "Sign In Successfully."
            : "Your email or password is wrong. Please try again."
        }`,
      });
    }
  }, [dispatch, navigate, signInData, toast, triggerGetMe]);

  return (
    <div className=" w-screen h-screen flex flex-col lg:flex-row gap-5 lg:gap-0 justify-center items-center">
      <Logo />
      <div className=" lg:basis-1/2 dark:bg-white dark:text-dark flex flex-col justify-center lg:flex-row items-center h-screen ">
        <div className=" lg:w-7/12 w-screen px-4 lg:mt-0 lg:px-0 mx-auto ">
          <MobileLogo />
          <div className=" text-2xl mb-6 ">Sign In</div>
          <Formik
            initialValues={initialValues}
            validationSchema={signInSchema}
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
                    placeholder="John@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component={"div"}
                    className=" text-sm text-danger "
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <Label htmlFor="password">Password</Label>
                  <InputPassword
                    name="password"
                    id="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="****"
                  />
                  <ErrorMessage
                    name="password"
                    component={"div"}
                    className=" text-sm text-danger"
                  />
                </div>

                <div className="flex justify-end">
                  <Link to="/auth/forgot-password" className="text-sm">
                    Forgot Password?
                  </Link>
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
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button variant="outline" className="w-full disabled">
              <FaGoogle className="mr-1" />
              Sign In with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
