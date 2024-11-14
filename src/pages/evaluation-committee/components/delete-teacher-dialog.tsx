import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateEvaluationMutation } from "@/store/api/v1/endpoints/evaluations";
import { UpdateEvaluationGroup } from "@/types/evaluation";
import React, { useEffect } from "react";

const DeleteTeacherDialog: React.FC<{
  group: UpdateEvaluationGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
  onDelete: () => void;
}> = ({ group, open, onOpenChange, teacherId, onDelete }) => {
  const { toast } = useToast();
  const [updateEvaluationCommitteeMutation, { isSuccess, isError, isLoading }] = useUpdateEvaluationMutation();

  const handleDelete = async () => {
    if (group.teacher_ids.length <= 2) {
      toast({
        duration: 2000,
        title: "Can not remove",
        description: "The evaluation committee must have at least 2 members",
      });
      return;
    }

    const updatedTeacherIds = group.teacher_ids.filter(id => id !== teacherId);
    await updateEvaluationCommitteeMutation({
      id: group.id,
      name: group.name,
      teacher_ids: updatedTeacherIds,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        duration: 1000,
        title: "Lecturer removed",
        description: "Teacher removed from evaluation committee group successfully.",
      });
      onDelete();
      onOpenChange(false);
    }

    if (isError) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error removing teacher",
        description: "An error occurred while removing the lecturer. Please try again.",
      });
    }
  }, [isSuccess, isError, onOpenChange, onDelete, toast]);

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove Lecturer from Evaluation Committee Group"
      danger
      cancelButton
      okButton={{
        label: "Confirm Removal",
        onClick: handleDelete,
        isLoading,
      }}
      confirmText="This action cannot be undone. The selected lecturer will be removed from the evaluation committee group."
    >
      {`Are you sure you want to remove this lecturer from the "${group.name}" group?`}
    </ActionDialog>
  );
};

export default DeleteTeacherDialog;
