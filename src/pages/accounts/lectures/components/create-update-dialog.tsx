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
import {lectureSchema } from "@/services/schemas/accounts";
import {
  useCreateLectureMutation,
  useUpdateLectureMutation,
} from "@/store/api/v1/endpoints/admin";
import { LectureType } from "@/types/accounts";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect } from "react";
interface FormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lecture?: LectureType;
}

const CreateUpdateDialog: React.FC<FormProps> = ({
  open,
  onOpenChange,
  lecture,
}) => {
  const [createLecture, createLectureData] = useCreateLectureMutation();
  const [updateLecture, updateLectureData] = useUpdateLectureMutation();

  const initialValues: LectureType = {
    email: lecture?.email || "",
    name: lecture?.name || "",
    phone_number: lecture?.phone_number || "",
    sub_major_id: 1,
  };

  const handleCreateForm = async (values: LectureType) => {
    if (lecture) {
      await updateLecture({ ...values, email: lecture.email });
    } else {
      await createLecture(values);
    }
  };

  useEffect(() => {
    if (createLectureData.isSuccess || updateLectureData.isSuccess) {
      toast({
        duration: 1000,
        variant: "default",
        title: lecture? "Update Lecture" : "Create Lecture",
        description: lecture
          ? "Update Lecture Successfully"
          : "Create Lecture Successfully.",
      });
      onOpenChange(false);
    }

    if (createLectureData.error || updateLectureData.error) {
      const { data } = (createLectureData.error || updateLectureData.error) as {
        data?: { code?: number; error?: string };
      };
      const messageError =
        data?.code === 409
          ? data.error
          : "Something went wrong, please try again. If the problem persists, please contact the administrator.";
      toast({
        duration: 1000,
        variant: "destructive",
        title: lecture ? "Update Student" : "Create Student",
        description: messageError,
      });
    }
  }, [createLectureData, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{lecture? "Update" : "Create"} Lecturer</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={lectureSchema}
          onSubmit={handleCreateForm}
        >
          {({ values, handleBlur, handleChange, isSubmitting }) => (
            <Form className=" flex flex-col gap-3 ">
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="code">Email</Label>
                <Input
                  name="email"
                  id="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter lecture's email"
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
                  placeholder="Enter lecture's name"
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
                  placeholder="Enter lecture's phone number"
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
                  {lecture ? "Update" : "Create"}
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
