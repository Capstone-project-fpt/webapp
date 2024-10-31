import { ActionCell } from "@/components/data-table";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import CreateUpdateDialog from "./create-update-dialog";
import DeleteDialog from "./delete-dialog";
import { useNavigate } from "react-router-dom";
import { SyllabusType } from "@/types/syllabus";

const Actions: React.FC<{ row: Row<SyllabusType> }> = ({ row }) => {
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <CreateUpdateDialog
        syllabus={row.original}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
      <DeleteDialog
        syllabus={row.original}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
      <ActionCell
        items={[
          {
            item: "View Details",
            onClick: () => {
              const externalLink = row.original.path;
              window.open(externalLink, "_blank");
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
