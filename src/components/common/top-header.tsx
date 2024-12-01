import { BreadCrumb, MobileSideBar } from "@/components";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/store";
import { toggleSideBarOpen } from "@/store/slice/app";
import { removeUserInfo } from "@/store/slice/auth";
import { UserCircle2 } from "lucide-react";
import React from "react";
import { FaUser } from "react-icons/fa";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Logout, Settings2 } from "tabler-icons-react";

const TopHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSideBarOpen = useSelector((state: RootState) => state.app.isSideBarOpen);

  const handleLogout = () => {
    dispatch(removeUserInfo());
    navigate("/auth/sign-in");
  };

  return (
    <div className=" w-full h-14 py-3 flex justify-between items-center ">
      <div className=" flex gap-2 items-center ">
        <Button
          variant="outline"
          size="icon"
          className="  rounded-full border-none shadow-none hidden lg:flex items-center"
          onClick={() => dispatch(toggleSideBarOpen())}
        >
          {isSideBarOpen ? (
            <RiMenuFoldLine className=" text-2xl" />
          ) : (
            <RiMenuUnfoldLine className=" text-2xl" />
          )}
        </Button>

        {/* Only For Mobile Layout */}
        <MobileSideBar />

        <BreadCrumb />
      </div>
      <div className=" flex justify-end items-center gap-3 ">
        {/* <ToggleMode /> */}
        <DropdownMenu>
          <DropdownMenuTrigger className=" focus-visible:outline-none ">
            <Avatar>
              <AvatarFallback>
                <FaUser />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className=" focus-visible:outline-none me-5 w-[150px] "
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/settings">
              <DropdownMenuItem className=" flex items-center gap-2 ">
                <UserCircle2 size={17} />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link to="/settings">
              <DropdownMenuItem className=" flex items-center gap-2 ">
                <Settings2 size={18} />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className=" flex items-center gap-2 "
              onClick={handleLogout}
            >
              <Logout size={18} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopHeader;
