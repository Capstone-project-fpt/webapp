import ScheduleCalendar from "@/components/common/schedule-calendar";
import { parseSchedulesToCalendarEvents } from "@/lib/schedule-review";
import { RootState } from "@/store";
import { useGetGroupScheduleReviewsQuery } from "@/store/api/v1/endpoints/groups";
import { CalendarConfig } from "@schedule-x/calendar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Calendar = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

  const { data: scheduleReviews } = useGetGroupScheduleReviewsQuery(
    {
      capstone_group_id: Number(groupId),
      start_time: currentSemester?.start_time.toString() || "",
      end_time: currentSemester?.end_time.toString() || "",
    },
    { skip: !currentSemester }
  );

  const [schedules, setSchedules] = useState<CalendarConfig["events"]>([]);

  useEffect(() => {
    if (scheduleReviews && scheduleReviews.data) {
      const groupSchedules = parseSchedulesToCalendarEvents(
        scheduleReviews.data
      );
      setSchedules(groupSchedules);
    }
  }, [scheduleReviews]);
  return <ScheduleCalendar events={schedules} />;
};

export default Calendar;
