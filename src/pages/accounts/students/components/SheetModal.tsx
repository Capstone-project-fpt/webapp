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
import { useImportStudentsMutation } from "@/store/api/v1/endpoints/admin";
import { useState } from "react";
interface SheetModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetModal: React.FC<SheetModalProps> = ({ open, setOpen }) => {
  const [importStudents, importStudentsData] = useImportStudentsMutation();
  const [files, setFiles] = useState<File[]>([]);

  const createSheetForm = () => {
    console.log("Creating form", { files });
    // importStudents({ file: formData });
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Students</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
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
        <DialogFooter>
          <Button onClick={createSheetForm}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SheetModal;
