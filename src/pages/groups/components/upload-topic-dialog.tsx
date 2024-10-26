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
import { useCreateTopicMutation } from "@/store/api/v1/endpoints/groups";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
interface UploadTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadTopicDialog: React.FC<UploadTopicDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [createTopic, createTopicData] = useCreateTopicMutation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const createTopicForm = async () => {
    console.log("");
    // const file = files[0];
    // if (file) {
    //   const formData = new FormData();
    //   formData.append("file", file);
    //   setIsSubmitting(true);
    // }
  };

  useEffect(() => {
    if (createTopicData.isSuccess) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Create Topic",
        description: "Create Topic Successfully.",
      });
      setIsSubmitting(false);
      onOpenChange(false);
    }

    if (createTopicData.error) {
      const { data } = createTopicData.error as {
        data?: { code?: number; error?: string };
      };
      const messageError =
        data?.code === 409
          ? data.error
          : "Something went wrong, please try again. If the problem persists, please contact the administrator.";
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Create Topic",
        description: messageError,
      });
      setIsSubmitting(false);
    }
  }, [createTopicData, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Topic</DialogTitle>
          <DialogDescription>Upload a file to create Topic.</DialogDescription>
        </DialogHeader>

        <div>
          <FileUploader
            maxFileCount={2}
            maxSize={8 * 1024 * 1024}
            onValueChange={setFiles}
            accept={{}}
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
            onClick={createTopicForm}
          >
            {isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTopicDialog;
