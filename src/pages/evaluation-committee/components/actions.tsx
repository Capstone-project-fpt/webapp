import { ActionCell } from "@/components/data-table";
import { EvaluationType } from "@/types/evaluation";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
// import CreateUpdateDialog from "./create-update-dialog";
import DeleteDialog from "./delete-dialog";


const Actions: React.FC<{ row: Row<EvaluationType> }> = ({ row }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      {/* <CreateUpdateDialog
        student={row.original}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      /> */}
      <DeleteDialog
        group={row.original}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
      <ActionCell
        items={[
          {
            item: "View Detail",
            onClick: () => {
            },
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
