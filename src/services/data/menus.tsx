import { FaRegLightbulb } from "react-icons/fa";
import { IoMdBook } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";
import { Home, Settings2, Users } from "tabler-icons-react";
import { HiOutlineUserGroup } from "react-icons/hi";

export interface MenuItem {
  title: string;
  link?: string;
  icon?: JSX.Element;
  children?: MenuItem[];
  isOpen?: boolean; // New property to track open/closed state
}

const menus: MenuItem[] = [
  {
    icon: <Home size={18} strokeWidth={2} />,
    title: "Home",
    link: "/dashboard",
    isOpen: false,
  },
  {
    icon: <HiOutlineUserGroup size={18} strokeWidth={2} />,
    title: "Group",
    link: "/groups",
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
