import { SettingCard } from "@/components/custom/setting";
import ReviewTable from "../components/review-table";

import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect } from "react";

function CalendarApp() {
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
      events: [
        {
          id: "1",
          title: "Event 1",
          start: "2024-11-12",
          end: "2024-11-12",
        },
        {
          id: "2",
          title: "Event 2",
          description: "Description of event 2",
          people: ["John Doe", "Jane Doe"],
          start: "2024-11-12 20:15",
          end: "2024-11-12 21:15",
        },
      ],
    },
    plugins
  );

  useEffect(() => {
    // get all events
    calendar.eventsService.getAll();
  }, [calendar]);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

const Reviews = () => {
  return (
    <div className="flex flex-col gap-5">
      <ReviewTable></ReviewTable>
      <SettingCard title="Calendar">
        <CalendarApp />
      </SettingCard>
    </div>
  );
};

export default Reviews;
