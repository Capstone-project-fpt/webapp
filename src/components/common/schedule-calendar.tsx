import {
  CalendarConfig,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";
import { useEffect } from "react";
import "@schedule-x/theme-default/dist/index.css";

const ScheduleCalendar = ({
  events = [],
}: {
  events: CalendarConfig["events"];
}) => {
  const plugins = [
    createEventsServicePlugin(),
    createEventModalPlugin(),
    createCurrentTimePlugin(),
    createScrollControllerPlugin({ initialScroll: "07:50" }),
  ];

  const calendar = useCalendarApp(
    {
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events: events,
    },
    plugins
  );

  useEffect(() => {
    calendar.eventsService.set(events);
  }, [calendar, events]);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default ScheduleCalendar;
