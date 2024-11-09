import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import Schedule from "@/pages/schedule";
import CreateReviewSchedule from "@/pages/schedule/create-schedule";
import { RouteObject } from "react-router-dom";

const ScheduleRoutes: RouteObject[] = [
  {
    path: "/schedule",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Schedule/>,
      },
      {
        path: ":evaluationId",
        element: <CreateReviewSchedule/>
      }
    ]
  }
];

export default ScheduleRoutes;
