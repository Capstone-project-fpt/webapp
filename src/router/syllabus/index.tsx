import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Syllabus } from "@/pages";
import { RouteObject } from "react-router-dom";

const SyllabusRoutes: RouteObject[] = [
  {
    path: "/syllabus",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Syllabus />,
      },
    ],
  },
];

export default SyllabusRoutes;
