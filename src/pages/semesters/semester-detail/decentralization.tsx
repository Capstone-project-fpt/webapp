import SubMajor from "@/components/common/major";
import { ActionDialog } from "@/components/custom/action-dialog";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import SelectLecture from "@/pages/evaluation-committee/components/select-lecture";
import { OptionType, ResponseErrorType } from "@/types";
import { LectureType } from "@/types/accounts";
import { MemberEvaluationGroup } from "@/types/evaluation";
import React, { useState } from "react";

const DeleteTeacherDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
}> = ({ open, onOpenChange, teacherId }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const res = {
        data: "Teacher removed from evaluation topic successfully.",
      };

      toast({
        duration: 1000,
        title: "Lecturer removed",
        description:
          res.data || "Teacher removed from evaluation topic successfully.",
      });
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
      title="Remove Lecturer from Evaluation topic"
      danger
      cancelButton
      okButton={{
        label: "Confirm Removal",
        onClick: handleDelete,
        isLoading: false,
      }}
      confirmText="This action cannot be undone. The selected lecturer will be removed from the evaluation topic."
    >
      {`Are you sure you want to remove this lecturer?`}
    </ActionDialog>
  );
};

const AddTeacherDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const handleAdd = async () => {
    onOpenChange(false);
  };
  const [selectedLecture, setSelectedLecture] = useState<OptionType | null>(
    null
  );
  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Lecturer to Evaluation Committee Group"
      cancelButton
      okButton={{
        label: "Confirm Addition",
        onClick: handleAdd,
        isLoading: false,
      }}
    >
      <div>
        <label>Select Lecturer</label>
        <SelectLecture
          value={selectedLecture}
          onChangeValue={setSelectedLecture}
          selectedMembers={[]}
          // existingGroupMembers={group.teacher_ids}
        />
      </div>
    </ActionDialog>
  );
};

const Decentralization: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<number | null>(null);

  const members: [] = [];
  const openDeleteDialog = (teacherId: number) => {
    setIsAddModalOpen(teacherId);
    setIsDeleteModalOpen(true);
  };
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  return (
    <>
      <AddTeacherDialog
        open={isAddTeacherModalOpen}
        onOpenChange={setIsAddTeacherModalOpen}
      />
      <SettingCard
        title="Evaluation Topic"
        actions={
          <Button onClick={() => setIsAddTeacherModalOpen(true)}>
            Add Lecturer
          </Button>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member: MemberEvaluationGroup) => (
              <TableRow key={member.id}>
                <TableCell className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&size=32`}
                      alt={member.name}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{member.name}</p>
                  </div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone_number}</TableCell>
                <TableCell>
                  <SubMajor id={member.sub_major_id} />
                </TableCell>
                <TableCell>
                  <DeleteTeacherDialog
                    open={isDeleteModalOpen && isAddModalOpen === member.id}
                    onOpenChange={setIsDeleteModalOpen}
                    teacherId={member.id}
                  />
                  <ActionCell
                    items={[
                      {
                        item: "Delete",
                        danger: true,
                        onClick: () => openDeleteDialog(member.id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingCard>
    </>
  );
};

export default Decentralization;
