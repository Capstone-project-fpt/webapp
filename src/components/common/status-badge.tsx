import { GroupStatus } from "@/types/group";
import { Badge } from "../ui/badge";
import { ScheduleStatus } from "@/types/schedule";

export const GroupStatusBadge: React.FC<{ status: GroupStatus }> = ({
  status,
}) => {
  const statusData: {
    [key in GroupStatus]: {
      name: string;
      variant:
        | "default"
        | "warning"
        | "outline"
        | "info"
        | "secondary"
        | "success"
        | "destructive";
    };
  } = {
    [GroupStatus.InProgress]: { name: "In Progress", variant: "secondary" },
    [GroupStatus.ReviewingTopic]: {
      name: "Reviewing Topic",
      variant: "default",
    },
    [GroupStatus.FinalizedScore]: {
      name: "Finalized Score",
      variant: "outline",
    },
  };
  return (
    <Badge variant={statusData[status].variant}>
      {statusData[status].name}
    </Badge>
  );
};

export const ReviewStatusBadge: React.FC<{ status: ScheduleStatus }> = ({
  status,
}) => {
  const statusData: {
    [key in ScheduleStatus]: {
      name: string;
      variant:
        | "default"
        | "warning"
        | "outline"
        | "info"
        | "secondary"
        | "success"
        | "destructive";
    };
  } = {
    [ScheduleStatus.Archived]: {
      name: "Archived",
      variant: "default",
    },
    [ScheduleStatus.Reviewing]: {
      name: "Reviewing",
      variant: "warning",
    },
    [ScheduleStatus.InProgress]: {
      name: "In Progress",
      variant: "secondary",
    },
    [ScheduleStatus.Incoming]: {
      name: "Incoming",
      variant: "info",
    },
  };
  return (
    <Badge variant={statusData[status].variant}>
      {statusData[status].name}
    </Badge>
  );
};
