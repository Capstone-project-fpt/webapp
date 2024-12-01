import { LoadingTableLottie } from "@/components";
import EmptyResources from "@/components/common/empty-resource";
import { SettingCard } from "@/components/custom/setting";
import {
  DataTable,
  DataTableColumnHeader,
  DateCell,
  TextCell,
} from "@/components/data-table";
import { RootState } from "@/store";
import { useGetEvaluationsQuery } from "@/store/api/v1/endpoints/evaluations";
import { EvaluationType } from "@/types/evaluation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  ColumnDef,
  PaginationState,
  TableOptions,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Actions from "./components/actions";
import ErrorBoundaryComponent from "@/components/error/error-boundary";

const columns = (): ColumnDef<EvaluationType>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => <TextCell size={200}>{row.original.name}</TextCell>,
  },
  {
    accessorKey: "teacher_ids",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Total Members" />
    ),
    cell: ({ row }) => (
      <TextCell size={200}>{row.original.teacher_ids.length}</TextCell>
    ),
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
    cell: ({ row }) => <Actions row={row} />,
  },
];

const EvaluationGroups: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

  const {
    data: queryData,
    error: evaluationsError,
    isLoading: isEvaluationsLoading,
  } = useGetEvaluationsQuery(
    currentSemester?.id
      ? {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          semester_id: currentSemester.id,
        }
      : skipToken
  );

  const tableData = useMemo(() => {
    return queryData ? queryData.data.items : [];
  }, [queryData]);

  const totalRecord = useMemo(() => {
    return queryData ? queryData.data.meta.total : 0;
  }, [queryData]);

  if (isEvaluationsLoading) {
    return (
      <div className="flex justify-center pt-10 ">
        <div className="w-[250px]">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (evaluationsError) {
    return <ErrorBoundaryComponent />;
  }

  return (
    <div>
      {currentSemester ? (
        <SettingCard title={`Evaluation Committee Groups (${totalRecord})`}>
          <DataTable
            data={tableData}
            columns={columns()}
            state={{ pagination }}
            options={
              {
                onPaginationChange: setPagination,
                manualPagination: true,
                pageCount: Math.ceil(totalRecord / pagination.pageSize),
              } as TableOptions<EvaluationType>
            }
            showToolbar={false}
          />
        </SettingCard>
      ) : (
        <EmptyResources
          title="No evaluation committee groups"
          content="This semester does not have an evaluation group."
        />
      )}
    </div>
  );
};

export default EvaluationGroups;
