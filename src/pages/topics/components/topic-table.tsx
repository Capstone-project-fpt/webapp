import { LoadingTableLottie } from "@/components";
import { DataTable } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetTopicsQuery } from "@/store/api/v1/endpoints/topics";
import { TopicType } from "@/types/topic";
import { PaginationState, TableOptions } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import React from "react";
import { UserTypes } from "@/types/accounts";

interface TopicTableProps {
  currentUserType: UserTypes;
}

export const TopicTable: React.FC<TopicTableProps> = ({ currentUserType }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const [tableData, setTableData] = useState<TopicType[]>([]);
  // const [totalRecord, setTotalRecord] = useState(0);

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetTopicsQuery({
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
        columns={columns(currentUserType)}
        state={{ pagination }}
        options={
          {
            onPaginationChange: setPagination,
            manualPagination: true,
            pageCount: Math.ceil(totalRecord / pagination.pageSize),
          } as TableOptions<TopicType>
        }
      />
    );
  }
};
