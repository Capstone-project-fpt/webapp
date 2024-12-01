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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRE_PATH_S3 } from "@/constant";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateTopicMutation,
  useUpdateTopicMutation,
} from "@/store/api/v1/endpoints/groups";
import { useGeneratePresignUrlMutation } from "@/store/api/v1/endpoints/upload";
import { generateKeyS3 } from "@/utils/generate-key-s3";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
interface UploadTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  topicId?: string;
  refetchTopics?: () => void;
}

const CreateUploadTopicDialog: React.FC<UploadTopicDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  topicId,
  refetchTopics,
}) => {
  const [createTopic, createTopicData] = useCreateTopicMutation();
  const [updateTopic] = useUpdateTopicMutation();
  const [generatePresignUrl] = useGeneratePresignUrlMutation();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (createTopicData.isSuccess) {
      toast({
        duration: 1000,
        variant: "default",
        title: topicId ? "Update Topic" : "Submit Topic",
        description: "Submit Topic Successfully.",
      });
      refetchTopics?.();
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
        title: topicId ? "Update Topic" : "Submit Topic",
        description: messageError,
      });
    }
  }, [createTopicData, topicId, onOpenChange, toast]);

  const initialValues = {
    name: "",
    path: "",
  };

  const handleForm = async (values: { name: string }) => {
    try {
      await submitTopic(values.name);
    } catch (error) {
      toast({
        title: `Submit Topic`,
        description:
          "Something went wrong, please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    }
  };

  const onUploadFile = async (): Promise<string> => {
    const file = files[0];
    const key = generateKeyS3(PRE_PATH_S3.GroupTopic, file.name);
    const { data: url } = await generatePresignUrl({ key }).unwrap();

    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return key;
  };

  const submitTopic = async (name: string) => {
    if (files.length === 0) {
      toast({
        title: topicId ? "Update Topic" : "Create Topic",
        description: "Please select a file",
        variant: "destructive",
      });
    }

    const path = await onUploadFile();
    if (topicId) {
      await updateTopic({
        topic_id: parseInt(topicId),
        group_id: parseInt(groupId),
        topic: name,
        document_path: path,
      });
    } else {
      await createTopic({
        group_id: parseInt(groupId),
        topic: name,
        document_path: path,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{topicId ? "Update Topic" : "Submit Topic"}</DialogTitle>
          <DialogDescription>Upload a file to submit Topic.</DialogDescription>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleForm}>
          {({ values, handleBlur, handleChange, isSubmitting }) => (
            <Form className=" flex flex-col gap-3 ">
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="code">Name</Label>
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
                  component={"div"}
                  className="text-sm text-danger"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <FileUploader
                  maxFileCount={1}
                  maxSize={8 * 1024 * 1024}
                  onValueChange={setFiles}
                  value={files}
                  accept={{
                    "document/*": [
                      ".doc",
                      "application/msword",
                      ".docx",
                      ".pdf",
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUploadTopicDialog;
