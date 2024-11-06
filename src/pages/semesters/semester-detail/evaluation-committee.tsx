import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; 
import React from "react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";

type GroupCommittee = {
  id: number;
  name: string;
  memberCount: number;
};

const groupCommittee: GroupCommittee[] = [
  { id: 1, name: "SE1", memberCount: 2 },
  { id: 2, name: "SE2", memberCount: 3 },
  { id: 3, name: "SE3", memberCount: 3 },
];

const EvaluationCommittee: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <SettingCard title={`Evaluation Group (${groupCommittee.length})`}>
      <Button
          variant="outline"
          className="h-8 w-8 p-0 ml-auto"
          onClick={() => navigate("/evaluation-committees/create")}
        >
          <GoPlus className="h-4 w-4" />
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Member Count</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupCommittee.map((groupCommittee) => (
              <TableRow key={groupCommittee.id}>
                <TableCell>{groupCommittee.name}</TableCell>
                <TableCell>{groupCommittee.memberCount}</TableCell>
                <TableCell>
                  <ActionCell
                    items={[
                      {
                        item: "View Details",
                        onClick: () => {
                          console.log(
                            `Viewing details for ${groupCommittee.name}`
                          );
                        },
                      },
                      {
                        item: "Edit",
                        onClick: () => {
                          console.log(`Editing group ${groupCommittee.name}`);
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
