import { LoadingTableLottie } from "@/components";
import { GroupStatusBadge } from "@/components/common/status-badge";
import { SettingCard } from "@/components/custom/setting";
import {
  ActionCell,
  DataTable,
  DataTableColumnHeader,
  TextCell,
} from "@/components/data-table";
import { RootState } from "@/store";
import { useGetGroupsQuery } from "@/store/api/v1/endpoints/groups";
import { GroupType } from "@/types/group";
import { ScheduleStatus } from "@/types/schedule";
import {
  ColumnDef,
  PaginationState,
  Row,
  TableOptions,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CreateScheduleDialog from "../components/create-schedule-dialog";
import ErrorBoundaryComponent from "@/components/error/error-boundary";

const Actions: React.FC<{
  row: Row<GroupType>;
}> = ({ row }) => {
  return (
    <ActionCell
      items={[
        {
          item: "View Detail",
          onClick: () => {
            console.log("View Detail");
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
interface ReviewsTableProps {
  status: ScheduleStatus;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ status }) => {
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

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
    semester_id: Number(currentSemester?.id),
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
  );
};

const Reviews = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end mb-2">
        <CreateScheduleDialog />
      </div>
      <SettingCard title="In Progress">
        <ReviewsTable status={ScheduleStatus.InProgress} />
      </SettingCard>
      {/* <SettingCard title="Incoming" description="The schedules in the future">
        <ReviewsTable status={ScheduleStatus.Incoming} />
      </SettingCard>
      <SettingCard title="Archived" description="The schedules in the past">
        <ReviewsTable status={ScheduleStatus.Archived} />
      </SettingCard> */}
    </div>
  );
};

export default Reviews;
