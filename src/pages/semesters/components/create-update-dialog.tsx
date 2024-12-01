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
import {
  useCreateSemestersMutation,
  useUpdateSemestersMutation,
} from "@/store/api/v1/endpoints/semesters";
import { SemesterType } from "@/types/semester";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Formik } from "formik";
import { DateSemesterPicker } from "./date-semester-picker";
import dayjs from "dayjs";
import { semesterSchema } from "@/services/schemas";
import { useToast } from "@/hooks/use-toast";
import { ResponseErrorType } from "@/types";

interface CreateUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semester?: SemesterType;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({
  semester,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const initialValues = {
    name: semester?.name || "",
    start_time: semester?.start_time || dayjs().startOf("day").toDate(),
    end_time: semester?.end_time || dayjs().startOf("day").toDate(),
  };

  const [createSemester] = useCreateSemestersMutation();
  const [updateSemester] = useUpdateSemestersMutation();

  const handleForm = async (values: {
    name: string;
    start_time: Date;
    end_time: Date;
  }) => {
    const { name } = values;
    let { start_time, end_time } = values;

    start_time = new Date(start_time);
    end_time = new Date(end_time);

    if (start_time.getTime() > end_time.getTime()) {
      toast({
        title: "Create semester",
        description: "Start time must be before end time",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        name,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
      };

      if (semester) {
        await updateSemester({
          id: semester.id,
          ...data,
        }).unwrap();
        toast({
          title: "Update Semester",
          description: "Semester updated successfully",
        });
      } else {
        await createSemester(data).unwrap();
        toast({
          title: "Create Semester",
          description: "Semester created successfully",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: `${semester ? "Update" : "Create"} semester`,
        description: (error as ResponseErrorType).data.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {semester ? "Update Semester" : "Create Semester"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your semester here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          onSubmit={handleForm}
          validationSchema={semesterSchema}
        >
          {({
            values,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  id="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-danger"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="start_time">Start Date</Label>
                <DateSemesterPicker
                  date={new Date(values.start_time)}
                  onDateChange={(e) =>
                    setFieldValue(
                      "start_time",
                      dayjs(e?.toString()).startOf("day").toDate()
                    )
                  }
                />
                <ErrorMessage
                  name="start_time"
                  component="div"
                  className="text-sm text-danger"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="end_time">End Date</Label>
                <DateSemesterPicker
                  date={new Date(values.end_time)}
                  onDateChange={(e) =>
                    setFieldValue(
                      "end_time",
                      dayjs(e?.toString()).startOf("day").toDate()
                    )
                  }
                />
                <ErrorMessage
                  name="end_time"
                  component="div"
                  className="text-sm text-danger"
                />
              </div>
              <DialogFooter className="gap-2">
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {semester ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateDialog;
