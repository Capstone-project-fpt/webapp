import {
  DataTableColumnHeader,
  DateCell,
  TextCell,
} from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import { SyllabusType } from "@/types/syllabus";

export const columns: ColumnDef<SyllabusType>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Code" />
    ),
    cell: ({ row }) => (
      <TextCell size={200}>{row.original.code}</TextCell>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => (
      <a
      href={row.original.path}
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <TextCell size={200}>{row.original.name}</TextCell>
    </a>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];
