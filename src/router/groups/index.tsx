import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import Groups from "@/pages/groups";
import CreateGroup from "@/pages/groups/create-group";
import { RouteObject } from "react-router-dom";

const GroupsRoutes: RouteObject[] = [
  {
    path: "/groups",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Groups />,
      },
      {
        path: "create",
        element: <CreateGroup />,
      },
      {
        path: ":id",
        element: <Groups />,
      },
    ],
  },
];

export default GroupsRoutes;
