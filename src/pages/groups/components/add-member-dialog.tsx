import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUpdateMembersMutation } from "@/store/api/v1/endpoints/groups";
import { ResponseErrorType } from "@/types";
import { UserTypes } from "@/types/accounts";
import { GroupMember } from "@/types/group";
import React, { useState } from "react";
import { Member, OptionType } from "../type";
import SelectStudent from "./select-student";

const AddMemberDialog: React.FC<{
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: () => void;
  selectedMembers: GroupMember[];
}> = ({ groupId, open, onOpenChange, onAddMember, selectedMembers }) => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<OptionType | null>(
    null
  );
  const selectedStudents: Member[] = (selectedMembers || []).map((member) => ({
    studentId: member.id,
    id: member.user_id,
    name: member.name,
    email: member.email,
    phone_number: member.phone_number,
    user_id: member.user_id,
    user_type: member.user_type as UserTypes,
    sub_major_id: member.sub_major_id,
  }));

  const [updateMembersMutation, { isLoading }] = useUpdateMembersMutation();

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
        duration: 3000,
        title: "Member Added",
        description: "Student successfully added to the group.",
      });

      setSelectedStudent(null);
      onAddMember();
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 3000,
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
        variant: "destructive",
        title: "Error Adding Student",
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
          selectedMembers={selectedStudents}
        />
      </div>
    </ActionDialog>
  );
};

export default AddMemberDialog;
