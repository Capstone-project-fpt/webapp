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
  useCreateSyllabusMutation,
  useUpdateSyllabusMutation,
} from "@/store/api/v1/endpoints/syllabus";
import { SyllabusType } from "@/types/syllabus";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Formik } from "formik";

interface CreateUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syllabus?: SyllabusType;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({
  syllabus,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const initialValues = {
    name: syllabus?.name || "",
    code: syllabus?.code || "",
    path: syllabus?.path || "",
  };

  const [createSyllabus] = useCreateSyllabusMutation();
  const [updateSyllabus] = useUpdateSyllabusMutation();

  const handleForm = async (values: {
    name: string;
    code: string;
    path: string;
  }) => {
    try {
      if (syllabus) {
        await updateSyllabus({ id: syllabus.id, ...values }).unwrap();
        toast({
          title: "Update Syllabus",
          description: "Syllabus updated successfully",
        });
      } else {
        await createSyllabus(values).unwrap();
        toast({
          title: "Create Syllabus",
          description: "Syllabus created successfully",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: `${syllabus ? "Update" : "Create"} syllabus`,
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
          <DialogTitle>
            {syllabus ? "Update Syllabus" : "Create Syllabus"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your syllabus here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleForm}>
          {({
            values,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
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
                <Label htmlFor="code">Code</Label>
                <Input
                  name="code"
                  id="code"
                  value={values.code}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter code"
                />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="text-sm text-danger"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="path">Path</Label>
                <Input
                  name="path"
                  id="path"
                  value={values.path}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter path"
                />
                <ErrorMessage
                  name="path"
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
                  {syllabus ? "Update" : "Create"}
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
