import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

const EmptyGroup: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-center mb-4">
        <HiOutlineUserGroup size={100} strokeWidth={1} />
      </div>
      <h1 className="font-bold mb-2">No group yet</h1>
      <span className="mb-6 text-center">
        Join or create a Group and it will show up here.
      </span>
      <Link to="/groups/create">
        <Button>Create Group</Button>
      </Link>
    </div>
  );
};

const Groups: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
      ])
    );
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.auth.user);

  // TODO: Get group id from user
  // const { capstone_group_id: groupId } = user?.extra_info.student || {};
  const groupId = "";
  const hasGroup = !!groupId;
  if (!hasGroup) {
    return <EmptyGroup />;
  } else {
    return <Navigate to={`/groups/${groupId}`} />;
  }
};

export default Groups;
