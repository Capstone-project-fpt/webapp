import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setBreadCrumb } from "@/store/slice/app";
import { useEffect, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { LuFileSpreadsheet } from "react-icons/lu";
import { useDispatch } from "react-redux";
import CreateUpdateDialog from "./components/create-update-dialog";
import { StudentsTable } from "./components/table";
import UploadSheetDialog from "./components/upload-sheet-dialog";
import SearchBar from "@/components/common/search-bar";
import { Label } from "@/components/ui/label"

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Accounts", link: "/accounts" },
        { title: "Students", link: "/accounts/students" },
      ])
    );
  }, [dispatch]);

  function openModalCreateStudent(value: string): void {
    setModalType(value);
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-2 mb-4">
          <Label className="text-base font-medium text-gray-700">Search Student</Label>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-1">
                <GoPlus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Create Students</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup onValueChange={openModalCreateStudent}>
                <DropdownMenuRadioItem value="form">
                  <FaWpforms className="mr-1" />
                  Form
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sheet">
                  <LuFileSpreadsheet className="mr-1" />
                  Sheets
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {modalType === "form" ? (
          <CreateUpdateDialog
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
          />
        ) : (
          <UploadSheetDialog open={isModalOpen} onOpenChange={setIsModalOpen} />
        )}
      </div>
      <StudentsTable searchKey={searchTerm} />
    </>
  );
};

export default Students;
