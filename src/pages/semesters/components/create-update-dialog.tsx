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
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateSemestersMutation,
  useUpdateSemestersMutation
} from "@/store/api/v1/endpoints/semesters";
import { SemesterType} from "@/types/semester";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Formik } from "formik";

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
    start_time: semester?.start_time || "",
    end_time: semester?.end_time || "",
  };

  const [createSemester] = useCreateSemestersMutation();
  const [updateSemester] = useUpdateSemestersMutation();

  const handleForm = async (values: { name: string; start_time: string; end_time: string }) => {
    try {
      if (semester) {
        await updateSemester({ id: semester.id, ...values }).unwrap();
        toast({
          title: "Update Semester",
          description: "Semester updated successfully",
        });
      } else {
        await createSemester(values).unwrap();
        toast({
          title: "Create Semester",
          description: "Semester created successfully",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: `${semester ? "Update" : "Create"} semester`,
        description:
          "Something went wrong, please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{semester ? "Update Semester" : "Create Semester"}</DialogTitle>
          <DialogDescription>
            Make changes to your semester here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleForm}>
          {({ values, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
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
                <ErrorMessage name="name" component="div" className="text-sm text-danger" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="start_time">Start Date</Label>
                <Input
                  name="start_time"
                  id="start_time"
                  value={values.start_time}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter start date"
                />
                <ErrorMessage name="start_time" component="div" className="text-sm text-danger" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="end_time">End Date</Label>
                <Input
                  name="end_time"
                  id="end_time"
                  value={values.end_time}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter end date"
                />
                <ErrorMessage name="end_time" component="div" className="text-sm text-danger" />
              </div>
              <DialogFooter className="gap-2">
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
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
