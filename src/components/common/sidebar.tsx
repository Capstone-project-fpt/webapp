import { IconSideBar, SheetSideBar } from "@/components";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const SideBar: React.FC = () => {
  const isSideBarOpen = useSelector((state: RootState) => state.app.isSideBarOpen);

  return (
    <>
      {!isSideBarOpen ? (
        <IconSideBar />
      ) : (
        <SheetSideBar />
      )}
    </>
  );
};

export default SideBar;
