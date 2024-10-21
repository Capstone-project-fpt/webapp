import { ActionCell } from "@/components/data-table";
import { LectureType } from "@/types/accounts";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import CreateUpdateDialog from "./create-update-dialog";
import DeleteDialog from "./delete-dialog";


const Actions: React.FC<{ row: Row<LectureType> }> = ({ row }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <CreateUpdateDialog
        lecture={row.original}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
      <DeleteDialog
       lecture={row.original}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
      <ActionCell
        items={[
          {
            item: "Edit",
            onClick: () => setIsUpdateModalOpen(true),
          },
          "-",
          {
            item: "Delete",
            danger: true,
            onClick: () => setIsDeleteModalOpen(true),
          },
        ]}
      />
    </>
  );
};

export default Actions;
