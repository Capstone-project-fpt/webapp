import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch } from "react-redux";
import CreateUpdateDialog from "./components/create-update-dialog";
import { SyllabusTable } from "./components/syllabus-table";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/common/search-bar";

const Syllabus: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Syllabus", link: "/syllabus" },
      ])
    );
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2 mb-4">
          <Label className="text-base font-medium text-gray-700">
            Search Syllabus
          </Label>
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
        />
      )}
      <SyllabusTable searchKey={searchTerm} />
    </>
  );
};

export default Syllabus;
