import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDeleteEvaluationMutation } from "@/store/api/v1/endpoints/evaluations";
import { EvaluationType } from "@/types/evaluation";
import React, { useEffect } from "react";

const DeleteDialog: React.FC<{
  group: EvaluationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ group, open, onOpenChange }) => {
  const { toast } = useToast();
  const [deleteEvaluationCommitteeMutation, data] =
    useDeleteEvaluationMutation();

  const handleDelete = async () => {
    if (group && group.id) {
      await deleteEvaluationCommitteeMutation({ id: group.id });
    }
  };

  useEffect(() => {
    if (data.isSuccess) {
      toast({
        duration: 1000,
        title: "Delete evaluation committee group",
        description: "Delete evaluation committee group successfully.",
      });
      onOpenChange(false);
    }

    if (data.isError) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Delete evaluation committee group",
        description:
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  }, [data, onOpenChange, toast]);

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete evaluation committee group"
      danger
      cancelButton
      okButton={{
        label: "Delete evaluation committee group",
        onClick: handleDelete,
        isLoading: data.isLoading,
      }}
      confirmText="I understand that this action cannot be undone and the group will be also removed from the evaluation committee group."
    >
      {`Are you sure you want to delete the evaluation committee group "${group.name}" ?`}
    </ActionDialog>
  );
};

export default DeleteDialog;
