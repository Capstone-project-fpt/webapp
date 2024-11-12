import EmptyResources from "@/components/common/empty-resource";
import { ReviewStatusBadge } from "@/components/common/status-badge";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell, DateCell } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useNavigate } from "react-router";

const ReviewTable: React.FC = () => {
  const reviews = [];
  const navigate = useNavigate();
  return (
    <SettingCard title="Reviews" actions={<Button>Create Review</Button>}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Review 1</TableCell>
            <TableCell>
              <DateCell date={new Date()}></DateCell>
            </TableCell>
            <TableCell>
              <ReviewStatusBadge status="test"></ReviewStatusBadge>
            </TableCell>
            <ActionCell
              items={[
                {
                  item: "View detail",
                  onClick: () => {
                    navigate('./1');
                  },
                },
              ]}
            ></ActionCell>
          </TableRow>
        </TableBody>
      </Table>
      <EmptyResources title="Empty Review" content="There is no review" />
    </SettingCard>
  );
};

export default ReviewTable;
