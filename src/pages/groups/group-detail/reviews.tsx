import { LoadingTableLottie } from "@/components";
import DateDisplay from "@/components/common/date";
import EmptyResources from "@/components/common/empty-resource";
import ScheduleCalendar from "@/components/common/schedule-calendar";
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
import {
  getStatus,
  parseSchedulesToCalendarEvents,
} from "@/lib/schedule-review";
import { RootState } from "@/store";
import { useGetGroupScheduleReviewsQuery } from "@/store/api/v1/endpoints/groups";
import { CalendarConfig } from "@schedule-x/calendar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Calendar = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester,
  );

  const { data: scheduleReviews } = useGetGroupScheduleReviewsQuery(
    {
      capstone_group_id: Number(groupId),
      start_time: currentSemester?.start_time.toString() || "",
      end_time: currentSemester?.end_time.toString() || "",
    },
    { skip: !currentSemester },
  );

  const [schedules, setSchedules] = useState<CalendarConfig["events"]>([]);

  useEffect(() => {
    if (scheduleReviews && scheduleReviews.data) {
      const groupSchedules = parseSchedulesToCalendarEvents(
        scheduleReviews.data,
      );
      setSchedules(groupSchedules);
    }
  }, [scheduleReviews]);
  return <ScheduleCalendar events={schedules} />;
};

const Reviews = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester,
  );

  const {
    data: scheduleReviewsData,
    isLoading,
    isError,
  } = useGetGroupScheduleReviewsQuery(
    {
      capstone_group_id: Number(groupId),
      start_time: currentSemester?.start_time.toString() || "",
      end_time: currentSemester?.end_time.toString() || "",
    },
    { skip: !currentSemester },
  );
  const scheduleReviews = scheduleReviewsData?.data || [];
  const navigate = useNavigate();

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
    <div className="flex flex-col gap-5">
      <SettingCard title="Reviews">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Evaluation</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleReviews && scheduleReviews.length > 0 && (
              <>
                {scheduleReviews.map((scheduleReview) => (
                  <TableRow>
                    <TableCell>{scheduleReview.title}</TableCell>
                    <TableCell>
                      {scheduleReview.evaluation_committee.name}
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
                              `./${scheduleReview.capstone_group_review.id}`,
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
        {(!scheduleReviews || !scheduleReviews.length) && (
          <EmptyResources title="Empty Review" content="There is no review" />
        )}
      </SettingCard>
      <SettingCard title="Calendar">
        <div className="calendar-no-border">
          <Calendar />
        </div>
      </SettingCard>
    </div>
  );
};

export default Reviews;
