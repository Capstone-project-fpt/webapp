import { ActionCell } from "@/components/data-table";
import { SemesterType } from "@/types/semester";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import CreateUpdateDialog from "./create-update-dialog";
import DeleteDialog from "./delete-dialog";
import { useNavigate } from "react-router-dom";

const Actions: React.FC<{ row: Row<SemesterType> }> = ({ row }) => {
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <CreateUpdateDialog
        semester={row.original}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
      <DeleteDialog
        semester={row.original}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
      <ActionCell
        items={[
          {
            item: "View Details",
            onClick: () => {
              navigate(`/semesters/${row.original.id}`);
            },
          },
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
