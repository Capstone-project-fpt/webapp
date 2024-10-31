<<<<<<< HEAD
import { DataTableColumnHeader, TextCell } from "@/components/data-table";
import { SemesterType } from "@/types/semester";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import { Link } from "react-router-dom";

export const columns: ColumnDef<SemesterType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="ID" />
    ),
    cell: ({ row }) => <TextCell size={60}>{row.original.id}</TextCell>,
  },
  {
=======
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
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => (
<<<<<<< HEAD
      <Link to={`/semesters/${row.original.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
=======
      <Link
        to={`/semesters/${row.original.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
        <TextCell size={200}>{row.original.name}</TextCell>
      </Link>
    ),
  },
  {
    accessorKey: "start-time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Start Date" />
    ),
<<<<<<< HEAD
    cell: ({ row }) => <TextCell size={200}>{row.original.start_time}</TextCell>,
    
=======
    cell: ({ row }) => (
      <DateCell date={new Date(row.original.start_time)}></DateCell>
    ),
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
  },
  {
    accessorKey: "end-time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="End Date" />
    ),
<<<<<<< HEAD
    cell: ({ row }) => <TextCell size={200}>{row.original.end_time}</TextCell>,
    
=======
    cell: ({ row }) => (
      <DateCell date={new Date(row.original.end_time)}></DateCell>
    ),
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];
