import { ActionCell } from "@/components/data-table";
import { TopicType } from "@/types/topic";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import CreateUpdateDialog from "./create-update-dialog";
import DeleteDialog from "./delete-dialog";

const Actions: React.FC<{ row: Row<TopicType>; isAdminAction: boolean }> = ({
  row,
  isAdminAction,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <CreateUpdateDialog
        topic={row.original}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        isAdminAction={isAdminAction}
      />
      <DeleteDialog
        topic={row.original}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        isAdminAction={isAdminAction}
      />
      <ActionCell
        items={[
          {
            item: "Edit",
            onClick: () => setIsUpdateModalOpen(!isAdminAction),
          },
          "-",
          {
            item: "Delete",
            danger: true,
            onClick: () => setIsDeleteModalOpen(!isAdminAction),
          },
        ]}
      />
    </>
  );
};

export default Actions;
