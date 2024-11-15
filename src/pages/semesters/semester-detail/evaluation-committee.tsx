import { LoadingTableLottie } from "@/components";
import { SettingCard } from "@/components/custom/setting";
import {
  ActionCell,
  DataTable,
  DataTableColumnHeader,
  TextCell,
} from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetEvaluationsQuery } from "@/store/api/v1/endpoints/evaluations";
import { EvaluationType } from "@/types/evaluation";
import {
  ColumnDef,
  PaginationState,
  Row,
  TableOptions,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Actions: React.FC<{ row: Row<EvaluationType> }> = ({ row }) => {
  const navigate = useNavigate();

  return (
    <>
      <ActionCell
        items={[
          {
            item: "View Details",
            onClick: () => {
              navigate(`/evaluation-committees/${row.original.id}`);
            },
          },
        ]}
      />
    </>
  );
};

const columns = (): ColumnDef<EvaluationType>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) => (
      <div className="py-2">
        <TextCell size={200}>{row.original.name}</TextCell>
      </div>
    ),
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
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

const EvaluationGroups: React.FC = () => {
  const { semesterId } = useParams<{ semesterId: string }>();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: queryData,
    error,
    isLoading,
  } = useGetEvaluationsQuery({
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
      <div className=" flex justify-center pt-10 p-5">
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
        title={`Evaluation Committee Groups(${
          queryData ? queryData.data.meta.total : 0
        })`}
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
            } as TableOptions<EvaluationType>
          }
        />
      </SettingCard>
    </div>
  );
};

export default EvaluationGroups;
