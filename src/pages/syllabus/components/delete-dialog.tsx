import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDeleteSyllabusMutation } from "@/store/api/v1/endpoints/syllabus";
import { SyllabusType } from "@/types/syllabus";
import React, { useEffect } from "react";

const DeleteDialog: React.FC<{
  syllabus: SyllabusType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ syllabus, open, onOpenChange }) => {
  const { toast } = useToast();
  const [deleteSyllabus, data] = useDeleteSyllabusMutation();

  const handleDelete: () => Promise<"prevent-close"> = async () => {
    deleteSyllabus({ id: syllabus.id });
    return "prevent-close";
  };

  useEffect(() => {
    if (data.isSuccess) {
      toast({
        duration: 1000,
        title: "Delete syllabus",
        description: "Delete syllabus successfully.",
      });
      onOpenChange(false);
    }

    if (data.isError) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Delete syllabus",
        description:
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  }, [data, onOpenChange, toast]);

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Syllabus"
      danger
      cancelButton
      okButton={{
        label: "Delete Syllabus",
        onClick: handleDelete,
        isLoading: data.isLoading,
      }}
      confirmText="I understand that this action cannot be undone."
    >
      {`Are you sure you want to delete the syllabus "${syllabus.name}"?`}
    </ActionDialog>
  );
};

export default DeleteDialog;
