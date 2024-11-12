import AuthRoutes from "@/router/auth";
import CategoryRoutes from "@/router/categories";
import DashboardRoutes from "@/router/dashboard";
import HomeRoutes from "@/router/home";
import SettingRoutes from "@/router/settings";
import { createBrowserRouter } from "react-router-dom";
import AccountsRoutes from "./accounts";
import GroupsRoutes from "./groups";
import MajorRoutes from "./majors";
import ProductRoutes from "./products";
import SemesterRoutes from "./semesters";
import SyllabusRoutes from "./syllabus";
import TopicRoutes from "./topics";
import EvaluationRoutes from "./evaluations";



const router = createBrowserRouter([
  ...AuthRoutes,
  ...HomeRoutes,
  ...DashboardRoutes,
  ...CategoryRoutes,
  ...ProductRoutes,
  ...GroupsRoutes,
  ...AccountsRoutes,
  ...SettingRoutes,
  ...MajorRoutes,
  ...TopicRoutes,
  ...SemesterRoutes,
  ...SyllabusRoutes,
  ...EvaluationRoutes,
]);

export default router;
