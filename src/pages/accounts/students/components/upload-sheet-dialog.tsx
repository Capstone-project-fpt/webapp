import { FileUploader } from "@/components/common/file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useImportStudentsMutation } from "@/store/api/v1/endpoints/admin";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
interface UploadSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadSheetDialog: React.FC<UploadSheetDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [importStudents, importStudentsData] = useImportStudentsMutation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const createSheetForm = async () => {
    const file = files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsSubmitting(true);
      await importStudents(formData);
    }
  };

  useEffect(() => {
    if (importStudentsData.isSuccess) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Create Students",
        description: "Create Students Successfully.",
      });
      setIsSubmitting(false);
      onOpenChange(false);
    }

    if (importStudentsData.error) {
      const { data } = importStudentsData.error as {
        data?: { code?: number; error?: string };
      };
      const messageError =
        data?.code === 409
          ? data.error
          : "Something went wrong, please try again. If the problem persists, please contact the administrator.";
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Create Students",
        description: messageError,
      });
      setIsSubmitting(false);
    }
  }, [importStudentsData, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Students</DialogTitle>
          <DialogDescription>
            Upload a file to create students.
          </DialogDescription>
          <DialogDescription>
            <a
              href="" //TODO: Add the link file
              download
              className="text-accent underline flex items-center"
            >
              <FaFile className="mr-1" />
              Download the template file
            </a>
          </DialogDescription>
        </DialogHeader>

        <div>
          <FileUploader
            maxFileCount={1}
            maxSize={8 * 1024 * 1024}
            onValueChange={setFiles}
            accept={{
              sheet: [
                ".csv",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
              ],
            }}
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
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={createSheetForm}
          >
            {isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSheetDialog;
