import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import { InputPassword } from "@/components";
import { ChangePasswordType } from "@/types";
import { ChangePasswordSchema } from "@/services/schemas/settings";
import { useChangePasswordMutation } from "@/store/api/v1/endpoints/auth";
import { useToast } from "@/hooks/use-toast"

const ChangePassword: React.FC = () => {
  const [changePassword, changePasswordData] = useChangePasswordMutation();
  const { toast } = useToast();
  const initialValues: ChangePasswordType = {
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  };

  const handleSubmit = async (
    data: ChangePasswordType,
    action: FormikHelpers<ChangePasswordType>
  ) => {
    await changePassword(data);
    changePasswordData?.isSuccess && action.resetForm();
  };

  useEffect(() => {
    const isSuccess = changePasswordData?.isSuccess;
    if (changePasswordData?.data || changePasswordData?.error) {
      toast({
        duration: 3000,
        variant: `${isSuccess ? "default" : "destructive"}`,
        title: `${
          isSuccess ? "Change Password Successfully" : "Change Password Failed"
        }`,
        description: `${
          isSuccess
            ? "Your password is change."
            : "Old password is incorrect or something went wrong. Please try again."
        }`,
      });
    }
  }, [changePasswordData, toast]);

  return (
    <div>
      <div className=" text-xl ">Change Password</div>
      <div className=" text-slate-500 mt-2 ">
        Update your account's security by modifying your current password to a new one.
      </div>
      <div className=" my-4 border dark:border-foreground " />
      <div className=" lg:w-5/12 ">
        <Formik
          initialValues={initialValues}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleBlur, handleChange, isSubmitting }) => (
            <Form className=" flex flex-col gap-3 ">
              <div className=" flex flex-col gap-2 ">
                <Label htmlFor="old_password">Old Password</Label>
                <InputPassword
                  name="old_password"
                  id="old_password"
                  value={values.old_password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="****"
                />
                <ErrorMessage
                  name="old_password"
                  component={"div"}
                  className=" text-sm text-danger"
                />
              </div>

              <div className=" flex flex-col gap-2 ">
                <Label htmlFor="new_password">New Password</Label>
                <InputPassword
                  name="new_password"
                  id="new_password"
                  value={values.new_password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="****"
                />
                <ErrorMessage
                  name="new_password"
                  component={"div"}
                  className=" text-sm text-danger"
                />
              </div>

              <div className=" flex flex-col gap-2 ">
                <Label htmlFor="new_password_confirmation">
                  New Confirm Password
                </Label>
                <InputPassword
                  name="new_password_confirmation"
                  id="new_password_confirmation"
                  value={values.new_password_confirmation}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="****"
                />
                <ErrorMessage
                  name="new_password_confirmation"
                  component={"div"}
                  className=" text-sm text-danger"
                />
              </div>

              <div className=" text-end ">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
