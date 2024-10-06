import { createBrowserRouter } from "react-router-dom";
import AuthRoutes from "@/router/auth";
import HomeRoutes from "@/router/home";
import DashboardRoutes from "@/router/dashboard";
import SettingRoutes from "@/router/settings";
import CategoryRoutes from "@/router/categories";
import ProductRoutes from "./products";
import AccountsRoutes from "./accounts";
import MajorRoutes from "./majors";
import GroupsRoutes from "./groups";

const router = createBrowserRouter([
  ...AuthRoutes,
  ...HomeRoutes,
  ...DashboardRoutes,
  ...CategoryRoutes,
  ...ProductRoutes,
  ...GroupsRoutes,
  ...AccountsRoutes,
  ...SettingRoutes,
  ...MajorRoutes
]);

export default router;
