import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";

type GroupCommitee = {
  id: number;
  name: string;
  memberCount: number;
};

const groupCommitee: GroupCommitee[] = [
  { id: 1, name: "SE1", memberCount: 2 },
  { id: 2, name: "SE2", memberCount: 3 },
  { id: 3, name: "SE3", memberCount: 3 },
];

const EvaluationCommittee: React.FC = () => {

  return (
    <div>

      <SettingCard title={`Evaluation Group (${groupCommitee.length})`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Member Count</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupCommitee.map((groupCommitee) => (
              <TableRow key={groupCommitee.id}>
                <TableCell>{groupCommitee.name}</TableCell>
                <TableCell>{groupCommitee.memberCount}</TableCell>
                <TableCell>
                  <ActionCell
                    items={[
                      {
                        item: "View Details",
                        onClick: () => {
                          console.log(`Viewing details for ${groupCommitee.name}`);
                        },
                      },
                      {
                        item: "Edit",
                        onClick: () => {
                          console.log(`Editing group ${groupCommitee.name}`);
                        },
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingCard>
    </div>
  );
};

export default EvaluationCommittee;
