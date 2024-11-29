import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpdateEvaluationMutation } from "@/store/api/v1/endpoints/evaluations";
import { UpdateEvaluationGroup } from "@/types/evaluation";
import React, { useEffect, useState } from "react";
import { Member, OptionType } from "../type";
import SelectLecture from "./select-lecture";
import { ResponseErrorType } from "@/types";

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
    try {
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
      const updateData = await updateEvaluationCommitteeMutation({
        id: group.id,
        name: group.name,
        teacher_ids: updatedTeacherIds,
        assign_group_ids: group.assign_group_ids,
      }).unwrap();
      toast({
        duration: 1000,
        title: "Lecturer Added",
        description:
          updateData.data ||
          "Lecturer successfully added to the evaluation committee group.",
      });
      setSelectedLecture(null);
      onAdd();
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error Adding Lecturer",
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
