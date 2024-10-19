import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import Groups from "@/pages/groups";
import CreateGroup from "@/pages/groups/create-group";
import GroupDetail from "@/pages/groups/group-detail";
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
        path: ":groupId/:tab?",
        element: <GroupDetail />,
      },
    ],
  },
];

export default GroupsRoutes;
