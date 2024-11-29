import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpdateEvaluationMutation } from "@/store/api/v1/endpoints/evaluations";
import { UpdateEvaluationGroup } from "@/types/evaluation";
import React, { useEffect, useState } from "react";
import { Member, OptionType } from "../type";
import SelectLecture from "./select-lecture";

const AddTeacherDialog: React.FC<{
  group: UpdateEvaluationGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}> = ({ group, open, onOpenChange, onAdd }) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [updateEvaluationCommitteeMutation, { isSuccess, isError, isLoading }] =
    useUpdateEvaluationMutation();
  const [selectedLecture, setSelectedLecture] = useState<OptionType | null>(
    null
  );

  const handleAdd = async () => {
    if (!selectedLecture || !selectedLecture.value.extra_info.teacher) {
      toast({
        duration: 2000,
        title: "Invalid Lecturer",
        description: "Please select a valid lecturer to add.",
      });
      return;
    }

    const updatedTeacherIds = [
      ...group.teacher_ids,
      selectedLecture.value.extra_info.teacher.teacher_id,
    ];
    await updateEvaluationCommitteeMutation({
      id: group.id,
      name: group.name,
      teacher_ids: updatedTeacherIds,
      assign_group_ids: group.assign_group_ids,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        duration: 1000,
        title: "Lecturer Added",
        description:
          "Lecturer successfully added to the evaluation committee group.",
      });
      setSelectedLecture(null);
      onAdd();
      onOpenChange(false);
    }

    if (isError) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error Adding Lecturer",
        description:
          "An error occurred while adding the lecturer. Please try again.",
      });
    }
  }, [isSuccess, isError, onOpenChange, onAdd, toast]);

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Lecturer to Evaluation Committee Group"
      cancelButton
      okButton={{
        label: "Confirm Addition",
        onClick: handleAdd,
        isLoading,
      }}
    >
      <div>
        <label>Select Lecturer</label>
        <SelectLecture
          value={selectedLecture}
          onChangeValue={setSelectedLecture}
          selectedMembers={members}
          // existingGroupMembers={group.teacher_ids}
        />
      </div>
    </ActionDialog>
  );
};

export default AddTeacherDialog;
