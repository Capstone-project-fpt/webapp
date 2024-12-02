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
import { toast } from "@/hooks/use-toast";
import { lectureSchema } from "@/services/schemas/accounts";
import {
  useCreateLectureMutation,
  useUpdateLectureMutation,
} from "@/store/api/v1/endpoints/admin";
import { LectureType, UpdateLecturePayload } from "@/types/accounts";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect } from "react";
interface FormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lecture?: UpdateLecturePayload;
}

const CreateUpdateDialog: React.FC<FormProps> = ({
  open,
  onOpenChange,
  lecture,
}) => {
  const [createLecture, createLectureData] = useCreateLectureMutation();
  const [updateLecture, updateLectureData] = useUpdateLectureMutation();

  type InitialValuesType = UpdateLecturePayload & Partial<LectureType>;

  const initialValues: InitialValuesType = {
    teacher_id: lecture?.teacher_id || 0,
    id: lecture?.id || 0,
    email: lecture?.email || "",
    name: lecture?.name || "",
    phone_number: lecture?.phone_number || "",
    sub_major_id: lecture?.sub_major_id || 1,
  };

  const handleCreateForm = async (values: InitialValuesType) => {
    if (lecture) {
      await updateLecture(values as UpdateLecturePayload);
    } else {
      const newlecture: LectureType = {
        teacher_id: values.teacher_id || 0,
        id: values.teacher_id || 0,
        email: values.email,
        name: values.name,
        phone_number: values.phone_number,
        sub_major_id: values.sub_major_id,
      };
      await createLecture(newlecture);
    }
  };


  useEffect(() => {
    if (createLectureData.isSuccess || updateLectureData.isSuccess) {
      toast({
        duration: 3000,
        title: lecture ? "Update Lecture" : "Create Lecture",
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
        duration: 3000,
        variant: "destructive",
        title: lecture ? "Update lecture" : "Create lecture",
        description: messageError,
      });
    }
  }, [
    createLectureData,
    lecture,
    onOpenChange,
    updateLectureData.error,
    updateLectureData.isSuccess,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{lecture ? "Update" : "Create"} Lecturer</DialogTitle>
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
              {/* <div className="flex flex-col gap-2 "> */}
                {/* <Label htmlFor="sub_major_id">Major</Label>
                <Select
                  value={String(values.sub_major_id)}
                  onValueChange={(value) => setFieldValue("sub_major_id", parseInt(value))}
                >
                  <SelectTrigger className="p-2 border rounded-md">
                    <SelectValue placeholder="Select Major" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Technology and Information</SelectItem>
                    <SelectItem value="2">Business Administration</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="sub_major_id"
                  component="div"
                  className="text-sm text-danger"
                /> */}
              {/* </div> */}
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
