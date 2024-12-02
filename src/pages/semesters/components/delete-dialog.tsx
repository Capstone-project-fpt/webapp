import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDeleteSemestersMutation } from "@/store/api/v1/endpoints/semesters";
import { SemesterType } from "@/types/semester";
import React from "react";

const DeleteDialog: React.FC<{
  semester: SemesterType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ semester, open, onOpenChange }) => {
  const { toast } = useToast();
  const [deleteSemestersMutation, data] = useDeleteSemestersMutation();

  const handleDelete = async () => {
    await deleteSemestersMutation({ id: semester.id });
    if (data.isSuccess) {
      toast({
        duration: 3000,
        title: "Delete semester",
        description: "Delete semester successfully.",
      });
      onOpenChange(false);
    }

    if (data.isError) {
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Delete semester",
        description:
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete semester"
      danger
      cancelButton
      okButton={{ label: "Delete semester", onClick: handleDelete }}
      confirmText="I understand that this action cannot be undone and all the semester members will be also removed from the semester."
    >
      {`Are you sure you want to delete the semester "${semester.name}" with ID ${semester.id}?`}
    </ActionDialog>
  );
};

export default DeleteDialog;
