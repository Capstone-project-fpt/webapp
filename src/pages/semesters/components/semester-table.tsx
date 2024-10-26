import { LoadingTableLottie } from "@/components";
import { DataTable } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetSemestersQuery } from "@/store/api/v1/endpoints/semesters";
import { SemesterType } from "@/types/semester";
import { PaginationState, TableOptions } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./columns";

export function SemesterTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetSemestersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
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
  } else {
    if (error) {
      return (
        <div className="h-full">
          <ErrorBoundaryComponent />;
        </div>
      );
    }
    return (
      <DataTable
        data={tableData}
        columns={columns}
        state={{ pagination }}
        options={
          {
            onPaginationChange: setPagination,
            manualPagination: true,
            pageCount: Math.ceil(totalRecord / pagination.pageSize),
          } as TableOptions<SemesterType>
        }
      />
    );
  }
}
