import { LoadingTableLottie } from "@/components";
import SubMajor from "@/components/common/major";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetEvaluationQuery } from "@/store/api/v1/endpoints/evaluations";
import { MemberEvaluationGroup, UpdateEvaluationGroup } from "@/types/evaluation";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteTeacherDialog from "@/pages/evaluation-committee/components/delete-teacher-dialog";

const MemberTable: React.FC<{
  members: MemberEvaluationGroup[];
  groupInfo: UpdateEvaluationGroup;
  onDeleteMember: (teacherId: number) => void;
}> = ({ members, groupInfo, onDeleteMember }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  const openDeleteDialog = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
    setIsDeleteModalOpen(true);
  };

  return (
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
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=32`}
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
                group={groupInfo}
                open={isDeleteModalOpen && selectedTeacherId === member.id}
                onOpenChange={setIsDeleteModalOpen}
                teacherId={member.id}
                onDelete={() => onDeleteMember(member.id)}
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
  );
};

const EvaluationCommittee = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const { data: committeeData, error, isLoading } = useGetEvaluationQuery(
    { id: parseInt(evaluationId!) },
    { skip: !evaluationId }
  );
  const [members, setMembers] = useState<MemberEvaluationGroup[]>([]);
  const [groupInfo, setGroupInfo] = useState<UpdateEvaluationGroup | null>(null);

  useEffect(() => {
    if (committeeData && committeeData.data) {
      setMembers(committeeData.data.teachers);
      setGroupInfo({
        id: committeeData.data.id,
        name: committeeData.data.name,
        teacher_ids: committeeData.data.teachers.map((teacher) => teacher.id),
      });
    }
  }, [committeeData]);

  const handleDeleteMember = (teacherId: number) => {
    setMembers((prevMembers) => prevMembers.filter(member => member.id !== teacherId));

    if (groupInfo) {
      setGroupInfo({
        ...groupInfo,
        teacher_ids: groupInfo.teacher_ids.filter(id => id !== teacherId),
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
        <SettingCard title={`Teachers (${members.length})`}>
          <MemberTable
            members={members}
            groupInfo={groupInfo}
            onDeleteMember={handleDeleteMember}
          />
        </SettingCard>
      )}
    </div>
  );
};


export default EvaluationCommittee;
