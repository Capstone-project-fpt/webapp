import { ScheduleType } from "@/types/schedule";
import { CalendarConfig } from "@schedule-x/calendar";
import dayjs from "dayjs";

export const getDateTime = (date: Date) => {
  if (date) {
    const format = "YYYY-MM-DD HH:mm"
    return dayjs(date).format(format)
  }
  return "";
}


export const parseSchedulesToCalendarEvents = (schedules: ScheduleType[]): CalendarConfig["events"] => {
  const groupSchedules = (schedules || []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    start: getDateTime(item.start_time),
    end: getDateTime(item.end_time),
  }));
  return groupSchedules;
}
