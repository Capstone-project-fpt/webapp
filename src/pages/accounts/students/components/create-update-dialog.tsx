import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { studentSchema } from "@/services/schemas/accounts";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "@/store/api/v1/endpoints/admin";
import { StudentType } from "@/types/accounts";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect } from "react";
interface FormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: StudentType;
}

const CreateUpdateDialog: React.FC<FormProps> = ({
  open,
  onOpenChange,
  student,
}) => {
  const [createStudent, createStudentData] = useCreateStudentMutation();
  const [updateStudent, updateStudentData] = useUpdateStudentMutation();

  const initialValues: StudentType = {
    code: student?.code || "",
    email: student?.email || "",
    name: student?.name || "",
    phone_number: student?.phone_number || "",
    sub_major_id: 1,
  };

  const handleCreateForm = async (values: StudentType) => {
    if (student) {
      await updateStudent({ ...values, id: student.id });
    } else {
      await createStudent(values);
    }
  };

  useEffect(() => {
    if (createStudentData.isSuccess || updateStudentData.isSuccess) {
      toast({
        duration: 1000,
        variant: "default",
        title: student ? "Update Student" : "Create Student",
        description: student
          ? "Update Student Successfully"
          : "Create Student Successfully.",
      });
      onOpenChange(false);
    }

    if (createStudentData.error || updateStudentData.error) {
      const { data } = (createStudentData.error || updateStudentData.error) as {
        data?: { code?: number; error?: string };
      };
      const messageError =
        data?.code === 409
          ? data.error
          : "Something went wrong, please try again. If the problem persists, please contact the administrator.";
      toast({
        duration: 1000,
        variant: "destructive",
        title: student ? "Update Student" : "Create Student",
        description: messageError,
      });
    }
  }, [createStudentData, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{student ? "Update" : "Create"} Student</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={studentSchema}
          onSubmit={handleCreateForm}
        >
          {({ values, handleBlur, handleChange, isSubmitting }) => (
            <Form className=" flex flex-col gap-3 ">
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="code">Code</Label>
                <Input
                  name="code"
                  id="code"
                  value={values.code}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter student's code"
                />
                <ErrorMessage
                  name="code"
                  component={"div"}
                  className="text-sm text-danger"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="code">Email</Label>
                <Input
                  name="email"
                  id="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter student's email"
                />
                <ErrorMessage
                  name="email"
                  component={"div"}
                  className="text-sm text-danger"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="code">Name</Label>
                <Input
                  name="name"
                  id="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter student's name"
                />
                <ErrorMessage
                  name="name"
                  component={"div"}
                  className="text-sm text-danger"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="code">Phone Number</Label>
                <Input
                  name="phone_number"
                  id="phone_number"
                  value={values.phone_number}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter student's phone number"
                />
                <ErrorMessage
                  name="phone_number"
                  component={"div"}
                  className="text-sm text-danger"
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {student ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateDialog;
