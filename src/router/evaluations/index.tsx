import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import EvaluationCommittee from "@/pages/evaluation-committee";
import CreateEvaluationGroup from "@/pages/evaluation-committee/create-group";
import EvaluationDetail from "@/pages/evaluation-committee/group-detail";

import { RouteObject } from "react-router-dom";

const EvaluationRoutes: RouteObject[] = [
  {
    path: "/evaluation-committees",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <EvaluationCommittee />,
      },
      {
        path: "create",
        element: <CreateEvaluationGroup />,
      },
      {
        path: ":evaluationId/:tab?",
        element: <EvaluationDetail />,
      },
    ],
  },
];

export default EvaluationRoutes;
