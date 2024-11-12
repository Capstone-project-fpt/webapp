import { Button } from "@/components/ui/button";
import GroupCalendar from "@/pages/groups/components/group-calendar";
import { GoPlus } from "react-icons/go";
import { Link, useParams } from "react-router-dom";

const Calendar = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  return (
    <div>
      <div className="flex justify-end mb-2">
        <Link to={`/evaluation-committees/${evaluationId}/calendar/create`}>
          <Button variant="outline">
            <GoPlus className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    <GroupCalendar/>
    </div>
  );


};

export default Calendar;
