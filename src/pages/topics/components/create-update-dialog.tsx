import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import {
  useAdminCreateTopicMutation,
  useTeacherCreateTopicMutation,
  useTeacherUpdateTopicMutation,
} from "@/store/api/v1/endpoints/topics";
import { useGeneratePresignUrlMutation } from "@/store/api/v1/endpoints/upload";
import { TopicType } from "@/types/topic";
import { generateKeyS3 } from "@/utils/generate-key-s3";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Form, Formik } from "formik";
import { useState } from "react";
import SelectTeacher from "./select-teacher";
import { OptionType } from "../type";
import { UserType, UserTypes } from "@/types/accounts";
import { FaRegTrashAlt } from "react-icons/fa";
import { isNil } from "@/utils/lodash";
import { PRE_PATH_S3 } from "@/constant";
interface CreateUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: TopicType;
  currentUserType: UserTypes;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({
  topic,
  open,
  onOpenChange,
  currentUserType,
}) => {
  const { toast } = useToast();
  const initialValues = {
    name: topic?.name || "",
    path: topic?.path || "",
    teacherId: topic?.teacher.teacher_id || 0,
  };

  const [files, setFiles] = useState<File[]>([]);
  const [selectTeacher, setSelectTeacher] = useState<OptionType | null>(null);

  const [adminCreateTopic] = useAdminCreateTopicMutation();
  const [teacherCreateTopic] = useTeacherCreateTopicMutation();
  const [teacherUpdateTopic] = useTeacherUpdateTopicMutation();
  const [generatePresignUrl] = useGeneratePresignUrlMutation();

  const onUploadFile = async (): Promise<string> => {
    const file = files[0];
    const key = generateKeyS3(PRE_PATH_S3.TopicReference, file.name);
    const { data: url } = await generatePresignUrl({ key }).unwrap();

    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    toast({
      title: "Create Topic",
      description: "Topic created successfully",
    });
    onOpenChange(false);

    return key;
  };

  const createTopicReference = async (name: string) => {
    if (files.length === 0) {
      toast({
        title: "Create Topic",
        description: "Please select a file",
        variant: "destructive",
      });
    }

    if (currentUserType === UserTypes.ADMIN && isNil(selectTeacher)) {
      toast({
        title: "Create Topic",
        description: "Please select a teacher",
        variant: "destructive",
      });
    }

    const path = await onUploadFile();
    if (currentUserType === UserTypes.ADMIN) {      
      await adminCreateTopic({
        name,
        path,
        teacher_id: selectTeacher!.value.extra_info.teacher!.teacher_id!,
      }).unwrap();
    }
    if (currentUserType === UserTypes.TEACHER) {
      await teacherCreateTopic({
        name,
        path,
      }).unwrap();
    }
  };

  const updateTopicReference = async (
    topicUpdate: TopicType,
    nameTopic: string
  ) => {
    let path = topicUpdate.path;
    if (files.length > 0) {
      path = await onUploadFile();
    }
    await teacherUpdateTopic({
      name: nameTopic,
      id: topicUpdate.id,
      path,
    }).unwrap();
    toast({
      title: "Update Topic",
      description: "Topic updated successfully",
    });
  };

  const handleForm = async (values: { name: string }) => {
    try {
      if (topic) {
        await updateTopicReference(topic, values.name);
        onOpenChange(false);
      } else {
        await createTopicReference(values.name);
        onOpenChange(false);
      }
      onOpenChange(false);
    } catch (error) {
      console.log("🚀 ~ handleForm ~ error:", error)
      
      toast({
        title: `${topic ? "Update" : "Create"} Topic`,
        description:
          "Something went wrong, please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTeacher = () => {
    setSelectTeacher(null);
  };

  const TeacherItem: React.FC<{ teacher?: UserType }> = ({ teacher }) =>
    isNil(teacher) ? (
      <></>
    ) : (
      <div className="flex items-center justify-between p-2 border rounded-md border-gray-300">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                teacher!.name
              )}&size=32`}
              alt={teacher!.name}
            />
            <AvatarFallback>{teacher!.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p>{teacher!.name}</p>
            <p className="text-sm text-gray-500">{teacher!.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleRemoveTeacher()}
          >
            <FaRegTrashAlt className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{topic ? "Update Topic" : "Create Topic"}</DialogTitle>
          <DialogDescription>
            Make changes to your topic here. Click save when you're done.
          </DialogDescription>
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
              {currentUserType === UserTypes.ADMIN && (
                <>
                  <Label htmlFor="code">Teacher</Label>
                  <TeacherItem
                    teacher={selectTeacher?.value.common_info}
                    key={selectTeacher?.value.common_info.id}
                  />
                  <SelectTeacher
                    value={selectTeacher}
                    onChangeValue={setSelectTeacher}
                    teacher={selectTeacher?.value}
                  />
                  <ErrorMessage
                    name="name"
                    component={"div"}
                    className="text-sm text-danger"
                  />
                </>
              )}
              <div className="flex flex-col gap-2 ">
                <FileUploader
                  maxFileCount={1}
                  maxSize={8 * 1024 * 1024}
                  onValueChange={setFiles}
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
                  {topic ? "Update" : "Create"}
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
