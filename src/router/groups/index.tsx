import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import Groups from "@/pages/groups";
import CreateGroup from "@/pages/groups/create-group";
import GroupDetail from "@/pages/groups/group-detail";
import Invitation from "@/pages/groups/invitation";
import ReportDetail from "@/pages/groups/report-detail";
import ReviewDetail from "@/pages/groups/review-detail";
import TopicDetail from "@/pages/groups/topic-detail";
import VerifyGroups from "@/pages/groups/verify-groups";
import YourGroups from "@/pages/groups/your-groups";
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
        path: "me",
        element: <YourGroups />,
      },
      {
        path: "verify",
        element: <VerifyGroups />,
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
        path: ":groupId/topics/:topicId",
        element: <TopicDetail />,
      },
      {
        path: ":groupId/reports/:reportId",
        element: <ReportDetail />,
      },
      {
        path: ":groupId/reviews/:reviewId",
        element: <ReviewDetail />,
      },
      {
        path: ":groupId/invitation",
        element: <Invitation />,
      },
    ],
  },
];

export default GroupsRoutes;
