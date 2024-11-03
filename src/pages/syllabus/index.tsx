import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch } from "react-redux";
import CreateUpdateDialog from "./components/create-update-dialog";
import { SyllabusTable } from "./components/syllabus-table";

const Syllabus: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Syllabus", link: "/syllabus" },
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
          />
        )}
      </div>
      <SyllabusTable />
    </>
  );
};

export default Syllabus;
