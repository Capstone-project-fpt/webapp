import { LoadingTableLottie } from "@/components";
import { SettingCard } from "@/components/custom/setting";
import {
  DataTable,
  DataTableColumnHeader,
  TextCell,
} from "@/components/data-table";
import { useGetEvaluationsQuery } from "@/store/api/v1/endpoints/evaluations";
import { useGetCurrentSemesterQuery } from "@/store/api/v1/endpoints/semesters"; 
import { EvaluationType } from "@/types/evaluation";
import { ColumnDef, PaginationState, TableOptions } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { skipToken } from '@reduxjs/toolkit/query/react';

const columns = (): ColumnDef<EvaluationType>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} columnTitle="Name" />
    ),
    cell: ({ row }) =>
      <div  className="py-2"> 
        <TextCell size={200} >{row.original.name}</TextCell>
      </div> 
    
  },
  // {
  //   accessorKey: "",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} columnTitle="Total Members" />
  //   ),
  //   cell: ({ row }) => <TextCell size={200}>{row.original.total_members}</TextCell>,
  // },
];

const EvaluationGroups: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: currentSemesterData,
    error: currentSemesterError,
    isLoading: isCurrentSemesterLoading,
  } = useGetCurrentSemesterQuery(null);
  const {
    data: queryData,
    error: evaluationsError,
    isLoading: isEvaluationsLoading,
  } = useGetEvaluationsQuery(
    currentSemesterData?.data?.id
      ? {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          semester_id: currentSemesterData.data.id, 
        }
      : skipToken 
  );

  const tableData = useMemo(() => {
    return queryData ? queryData.data.items : [];
  }, [queryData]);

  const totalRecord = useMemo(() => {
    return queryData ? queryData.data.meta.total : 0;
  }, [queryData]);

  if (isCurrentSemesterLoading || isEvaluationsLoading) {
    return (
      <div className="flex justify-center pt-10 ">
        <div className="w-[250px]">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (currentSemesterError || evaluationsError) {
    return <div>Something went wrong!</div>;
  }

  return (
    <div>
      {currentSemesterData ? (
        <SettingCard
          title={`Evaluation Committee Groups (${totalRecord})`}
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
      ) : (
        <div>This semester does not have an evaluation group.</div>
      )}
    </div>
  );
};

export default EvaluationGroups;
