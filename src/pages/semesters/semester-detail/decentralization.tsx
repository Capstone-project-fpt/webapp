import SubMajor from "@/components/common/major";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberEvaluationGroup } from "@/types/evaluation";
import React, { useState } from "react";

const LectureTable: React.FC<{
  members: MemberEvaluationGroup[];
}> = ({ members }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<number | null>(null);

  const openDeleteDialog = (teacherId: number) => {
    setIsAddModalOpen(teacherId);
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

const Decentralization = () => {
  return (
    <>
      <SettingCard title="Evaluation Topic">
        <LectureTable members={[]} />
      </SettingCard>
    </>
  );
};

export default Decentralization;
