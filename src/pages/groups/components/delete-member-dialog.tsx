import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateMembersMutation } from "@/store/api/v1/endpoints/groups";
import React, { useEffect } from "react";

const DeleteMemberDialog: React.FC<{
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: number;
  onDelete: () => void;
}> = ({ groupId, open, onOpenChange, memberId, onDelete }) => {
  const { toast } = useToast();
  const [updateMembersMutation, { isSuccess, isError, isLoading }] = useUpdateMembersMutation();

  const handleDelete = async () => {
    try {
      await updateMembersMutation({
        group_id: groupId,
        student_ids: [memberId],
      });

      if (isSuccess) {
        toast({
          duration: 1000,
          title: "Member Removed",
          description: "The member was successfully removed from the group.",
        });
        onDelete();
        onOpenChange(false);
      }
    } catch {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error Removing Member",
        description: "An error occurred while removing the member. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (isError) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error Removing Member",
        description: "An error occurred while removing the member. Please try again.",
      });
    }
  }, [isError, toast]);

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
