import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpdateEvaluationMutation } from "@/store/api/v1/endpoints/evaluations";
import { ResponseErrorType } from "@/types";
import { UpdateEvaluationGroup } from "@/types/evaluation";
import React from "react";

const DeleteTeacherDialog: React.FC<{
  group: UpdateEvaluationGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
  onDelete: () => void;
}> = ({ group, open, onOpenChange, teacherId, onDelete }) => {
  const { toast } = useToast();
  const [updateEvaluationCommitteeMutation, { isLoading }] =
    useUpdateEvaluationMutation();

  const handleDelete = async () => {
    try {
      if (group.teacher_ids.length <= 2) {
        toast({
          duration: 2000,
          variant: "destructive",
          title: "Delete lecturer from evaluation committee group",
          description: "The evaluation committee must have at least 2 members",
        });
        return;
      }

      const updatedTeacherIds = group.teacher_ids.filter(
        (id) => id !== teacherId
      );

      const res = await updateEvaluationCommitteeMutation({
        id: group.id,
        name: group.name,
        teacher_ids: updatedTeacherIds,
        assign_group_ids: group.assign_group_ids,
      }).unwrap();

      toast({
        duration: 1000,
        title: "Delete lecturer from evaluation committee group",
        description:
          res.data ||
          "Teacher removed from evaluation committee group successfully.",
      });
      onDelete();
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error removing teacher",
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator",
      });
    }
  };

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
