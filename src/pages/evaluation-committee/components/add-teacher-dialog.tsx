import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateEvaluationMutation } from "@/store/api/v1/endpoints/evaluations";
import { UpdateEvaluationGroup } from "@/types/evaluation";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"

const AddTeacherDialog: React.FC<{
  group: UpdateEvaluationGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}> = ({ group, open, onOpenChange, onAdd }) => {
  const { toast } = useToast();
  const [updateEvaluationCommitteeMutation, { isSuccess, isError, isLoading }] = useUpdateEvaluationMutation();
  const [newTeacherId, setNewTeacherId] = useState<number | null>(null);

  const handleAdd = async () => {
    if (newTeacherId === null) {
      toast({
        duration: 2000,
        title: "Invalid Teacher",
        description: "Please select a valid teacher to add.",
      });
      return;
    }

    const updatedTeacherIds = [...group.teacher_ids, newTeacherId];
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
        title: "Teacher added",
        description: "Teacher added to evaluation committee group successfully.",
      });
      onAdd();
      onOpenChange(false);
    }

    if (isError) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error adding teacher",
        description: "An error occurred while adding the teacher. Please try again.",
      });
    }
  }, [isSuccess, isError, onOpenChange, onAdd, toast]);

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Teacher to Evaluation Committee Group"
      cancelButton
      okButton={{
        label: "Confirm Addition",
        onClick: handleAdd,
        isLoading,
      }}
    >
      <Input
        type="string"
        placeholder="Enter Teacher ID"
        value={newTeacherId ?? ""}
        onChange={(e) => setNewTeacherId(Number(e.target.value))}
      />
    </ActionDialog>
  );
};

export default AddTeacherDialog;
