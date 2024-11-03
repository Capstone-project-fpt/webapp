import { DataTableColumnHeader, TextCell } from "@/components/data-table";
import { SyllabusType } from "@/types/syllabus";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";

export const columns: ColumnDef<SyllabusType>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Code" />
    ),
    cell: ({ row }) => <TextCell size={200}>{row.original.code}</TextCell>,
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
