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
import { LecturesTable } from "./components/table";
import UploadSheetDialog from "./components/upload-sheet-dialog";

const Lectures = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Accounts", link: "/accounts" },
        { title: "Lectures", link: "/accounts/lectures" },
      ])
    );
  }, [dispatch]);
  function openModalCreateLecture(value: string): void {
    setModalType(value);
    setIsModalOpen(true);
  }
  return (
    <>
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-1">
              <GoPlus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Create Lecturers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup onValueChange={openModalCreateLecture}>
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
        {modalType === "form" ? (
          <CreateUpdateDialog
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
          />
        ) : (
          <UploadSheetDialog open={isModalOpen} onOpenChange={setIsModalOpen} />
        )}
      </div>
      <LecturesTable />
    </>
  );
};


export default Lectures;
