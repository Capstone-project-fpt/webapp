import { ActionCell } from "@/components/data-table";
import { EvaluationType } from "@/types/evaluation";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import DeleteDialog from "./delete-dialog";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { UserTypes } from "@/types/accounts";

const Actions: React.FC<{ row: Row<EvaluationType> }> = ({ row }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const showDeleteAction =
    currentUser?.common_info.user_type === UserTypes.ADMIN;

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
          ...(showDeleteAction
            ? [
                {
                  item: "Delete",
                  danger: true,
                  onClick: () => setIsDeleteModalOpen(true),
                },
              ]
            : []),
        ]}
      />
    </>
  );
};

export default Actions;
