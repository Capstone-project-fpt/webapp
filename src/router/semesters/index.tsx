import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Semesters } from "@/pages";
import SemesterDetail from "@/pages/semesters/semester-detail";

import EvaluationCommittee from "@/pages/semesters/semester-detail/evaluation-committee";
import Groups from "@/pages/semesters/semester-detail/groups";
import { RouteObject } from "react-router-dom";

const SemesterRoutes: RouteObject[] = [
  {
    path: "/semesters",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Semesters />,
      },
      {
        path: ":semesterid", 
        element: <SemesterDetail />, 
        children: [
          {
            path: "groups",
            element: <Groups />,
          },
          {
            path: "evaluation-committee", 
            element: <EvaluationCommittee />,
          },
        ],
      },
    ],
  },
];

export default SemesterRoutes;