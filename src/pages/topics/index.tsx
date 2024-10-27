import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import CreateUpdateDialog from "./components/create-update-dialog";
import { TopicTable } from "./components/topic-table";
import { RootState } from "@/store";
import { userInfo } from "@/store/slice/auth";
import { UserTypes } from "@/types/accounts";

const Topics: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => userInfo(state.auth));
  const currentUserType = currentUser?.common_info.user_type as UserTypes;
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Topics", link: "/topics" },
      ])
    );
  }, [dispatch]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          className="ml-1"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <GoPlus className="h-4 w-4" />
        </Button>
        {isCreateModalOpen && (
          <CreateUpdateDialog
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            currentUserType={currentUserType}
          />
        )}
      </div>

      <TopicTable currentUserType={currentUserType} />
    </>
  );
};

export default Topics;
