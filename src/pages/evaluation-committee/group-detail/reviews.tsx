import { LoadingTableLottie } from "@/components";
import DateDisplay from "@/components/common/date";
import EmptyResources from "@/components/common/empty-resource";
import { ReviewStatusBadge } from "@/components/common/status-badge";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RootState } from "@/store";
import { useGetSchedulesQuery } from "@/store/api/v1/endpoints/evaluations";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreateScheduleDialog from "../components/create-schedule-dialog";
import { getStatus } from "@/lib/schedule-review";
import { ScheduleStatus, ScheduleType } from "@/types/schedule";

const ReviewsTable: React.FC<{ reviews: ScheduleType[]; title: string }> = ({
  reviews = [],
  title,
}) => {
  const navigate = useNavigate();

  return (
    <SettingCard title={`${title} (${reviews.length})`}>
      <div className="flex flex-col gap-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Start time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length > 0 && (
              <>
                {reviews.map((scheduleReview) => (
                  <TableRow>
                    <TableCell>{scheduleReview.title}</TableCell>
                    <TableCell>
                      {scheduleReview.capstone_group.name_group}
                    </TableCell>
                    <TableCell>
                      <DateDisplay
                        date={new Date(scheduleReview.start_time)}
                        showTime={true}
                      />
                    </TableCell>
                    <TableCell>
                      <ReviewStatusBadge
                        status={getStatus(scheduleReview)}
                      ></ReviewStatusBadge>
                    </TableCell>
                    <ActionCell
                      items={[
                        {
                          item: "View details",
                          onClick: () => {
                            navigate(
                              `/groups/${scheduleReview.capstone_group.id}/reviews/${scheduleReview.capstone_group_review.id}`
                            );
                          },
                        },
                      ]}
                    ></ActionCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
        {!reviews.length && (
          <EmptyResources
            shape="empty-task"
            title={`Empty ${title} Review`}
            content="There is no review yet"
          />
        )}
      </div>
    </SettingCard>
  );
};

const Reviews = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();

  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

  const {
    data: scheduleReviewsData,
    isLoading,
    isError,
  } = useGetSchedulesQuery(
    {
      evaluation_committee_id: Number(evaluationId),
      start_time: currentSemester?.start_time.toString() || "",
      end_time: currentSemester?.end_time.toString() || "",
    },
    { skip: !currentSemester }
  );

  const scheduleReviews = scheduleReviewsData?.data || [];

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorBoundaryComponent />;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end mb-2">
        <CreateScheduleDialog />
      </div>
      <ReviewsTable
        title="Reviewing"
        reviews={scheduleReviews.filter(
          (review) => getStatus(review) === ScheduleStatus.Reviewing
        )}
      />
      <ReviewsTable
        title="In Progress"
        reviews={scheduleReviews.filter(
          (review) => getStatus(review) === ScheduleStatus.InProgress
        )}
      />
      <ReviewsTable
        title="Incoming"
        reviews={scheduleReviews.filter(
          (review) => getStatus(review) === ScheduleStatus.Incoming
        )}
      />
      <ReviewsTable
        title="Archived"
        reviews={scheduleReviews.filter(
          (review) => getStatus(review) === ScheduleStatus.Archived
        )}
      />
    </div>
  );
};

export default Reviews;
