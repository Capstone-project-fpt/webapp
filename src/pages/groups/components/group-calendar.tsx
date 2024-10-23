import Planner from "@/components/planner/Planner";
import { Appointment, Resource } from "@/models";
import { generateAppointments, generateResources } from "@/utils/fakeData";
import { useEffect, useState } from "react";

const GroupCalendar = () => {
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
      {appointments.length > 0 && (
        <Planner
          initialResources={resources}
          initialAppointments={appointments}
        />
      )}
    </>
  );
};

export default GroupCalendar;
