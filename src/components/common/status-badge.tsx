import { GroupStatus } from "@/types/group";
import { Badge } from "../ui/badge";

export const GroupStatusBadge: React.FC<{ status: GroupStatus }> = ({
  status,
}) => {
  const statusName = {
    [GroupStatus.InProgress]: "In Progress",
    [GroupStatus.ReviewingTopic]: "Reviewing Topic",
  };
  return (
    <Badge
      variant={status === GroupStatus.InProgress ? "secondary" : "outline"}
    >
      {statusName[status]}
    </Badge>
  );
};

export const ReviewStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return <Badge>{status}</Badge>;
};
