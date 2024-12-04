import AuthRoutes from "@/router/auth";
import DashboardRoutes from "@/router/dashboard";
import HomeRoutes from "@/router/home";
import SettingRoutes from "@/router/settings";
import { createBrowserRouter } from "react-router-dom";
import AccountsRoutes from "./accounts";
import GroupsRoutes from "./groups";
import MajorRoutes from "./majors";
import SemesterRoutes from "./semesters";
import TopicRoutes from "./topics";
import EvaluationRoutes from "./evaluations";

const router = createBrowserRouter([
  ...AuthRoutes,
  ...HomeRoutes,
  ...DashboardRoutes,
  ...GroupsRoutes,
  ...AccountsRoutes,
  ...SettingRoutes,
  ...MajorRoutes,
  ...TopicRoutes,
  ...SemesterRoutes,
  ...EvaluationRoutes,
]);

export default router;
