import { DataTableColumnHeader, TextCell } from "@/components/data-table";
import { SemesterType } from "@/types/semester";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";

export const columns: ColumnDef<SemesterType>[] = [
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
    accessorKey: "start-time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Start Date" />
    ),
    cell: ({ row }) => <TextCell size={200}>{row.original.start_time}</TextCell>,
    
  },
  {
    accessorKey: "end-time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="End Date" />
    ),
    cell: ({ row }) => <TextCell size={200}>{row.original.end_time}</TextCell>,
    
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];
