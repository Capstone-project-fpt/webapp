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
import { useToast } from "@/hooks/use-toast";
import { useImportStudentsMutation } from "@/store/api/v1/endpoints/admin";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";

interface UploadSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ErrorImportFile {
  success_count: number;
  failed_count: number;
  failed_import_docs: {
    row: number;
    error: string;
  }[];
  exception?: string;
}

const UploadSheetDialog: React.FC<UploadSheetDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [importStudents, importStudentsData] = useImportStudentsMutation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [failImport, setFailImport] = useState<ErrorImportFile | null>(null);

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
    setFailImport(null);
  }, [files]);

  useEffect(() => {
    if (importStudentsData.isSuccess) {
      toast({
        duration: 3000,
        variant: "default",
        title: "Create Students",
        description: "Create Students Successfully.",
      });
      setIsSubmitting(false);
      onOpenChange(false);
    }

    if (importStudentsData.error) {
      const data = importStudentsData.error?.data;

      if ("success_count" in data.error) {
        if (data.error.exception) {
          toast({
            duration: 3000,
            variant: "destructive",
            title: "Create Students",
            description: data.error.exception,
          });
          setIsSubmitting(false);
          return;
        }

        setFailImport(data.error as ErrorImportFile);
        setIsSubmitting(false);
        return;
      }

      const messageError =
        "Something went wrong, please try again. If the problem persists, please contact the administrator.";
      toast({
        duration: 3000,
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
              href={`${
                import.meta.env.VITE_APP_S3_BUCKET_URL
              }/admin/student-template.xlsx`}
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
        {failImport && (
          <div className="max-h-60 overflow-y-auto p-4">
            {failImport.failed_import_docs.map((error, index) => (
              <div key={index} className="py-2 border-b text-danger">
                <strong>Row {error.row}:</strong> {error.error}
              </div>
            ))}
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              onOpenChange(false);
              setFiles([]);
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
