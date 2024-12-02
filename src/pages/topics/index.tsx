import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store";
import { setBreadCrumb } from "@/store/slice/app";
import { userInfo } from "@/store/slice/auth";
import { UserTypes } from "@/types/accounts";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import CreateUpdateDialog from "./components/create-update-dialog";
import { TopicTable } from "./components/topic-table";

const Topics: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => userInfo(state.auth));
  const currentUserType = currentUser?.common_info.user_type as UserTypes;

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Topics", link: "/topics" },
      ]),
    );
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2">
          <Input
            title="Search"
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
        </div>
        {currentUserType !== UserTypes.STUDENT && (
          <Button
            variant="outline"
            className="ml-1"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <GoPlus className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isCreateModalOpen && (
        <CreateUpdateDialog
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          currentUserType={currentUserType}
        />
      )}
      <TopicTable currentUserType={currentUserType} searchKey={searchTerm} />
    </div>
  );
};

export default Topics;
