import { FaRegLightbulb } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LuCalendarCheck } from "react-icons/lu";
import { MdOutlinePersonSearch } from "react-icons/md";
import { Home, Settings2, Users } from "tabler-icons-react";

export interface MenuItem {
  title: string;
  link?: string;
  icon?: JSX.Element;
  children?: MenuItem[];
  isOpen?: boolean;
}

const menus: MenuItem[] = [
  {
    icon: <Home size={18} strokeWidth={2} />,
    title: "Home",
    link: "/dashboard",
    isOpen: false,
  },
  {
    icon: <LuCalendarCheck size={18} strokeWidth={2} />,
    title: "Semesters",
    isOpen: false,
    children: [
      {
        title: "List",
        link: "/semesters",
      },
      {
        title: "Current semester",
        link: "/semesters/current",
      },
    ],
  },
  {
    icon: <HiOutlineUserGroup size={18} strokeWidth={2} />,
    title: "Group",
    children: [
      {
        title: "List",
        link: "/groups",
      },
      {
        title: "Your groups",
        link: "/groups/me",
      },
      {
        title: "Verify groups",
        link: "/groups/verify",
      },
    ],
  },
  {
    icon: <MdOutlinePersonSearch size={18} />,
    title: "Evaluation Committee",
    link: "/evaluation-committees",
  },
  {
    icon: <Users size={18} strokeWidth={2} />,
    title: "Accounts",
    children: [
      {
        title: "Students",
        link: "/accounts/students",
        icon: <Users size={18} strokeWidth={2} />,
      },
      {
        title: "Lecturers",
        link: "/accounts/lecturers",
        icon: <Users size={18} strokeWidth={2} />,
      },
    ],
  },
  {
    icon: <FaRegLightbulb size={18} strokeWidth={2} />,
    title: "Topics",
    link: "/topics",
    isOpen: false,
  },
  {
    icon: <Settings2 size={18} strokeWidth={2} />,
    title: "Settings",
    link: "/settings",
    isOpen: false,
  },
];

export default menus;
