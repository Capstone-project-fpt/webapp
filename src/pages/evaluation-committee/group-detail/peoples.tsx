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
import { MemberEvaluationGroup } from "@/types/evaluation";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MemberTable: React.FC<{ members: MemberEvaluationGroup[] }> = ({ members }) => (
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
            <ActionCell
              items={[
                {
                  item: "Remove",
                  onClick: () => {},
                },
              ]}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const EvaluationCommittee = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const { data: committeeData, error, isLoading } = useGetEvaluationQuery(
    { id: parseInt(evaluationId!) },
    { skip: !evaluationId }
  );
  const [members, setMembers] = useState<MemberEvaluationGroup[]>([]);

  useEffect(() => {
    if (committeeData && committeeData.data.teachers) {
      setMembers(committeeData.data.teachers);
    }
  }, [committeeData]);

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
      <SettingCard title={`Teachers (${members.length})`}>
        <MemberTable members={members} />
      </SettingCard>
    </div>
  );
};

export default EvaluationCommittee;
