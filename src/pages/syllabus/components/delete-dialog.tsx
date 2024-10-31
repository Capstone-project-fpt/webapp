import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/components/ui/use-toast";
import { SyllabusType } from "@/types/syllabus";
import React from "react";
import { useDeleteSyllabusMutation } from "@/store/api/v1/endpoints/syllabus"; 

const DeleteDialog: React.FC<{
  syllabus: SyllabusType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ syllabus, open, onOpenChange }) => {
  const { toast } = useToast();
  const [deleteSyllabusMutation, data] = useDeleteSyllabusMutation(); 

  const handleDelete = async () => {
    await deleteSyllabusMutation({ id: syllabus.id });
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
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Syllabus"
      danger
      cancelButton
      okButton={{ label: "Delete Syllabus", onClick: handleDelete }} 
      confirmText="I understand that this action cannot be undone."
    >
      {`Are you sure you want to delete the syllabus "${syllabus.name}" with ID ${syllabus.id}?`}
    </ActionDialog>
  );
};

export default DeleteDialog;
