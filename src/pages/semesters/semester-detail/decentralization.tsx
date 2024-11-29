import { LoadingTableLottie } from "@/components";
import EmptyResources from "@/components/common/empty-resource";
import { ActionDialog } from "@/components/custom/action-dialog";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
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
import {
  useAssignTopicVerifierMutation,
  useGetTopicVerifiersQuery,
  useRemoveTopicVerifierMutation,
} from "@/store/api/v1/endpoints/admin";
import { OptionType, ResponseErrorType } from "@/types";
import { UserItem } from "@/types/accounts";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SelectLecture from "../components/select-lecture";

const DeleteTeacherDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
  semesterId: number;
}> = ({ open, onOpenChange, teacherId, semesterId }) => {
  const { toast } = useToast();
  const [deleteTopicVerifier, { isLoading }] = useRemoveTopicVerifierMutation();

  const handleDelete = async () => {
    try {
      const res = await deleteTopicVerifier({
        teacher_id: teacherId,
        semester_id: semesterId,
      }).unwrap();

      toast({
        duration: 1000,
        title: "Delete lecturer from evaluation topic",
        description:
          res.data || "Teacher removed from evaluation topic successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Delete lecturer from evaluation topic",
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
        isLoading,
      }}
      confirmText="This action cannot be undone. The selected lecturer will be removed from the evaluation topic."
    >
      {`Are you sure you want to remove this lecturer?`}
    </ActionDialog>
  );
};

const AddTeacherDialog: React.FC<{
  semesterId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ semesterId, open, onOpenChange }) => {
  const { toast } = useToast();
  const [assignTopicVerifier, { isLoading }] = useAssignTopicVerifierMutation();
  const [selectedLecture, setSelectedLecture] =
    useState<OptionType<UserItem> | null>(null);

  const handleAdd = async () => {
    if (selectedLecture && selectedLecture.value.extra_info.teacher) {
      try {
        const assignData = await assignTopicVerifier({
          semester_id: semesterId,
          teacher_id: selectedLecture.value.extra_info.teacher.teacher_id,
        }).unwrap();
        toast({
          title: "Lecturer added",
          description: assignData.data || "Lecturer added successfully",
        });
        onOpenChange(false);
      } catch (error) {
        toast({
          duration: 1000,
          variant: "destructive",
          title: "Error assign lecturer to verification topic",
          description:
            (error as ResponseErrorType)?.data?.error ||
            "Something went wrong, please try again. If the problem persists, please contact the administrator",
        });
      }
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Lecturer to verification topic"
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
          selectedMembers={[]}
        />
      </div>
    </ActionDialog>
  );
};

const Decentralization: React.FC = () => {
  const { semesterId } = useParams<{ semesterId: string }>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<number | null>(null);

  const {
    data: queryData,
    error,
    isLoading,
  } = useGetTopicVerifiersQuery({ semester_id: Number(semesterId!) });
  const openDeleteDialog = (teacherId: number) => {
    setIsAddModalOpen(teacherId);
    setIsDeleteModalOpen(true);
  };
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10 p-5">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorBoundaryComponent />;
  }
  return (
    <>
      <AddTeacherDialog
        semesterId={Number(semesterId)}
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
        {!queryData || !queryData.data || !queryData.data.length ? (
          <div>
            <EmptyResources title="No topic verifier yet"></EmptyResources>
          </div>
        ) : (
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
              {queryData.data.map((member) => (
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
                  <TableCell>{/* <SubMajor id={member} /> */}</TableCell>
                  <TableCell>
                    <DeleteTeacherDialog
                      open={isDeleteModalOpen && isAddModalOpen === member.id}
                      onOpenChange={setIsDeleteModalOpen}
                      teacherId={member.id}
                      semesterId={Number(semesterId)}
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
        )}
      </SettingCard>
    </>
  );
};

export default Decentralization;
