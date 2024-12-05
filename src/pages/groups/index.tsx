import { LoadingTableLottie } from "@/components";
import { GroupStatusBadge } from "@/components/common/status-badge";
import {
  ActionCell,
  DataTable,
  DataTableColumnHeader,
  DateCell,
  TextCell,
} from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import {
  useGetGroupsQuery,
  useLazyGetMentorAndListMembersGroupQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { UserTypes } from "@/types/accounts";
import { GroupType } from "@/types/group";
import {
  ColumnDef,
  PaginationState,
  Row,
  TableOptions,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Actions: React.FC<{
  row: Row<GroupType>;
}> = ({ row }) => {
  const [triggerGetMentorAndListMembersGroup] =
    useLazyGetMentorAndListMembersGroupQuery();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useSelector((state: RootState) => state.auth.user)!;

  const handleViewDetailCapstoneGroup = async (capstone_group_id: number) => {
    // TODO: Verifier can view detail capstone group
    if (
      [UserTypes.STUDENT, UserTypes.TEACHER].includes(
        currentUser.common_info.user_type,
      )
    ) {
      const {
        data: { members, mentor },
      } = await triggerGetMentorAndListMembersGroup({
        capstone_group_id,
      }).unwrap();

      if (currentUser.common_info.user_type === UserTypes.STUDENT) {
        if (
          !members
            .map((m) => m.id)
            .includes(currentUser.extra_info.student!.student_id)
        ) {
          toast({
            duration: 3000,
            title: "View Detail Capstone Group",
            description: "You are not a member of this capstone group",
            variant: "destructive",
          });
          return;
        }
      } else {
        if (currentUser.extra_info.teacher!.teacher_id !== mentor?.id) {
          toast({
            duration: 3000,
            title: "View Detail Capstone Group",
            description: "You are not a mentor of this capstone group",
            variant: "destructive",
          });
          return;
        }
      }
    }

    navigate("/groups/" + capstone_group_id);
  };

  return (
    <ActionCell
      items={[
        {
          item: "View Detail",
          onClick: () => {
            handleViewDetailCapstoneGroup(row.original.id);
          },
        },
      ]}
    />
  );
};

const columns = (): ColumnDef<GroupType>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => (
      <TextCell size={200}>{row.original.name_group}</TextCell>
    ),
  },
  {
    accessorKey: "total_members",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Total Members" />
    ),
    cell: ({ row }) => <TextCell>{row.original.total_members}</TextCell>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Status" />
    ),
    cell: ({ row }) => <GroupStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Created At" />
    ),
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: () => <TextCell>Actions</TextCell>,
    cell: ({ row }) => <Actions row={row} />,
  },
];

const Groups: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
      ]),
    );
  }, [dispatch]);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester,
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: queryData,
    error,
    isLoading,
  } = useGetGroupsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    semester_id: Number(currentSemester?.id),
  });

  const tableData = useMemo(() => {
    if (!queryData) return [];
    const { items } = queryData.data;

    // Filter data based on search term
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return items.filter((group: GroupType) =>
        group.name_group
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(normalizedSearchTerm),
      );
    }
    return items;
  }, [queryData, searchTerm]);

  const totalRecord = useMemo(() => {
    return queryData ? queryData.data.meta.total : 0;
  }, [queryData]);

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorBoundaryComponent />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          title="Search"
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-48"
        />
        <Link to="/groups/create">
          {currentUser?.common_info.user_type === UserTypes.ADMIN && (
            <Button variant="outline">
              <GoPlus className="h-4 w-4" />
            </Button>
          )}
        </Link>
      </div>
      <DataTable
        data={tableData}
        columns={columns()}
        state={{ pagination }}
        options={
          {
            onPaginationChange: setPagination,
            manualPagination: true,
            pageCount: Math.ceil(totalRecord / pagination.pageSize),
          } as TableOptions<GroupType>
        }
        showToolbar={false}
      />
    </div>
  );
};

export default Groups;
