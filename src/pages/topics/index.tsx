import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoPlus } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import CreateUpdateDialog from "./components/create-update-dialog";
import { TopicTable } from "./components/topic-table";
import { RootState } from "@/store";
import { userInfo } from "@/store/slice/auth";
import { UserTypes } from "@/types/accounts";
import SearchBar from "@/components/common/search-bar";
import { Label } from "@/components/ui/label"

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
      ])
    );
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-2 mb-4">
          <Label className="text-base font-medium text-gray-700">Search Suggested Topic</Label>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <Button
          variant="outline"
          className="ml-1"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <GoPlus className="h-4 w-4" />
        </Button>
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
