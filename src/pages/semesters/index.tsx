import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import CreateUpdateDialog from "./components/create-update-dialog";
import { SemesterTable } from "./components/semester-table";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store/index";

const Semesters: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user as any);
  const { user_type } = currentUser.common_info || {};

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Semesters", link: "/semesters" },
      ])
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
        {user_type !== "student" && user_type !== "teacher" &&(
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
        />
      )}
      <SemesterTable searchKey={searchTerm} />
    </div>
  );
};

export default Semesters;
