import { ActionCell } from "@/components/data-table";
import { TopicType } from "@/types/topic";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import CreateUpdateDialog from "./create-update-dialog";
import DeleteDialog from "./delete-dialog";
import { UserTypes } from "@/types/accounts";

const Actions: React.FC<{
  row: Row<TopicType>;
  currentUserType: UserTypes;
}> = ({ row, currentUserType }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <CreateUpdateDialog
        topic={row.original}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        currentUserType={currentUserType}
      />
      <DeleteDialog
        topic={row.original}
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
        invisible={currentUserType !== UserTypes.ADMIN}
      />
    </>
  );
};

export default Actions;
