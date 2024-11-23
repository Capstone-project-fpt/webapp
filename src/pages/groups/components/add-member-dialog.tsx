import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateMembersMutation } from "@/store/api/v1/endpoints/groups";
import React, { useState } from "react";
import { Member, OptionType } from "../type";
import SelectStudent from "./select-student";

const AddMemberDialog: React.FC<{
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: () => void;
  selectedMembers: Member[];
}> = ({ groupId, open, onOpenChange, onAddMember, selectedMembers }) => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<OptionType | null>(null);
  const [updateMembersMutation, { isSuccess, isError, isLoading }] =
    useUpdateMembersMutation();

  const handleAddMember = async () => {
    if (!selectedStudent || !selectedStudent.value.extra_info.student) {
      toast({
        duration: 2000,
        title: "Invalid Student",
        description: "Please select a valid student to add.",
      });
      return;
    }

    const newStudentId = selectedStudent.value.extra_info.student.student_id;

    try {
      await updateMembersMutation({
        group_id: groupId,
        student_ids: [newStudentId],
      }).unwrap();

      toast({
        duration: 1000,
        title: "Member Added",
        description: "Student successfully added to the group.",
      });

      setSelectedStudent(null);
      onAddMember();
      onOpenChange(false);
    } catch {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error Adding Student",
        description: "An error occurred while adding the student. Please try again.",
      });
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Student to Group"
      cancelButton
      okButton={{
        label: "Confirm Addition",
        onClick: handleAddMember,
        isLoading,
      }}
    >
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Student
        </label>
        <SelectStudent
          value={selectedStudent}
          onChangeValue={setSelectedStudent}
          selectedMembers={selectedMembers}
        />
      </div>
    </ActionDialog>
  );
};

export default AddMemberDialog;
