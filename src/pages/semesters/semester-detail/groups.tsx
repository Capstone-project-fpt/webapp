import { LoadingTableLottie } from "@/components";
import { GroupStatusBadge } from "@/components/common/status-badge";
import { SettingCard } from "@/components/custom/setting";
import {
  ActionCell,
  DataTable,
  DataTableColumnHeader,
  TextCell,
} from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import {
  useGetGroupsQuery,
  useLazyGetMentorAndListMembersGroupQuery,
} from "@/store/api/v1/endpoints/groups";
import { UserTypes } from "@/types/accounts";
import { GroupType } from "@/types/group";
import {
  ColumnDef,
  PaginationState,
  Row,
  TableOptions,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Actions: React.FC<{
  row: Row<GroupType>;
}> = ({ row }) => {
  const [triggerGetMentorAndListMembersGroup] =
    useLazyGetMentorAndListMembersGroupQuery();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleViewDetailCapstoneGroup = async (capstone_group_id: number) => {
    if (currentUser?.common_info.user_type === UserTypes.STUDENT) {
      const {
        data: { members },
      } = await triggerGetMentorAndListMembersGroup({
        capstone_group_id,
      }).unwrap();

      if (
        !members
          .map((m) => m.id)
          .includes(currentUser.extra_info.student!.student_id)
      ) {
        toast({
          title: "View Detail Capstone Group",
          description: "You are not a member of this capstone group",
          variant: "destructive",
        });
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
    id: "actions",
    header: () => <TextCell>Actions</TextCell>,
    cell: ({ row }) => <Actions row={row} />,
  },
];

const Groups: React.FC = () => {
  const { semesterId } = useParams<{ semesterId: string }>();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: queryData,
    error,
    isLoading,
  } = useGetGroupsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    semester_id: Number(semesterId),
  });

  const tableData = useMemo(() => {
    return queryData ? queryData.data.items : [];
  }, [queryData]);

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
      <SettingCard
        title={`Capstone Group (${queryData ? queryData.data.meta.total : 0})`}
      >
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
        />
      </SettingCard>
    </div>
  );
};

export default Groups;
