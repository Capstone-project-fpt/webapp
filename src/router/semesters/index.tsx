import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Semesters } from "@/pages";
import SemesterDetail from "@/pages/semesters/semester-detail";

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
        path: ":semesterId/:tab?",
        element: <SemesterDetail />
      },
    ],
  },
];

export default SemesterRoutes;
