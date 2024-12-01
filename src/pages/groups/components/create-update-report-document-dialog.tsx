import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Formik, Form } from "formik";
import { useToast } from "@/hooks/use-toast";
import {
  ReportDocumentCategoryType,
  ReportDocumentType,
} from "@/types/report-document";
import { createReportDocumentSchema } from "@/services/schemas/report-document";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FileUploader } from "@/components/common/file-upload";
import { useState } from "react";
import { useGenerateMultiplePresignUrlsMutation } from "@/store/api/v1/endpoints/upload";
import { generateKeyS3 } from "@/utils/generate-key-s3";
import { PRE_PATH_S3 } from "@/constant";
import {
  useCreateReportDocumentMutation,
  useUpdateReportDocumentMutation,
} from "@/store/api/v1/endpoints/groups";
import { ResponseErrorType } from "@/types";
import { useParams } from "react-router";

interface CreateUpdateReportDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportDocument?: ReportDocumentType;
}

const CreateUpdateReportDocumentDialog: React.FC<
  CreateUpdateReportDocumentDialogProps
> = ({ open, onOpenChange, reportDocument }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const { toast } = useToast();
  const [generatePresignUrls] = useGenerateMultiplePresignUrlsMutation();
  const [createReportDocument] = useCreateReportDocumentMutation();
  const [updateReportDocument] = useUpdateReportDocumentMutation();

  const [files, setFiles] = useState<File[]>([]);

  const initialValues = {
    files: reportDocument ? reportDocument.file_ids : [],
    name: reportDocument ? reportDocument.name : "",
    type_report: ReportDocumentCategoryType.FIFTH_REPORT,
  };

  const isCreateForm = !reportDocument;

  const REPORT_DOCUMENT_TYPE = [
    { label: "First Report", value: ReportDocumentCategoryType.FIRST_REPORT },
    { label: "Second Report", value: ReportDocumentCategoryType.SECOND_REPORT },
    { label: "Third Report", value: ReportDocumentCategoryType.THIRD_REPORT },
    { label: "Fourth Report", value: ReportDocumentCategoryType.FOURTH_REPORT },
    { label: "Fifth Report", value: ReportDocumentCategoryType.FIFTH_REPORT },
    { label: "Sixth Report", value: ReportDocumentCategoryType.SIXTH_REPORT },
    {
      label: "Seventh Report",
      value: ReportDocumentCategoryType.SEVENTH_REPORT,
    },
  ];

  const handleForm = async (values: {
    name: string;
    type_report: ReportDocumentCategoryType;
  }) => {
    const { name, type_report } = values;
    if (files.length === 0 && isCreateForm) {
      toast({
        title: isCreateForm
          ? "Create Report Document"
          : "Update Report Document",
        description: "Please select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const paths = await onUploadFiles();

      if (isCreateForm) {
        await createReportDocument({
          name,
          type_report,
          file_ids: paths,
          capstone_group_id: Number(groupId),
        }).unwrap();
      } else {
        await updateReportDocument({
          name,
          file_ids: files.length > 0 ? paths : reportDocument!.file_ids,
          capstone_group_id: Number(groupId),
          id: reportDocument!.id,
        }).unwrap();
      }
    } catch (error) {
      toast({
        title: `Submit Report Document`,
        description:
          (error as ResponseErrorType)?.data.error ||
          "Something went wrong, please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    }

    onOpenChange(false);
  };

  const onUploadFiles = async (): Promise<string[]> => {
    const paths = files.map((file) => {
      return generateKeyS3(PRE_PATH_S3.GroupTopic, file.name);
    });
    const { data: urls } = await generatePresignUrls({ key: paths }).unwrap();
    const pathWithUrlAndFiles = paths.map((path, index) => {
      return {
        key: path,
        url: urls[index],
        file: files[index],
      };
    });

    await Promise.all(
      pathWithUrlAndFiles.map(async (pathWithUrlAndFile) => {
        await fetch(pathWithUrlAndFile.url, {
          method: "PUT",
          body: pathWithUrlAndFile.file,
          headers: {
            "Content-Type": pathWithUrlAndFile.file.type,
          },
        });
      })
    );

    return paths;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {reportDocument ? "Update Report" : "Create Report"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your report here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          onSubmit={handleForm}
          validationSchema={createReportDocumentSchema}
        >
          {({
            values,
            isSubmitting,
            setFieldValue,
            handleSubmit,
            handleBlur,
            handleChange,
          }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

              {!reportDocument && (
                <div className=" flex flex-col gap-2 ">
                  <Label htmlFor="title">Report Document Type</Label>
                  <Select
                    name="title"
                    value={values.type_report}
                    onValueChange={(value) => {
                      const selectedReview = REPORT_DOCUMENT_TYPE.find(
                        (item) => item.value === value
                      );
                      if (selectedReview) {
                        setFieldValue("type_report", selectedReview.value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select review title" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_DOCUMENT_TYPE.map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="title"
                    component={"div"}
                    className=" text-sm text-danger "
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 ">
                <Label htmlFor="title">Report Document Files</Label>
                <FileUploader
                  maxFileCount={3}
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
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {reportDocument ? "Update Report" : "Create Report"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateReportDocumentDialog;
