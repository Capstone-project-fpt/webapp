import { DataTableColumnHeader, TextCell } from "@/components/data-table";
import { TopicType } from "@/types/topic";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import { UserTypes } from "@/types/accounts";
import FileDownload from "@/components/common/file-download";

export const columns = (currentUserType: UserTypes): ColumnDef<TopicType>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="ID" />
    ),
    cell: ({ row }) => <TextCell size={60}>{row.original.id}</TextCell>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => <TextCell size={200}>{row.original.name}</TextCell>,
  },
  {
    accessorKey: "teacher",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Teacher" />
    ),
    cell: ({ row }) => (
      <div>{(row.getValue("teacher") as { name: string }).name}</div>
    ),
  },
  {
    id: "download",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="File" />
    ),
    cell: ({ row }) => <FileDownload pathFile={row.original.path} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} currentUserType={currentUserType} />,
  },
];
