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
import React, { useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Logout, Settings2 } from "tabler-icons-react";

declare global {
  interface Window {
    chativeApi: (action: string, user?: object) => void;
  }
}

const TopHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSideBarOpen = useSelector(
    (state: RootState) => state.app.isSideBarOpen,
  );

  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (window && window.chativeApi) {
      const api = window.chativeApi;
      api("shutdown");
      if (currentUser) {
        const user = {
          user_id: currentUser.common_info.id,
          user: {
            email: currentUser.common_info.email,
            last_name: currentUser.common_info.name,
            phone: currentUser.common_info.phone_number,
          },
          isHidden: true,
        };

        api("boot", user);
      }
      api("addEventListener", { event: "closed", callback: () => api("hide") });
      api("addEventListener", {
        event: "new-agent-message",
        callback: () => api("show"),
      });
    }
  }, [currentUser]);

  const openLiveChat = () => {
    if (window && window.chativeApi) {
      window.chativeApi("openChatWindow");
    }
  };

  const handleLogout = () => {
    dispatch(removeUserInfo());
    navigate("/auth/sign-in");
    if (window && window.chativeApi) {
      window.chativeApi("shutdown");
    }
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
            <DropdownMenuLabel>
              {currentUser?.common_info.name || "My account"}
            </DropdownMenuLabel>
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
            <DropdownMenuItem
              className=" flex items-center gap-2 "
              onClick={openLiveChat}
            >
              <MdOutlineSupportAgent size={18} />
              Support
            </DropdownMenuItem>
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
