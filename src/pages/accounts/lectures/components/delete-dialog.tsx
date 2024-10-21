import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteLectureMutation } from "@/store/api/v1/endpoints/admin";
import { LectureType,  } from "@/types/accounts";
import React from "react";

const DeleteDialog: React.FC<{
  lecture: LectureType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ lecture, open, onOpenChange }) => {
  const { toast } = useToast();
  const [deleteLectureMutation, data] = useDeleteLectureMutation();

  const handleDelete = async () => {
    if (lecture && lecture.email) {
      await deleteLectureMutation({email: lecture.email});
      if (data.isSuccess) {
        toast({
          duration: 1000,
          title: "Delete lecturer",
          description: "Delete student successfully.",
        });
        onOpenChange(false);
      }

      if (data.isError) {
        toast({
          duration: 1000,
          variant: "destructive",
          title: "Delete leturer",
          description:
            "Something went wrong, please try again. If the problem persists, please contact the administrator.",
        });
      }
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete lecturer"
      danger
      cancelButton
      okButton={{ label: "Delete lecturer", onClick: handleDelete }}
      confirmText="I understand that this action cannot be undone and all the lecturer will be also removed from the lecturer."
    >
      {`Are you sure you want to delete the lecturer "${lecture.name} (${lecture.email})" ?`}
    </ActionDialog>
  );
};

export default DeleteDialog;
