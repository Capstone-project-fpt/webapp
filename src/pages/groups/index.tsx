import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

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

  const [hasGroup, setHasGroup] = useState(false);

  if (!hasGroup) {
    return <EmptyGroup />;
  } else {
    return <div>Group</div>;
  }
};

export default Groups;
