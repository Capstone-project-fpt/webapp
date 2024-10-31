import { Badge } from "@/components/ui/badge";
import { TopicReviewStatus } from "@/types/group";

type BadgeVariant = "success" | "info" | "destructive" | "outline";

const ReviewStatus: React.FC<{ status: TopicReviewStatus | string }> = ({
  status,
}) => {
  let variant: BadgeVariant;
  switch (status) {
    case TopicReviewStatus.Approved:
      variant = "success";
      break;
    case TopicReviewStatus.Reviewing:
      variant = "info";
      break;
    case TopicReviewStatus.Rejected:
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
};

export default ReviewStatus;
