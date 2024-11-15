import ScheduleCalendar from "@/components/common/schedule-calendar";
import { SettingCard } from "@/components/custom/setting";
import { getDateTime } from "@/lib/utils";
import { RootState } from "@/store";
import { useGetGroupScheduleReviewsQuery } from "@/store/api/v1/endpoints/groups";
import { CalendarConfig } from "@schedule-x/calendar";
import React, { useEffect, useState } from "react";
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
      const groupSchedules = scheduleReviews.data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        start: getDateTime(item.start_time),
        end: getDateTime(item.end_time),
      }));
      setSchedules(groupSchedules);
    }
  }, [scheduleReviews]);
  return <ScheduleCalendar events={schedules} />;
};

export default Calendar;
