import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import Groups from "@/pages/groups";
import CreateGroup from "@/pages/groups/create-group";
import GroupDetail from "@/pages/groups/group-detail";
import ReportDetail from "@/pages/groups/report-detail";
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
      {
        path: ":groupId/reports/:reportId",
        element: <ReportDetail />,
      },
    ],
  },
];

export default GroupsRoutes;
