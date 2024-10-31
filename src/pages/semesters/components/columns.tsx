import {
  DataTableColumnHeader,
  DateCell,
  TextCell,
} from "@/components/data-table";
import { SemesterType } from "@/types/semester";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import Actions from "./actions";

export const columns: ColumnDef<SemesterType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => (
      <Link
        to={`/semesters/${row.original.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <TextCell size={200}>{row.original.name}</TextCell>
      </Link>
    ),
  },
  {
    accessorKey: "start-time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Start Date" />
    ),
    cell: ({ row }) => (
      <DateCell date={new Date(row.original.start_time)}></DateCell>
    ),
  },
  {
    accessorKey: "end-time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="End Date" />
    ),
    cell: ({ row }) => (
      <DateCell date={new Date(row.original.end_time)}></DateCell>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];
