import { DataTableColumnHeader, TextCell } from "@/components/data-table";
import { StudentType } from "@/types/accounts";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import SubMajor from "@/components/common/major";

export const columns: ColumnDef<StudentType>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Student Code" />
    ),
    cell: ({ row }) => <TextCell size={60}>{row.original.code}</TextCell>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => <TextCell size={200}>{row.original.name}</TextCell>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Email" />
    ),
    cell: ({ row }) => <TextCell size={200}>{row.original.email}</TextCell>,
  },
  {
    accessorKey: "sub_major_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Major" />
    ),
    cell: ({ row }) => <SubMajor id={row.original.sub_major_id} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];
