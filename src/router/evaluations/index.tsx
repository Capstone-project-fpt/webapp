import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import EvaluationCommittee from "@/pages/evaluation-committee";
import CreateEvaluationGroup from "@/pages/evaluation-committee/create-group";
import CreateReviewSchedule from "@/pages/evaluation-committee/create-schedule";
import EvaluationDetail from "@/pages/evaluation-committee/group-detail";

import { RouteObject } from "react-router-dom";
import { Calendar } from "tabler-icons-react";

const EvaluationRoutes: RouteObject[] = [
  {
    path: "/evaluation-committees",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <EvaluationCommittee/>,
      },
      {
        path: "create",
        element: <CreateEvaluationGroup/>
      },
      {
        path: ":evaluationId/:tab?",
        element: <EvaluationDetail/>
      },
      {
        path: ":evaluationId/calendar",
        element: <Calendar/>
      },
      {
        path:":evaluationId/calendar/create",
        element: <CreateReviewSchedule/>
      }

        
    ],
  },
];

export default EvaluationRoutes;
