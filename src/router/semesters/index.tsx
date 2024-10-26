import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Semesters } from "@/pages";
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
    ],
  },
];

export default SemesterRoutes;
