import EmptyResources from "@/components/common/empty-resource";
import Planner from "@/components/planner/Planner";
import { Appointment, Resource } from "@/models";
import { RootState } from "@/store";
import { useGetScheduleReviewsQuery } from "@/store/api/v1/endpoints/groups";
import { generateAppointments, generateResources } from "@/utils/fakeData";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const GroupCalendar = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

  const {
    data: scheduleReviews,
    error,
    isLoading,
  } = useGetScheduleReviewsQuery(
    {
      capstone_group_id: Number(groupId),
      start_time: currentSemester?.start_time.toString() || "",
      end_time: currentSemester?.end_time.toString() || "",
    },
    { skip: !currentSemester }
  );

  console.log(scheduleReviews || []);
  const [resources, setResources] = useState<Resource[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const initResources = generateResources(1);
    const initAppointments = generateAppointments(5, initResources);
    setResources(initResources);
    setAppointments(initAppointments);
  }, []);
  return (
    <>
      {true ? (
        <Planner
          initialResources={resources}
          initialAppointments={appointments}
        />
      ) : (
        <EmptyResources
          title="Empty Schedule Review"
          content="There is no schedule review in this semester"
        />
      )}
    </>
  );
};

export default GroupCalendar;
