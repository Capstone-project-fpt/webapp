import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpdateMembersMutation } from "@/store/api/v1/endpoints/groups";
import { ResponseErrorType } from "@/types";
import React from "react";

const DeleteMemberDialog: React.FC<{
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: number;
  onDelete: () => void;
}> = ({ groupId, open, onOpenChange, memberId, onDelete }) => {
  const { toast } = useToast();
  const [updateMembersMutation, { isLoading }] = useUpdateMembersMutation();

  const handleDelete = async () => {
    try {
      await updateMembersMutation({
        group_id: groupId,
        student_ids: [memberId],
      }).unwrap();

      toast({
        duration: 3000,
        title: "Member Removed",
        description: "The member was successfully removed from the group.",
      });
      onDelete();
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Error Removing Member",
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove Member from Group"
      danger
      cancelButton
      okButton={{
        label: "Confirm Removal",
        onClick: handleDelete,
        isLoading,
      }}
      confirmText="This action cannot be undone. The selected member will be removed from the group."
    >
      Are you sure you want to remove this member from the group?
    </ActionDialog>
  );
};

export default DeleteMemberDialog;
