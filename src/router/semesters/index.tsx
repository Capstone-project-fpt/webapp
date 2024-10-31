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
<<<<<<< HEAD
        path: ":semesterid", 
        element: <SemesterDetail />, 
=======
        path: ":semesterId",
        element: <SemesterDetail />,
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
        children: [
          {
            path: "groups",
            element: <Groups />,
          },
          {
<<<<<<< HEAD
            path: "evaluation-committee", 
=======
            path: "evaluation-committee",
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
            element: <EvaluationCommittee />,
          },
        ],
      },
    ],
  },
];

<<<<<<< HEAD
export default SemesterRoutes;
=======
export default SemesterRoutes;
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
