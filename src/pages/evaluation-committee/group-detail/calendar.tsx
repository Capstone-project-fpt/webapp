import GroupCalendar from "@/pages/groups/components/group-calendar";
import { useParams } from "react-router-dom";
import CreateScheduleDialog from "../components/create-schedule-dialog";

const Calendar = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  return (
    <div>
      <div className="flex justify-end mb-2">
        <CreateScheduleDialog />
      </div>
      <GroupCalendar />
    </div>
  );
};

export default Calendar;
