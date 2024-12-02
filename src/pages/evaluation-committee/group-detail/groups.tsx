import { LoadingTableLottie } from "@/components";
import { useToast } from "@/hooks/use-toast";
import {
  useGetEvaluationQuery,
  useUpdateEvaluationMutation,
} from "@/store/api/v1/endpoints/evaluations";
import { OptionType, ResponseErrorType } from "@/types";
import { UpdateEvaluationGroup } from "@/types/evaluation";
import { GroupType } from "@/types/group";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectGroupStudent from "../components/select-student-group";
import { ActionDialog } from "@/components/custom/action-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionCell, TextCell } from "@/components/data-table";
import { GroupStatusBadge } from "@/components/common/status-badge";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { SettingCard } from "@/components/custom/setting";
import { Button } from "@/components/ui/button";
import EmptyResources from "@/components/common/empty-resource";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserTypes } from "@/types/accounts";

const DeleteGroupDialog: React.FC<{
  group: UpdateEvaluationGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  onDelete: () => void;
}> = ({ group, open, onOpenChange, groupId, onDelete }) => {
  const { toast } = useToast();
  const [updateEvaluationCommitteeMutation, { isLoading }] =
    useUpdateEvaluationMutation();

  const handleDelete = async () => {
    try {
      const updatedGroupIds = group.assign_group_ids.filter(
        (id) => id !== groupId,
      );
      const res = await updateEvaluationCommitteeMutation({
        id: group.id,
        name: group.name,
        teacher_ids: group.teacher_ids,
        assign_group_ids: updatedGroupIds,
      }).unwrap();

      toast({
        duration: 3000,
        title: "Group removed",
        description:
          res.data ||
          "Group removed from evaluation committee group successfully.",
      });
      onDelete();
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Error removing Group",
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
      title="Remove Group from Evaluation Committee Group"
      danger
      cancelButton
      okButton={{
        label: "Confirm Removal",
        onClick: handleDelete,
        isLoading,
      }}
      confirmText="This action cannot be undone. The selected Group will be removed from the evaluation committee group."
    >
      {`Are you sure you want to remove this Group from the "${group.name}" group?`}
    </ActionDialog>
  );
};

const AddGroupDialog: React.FC<{
  group: UpdateEvaluationGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}> = ({ group, open, onOpenChange, onAdd }) => {
  const { toast } = useToast();
  const [updateEvaluationCommitteeMutation, { isLoading }] =
    useUpdateEvaluationMutation();
  const [selectedGroup, setSelectedGroup] =
    useState<OptionType<GroupType> | null>(null);

  const handleAdd = async () => {
    try {
      if (!selectedGroup || !selectedGroup.value) {
        toast({
          duration: 3000,
          title: "Invalid Group",
          description: "Please select a valid group.",
        });
        return;
      }

      const updatedGroupIds = [
        ...(group.assign_group_ids || []),
        selectedGroup.value.id,
      ];

      const res = await updateEvaluationCommitteeMutation({
        id: group.id,
        name: group.name,
        teacher_ids: group.teacher_ids,
        assign_group_ids: updatedGroupIds,
      }).unwrap();

      toast({
        duration: 3000,
        title: "Group Added",
        description: res.data || "Group has been added successfully.",
      });
      setSelectedGroup(null);
      onAdd();
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 3000,
        variant: "destructive",
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
      title="Assign Group"
      cancelButton
      okButton={{
        label: "Confirm",
        onClick: handleAdd,
        isLoading,
      }}
    >
      <div>
        <label>Select Group</label>
        <SelectGroupStudent
          value={selectedGroup}
          onChangeValue={setSelectedGroup}
          selectedGroups={group.assign_group_ids || []}
        />
      </div>
    </ActionDialog>
  );
};

const GroupTable: React.FC<{
  groups: GroupType[];
  groupInfo: UpdateEvaluationGroup;
  onDeleteMember: (groupId: number) => void;
}> = ({ groups, groupInfo, onDeleteMember }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupIdDelete, setGroupIdDelete] = useState<number | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const navigate = useNavigate();
  const openDeleteDialog = (groupId: number) => {
    setGroupIdDelete(groupId);
    setIsDeleteModalOpen(true);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <TableRow key={group.id}>
            <TableCell>
              <TextCell>
                <div>{group.name_group}</div>
              </TextCell>
            </TableCell>
            <TableCell>
              <GroupStatusBadge status={group.status} />
            </TableCell>
            <TableCell>
              <DeleteGroupDialog
                group={groupInfo}
                open={isDeleteModalOpen && groupIdDelete === group.id}
                onOpenChange={setIsDeleteModalOpen}
                groupId={group.id}
                onDelete={() => onDeleteMember(group.id)}
              />
              <ActionCell
                items={[
                  {
                    item: "View group",
                    onClick: () => {
                      navigate(`/groups/${group.id}`);
                    },
                  },
                  ...(currentUser?.common_info.user_type === UserTypes.ADMIN
                    ? [
                        {
                          item: "Delete",
                          danger: true,
                          onClick: () => openDeleteDialog(group.id),
                        },
                      ]
                    : []),
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const EvaluationCommittee = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const {
    data: committeeData,
    error,
    isLoading,
  } = useGetEvaluationQuery(
    { id: parseInt(evaluationId!) },
    { skip: !evaluationId },
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [groups, setGroups] = useState<GroupType[]>([]);
  const [groupInfo, setGroupInfo] = useState<UpdateEvaluationGroup | null>(
    null,
  );
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  useEffect(() => {
    if (committeeData && committeeData.data) {
      setGroups(committeeData.data.assign_groups || []);
      setGroupInfo({
        id: committeeData.data.id,
        name: committeeData.data.name,
        teacher_ids: committeeData.data.teachers.map((teacher) => teacher.id),
        assign_group_ids: (committeeData.data.assign_groups || []).map(
          (group) => group.id,
        ),
      });
    }
  }, [committeeData]);

  const handleAddTeacher = () => {
    setIsAddTeacherModalOpen(false);
  };

  const handleDeleteMember = (groupId: number) => {
    setGroups((prevMembers) =>
      prevMembers.filter((group) => group.id !== groupId),
    );

    if (groupInfo) {
      setGroupInfo({
        ...groupInfo,
        assign_group_ids: groupInfo.assign_group_ids?.filter(
          (id) => id !== groupId,
        ),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center pt-10">
        <div className="w-[250px]">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <ErrorBoundaryComponent />
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {groupInfo && (
        <AddGroupDialog
          group={groupInfo}
          open={isAddTeacherModalOpen}
          onOpenChange={setIsAddTeacherModalOpen}
          onAdd={handleAddTeacher}
        />
      )}
      <SettingCard
        title={`Assign Capstone Group ${
          groups.length ? `(${groups.length})` : ""
        }`}
        actions={
          currentUser?.common_info.user_type === UserTypes.ADMIN && (
            <Button onClick={() => setIsAddTeacherModalOpen(true)}>
              Assign capstone group
            </Button>
          )
        }
      >
        {groups && groups.length ? (
          <GroupTable
            groups={groups}
            groupInfo={groupInfo!}
            onDeleteMember={handleDeleteMember}
          />
        ) : (
          <EmptyResources
            title="No assigned capstone group"
            content="Your group does not have any assigned groups. Please assign a capstone group."
          />
        )}
      </SettingCard>
    </div>
  );
};

export default EvaluationCommittee;
