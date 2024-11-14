import { ActionCell } from "@/components/data-table";
import { EvaluationType } from "@/types/evaluation";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import DeleteDialog from "./delete-dialog";
import { useNavigate } from "react-router-dom";

const Actions: React.FC<{ row: Row<EvaluationType> }> = ({ row }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <DeleteDialog
        group={row.original}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
      <ActionCell
        items={[
          {
            item: "View Details",
            onClick: () => {
              navigate(`/evaluation-committees/${row.original.id}`);
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
