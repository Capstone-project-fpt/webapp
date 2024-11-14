import { LoadingTableLottie } from "@/components";
import { DataTable } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetUsersQuery } from "@/store/api/v1/endpoints/admin";
import { LectureType, UserTypes } from "@/types/accounts";
import { PaginationState, TableOptions } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";

interface LecturesTableProps {
  searchKey: string;
}

export function LecturesTable({ searchKey }: LecturesTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [tableData, setTableData] = useState<LectureType[]>([]);
  const [totalRecord, setTotalRecord] = useState(0);

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetUsersQuery({
    page: searchKey ? 1 : pagination.pageIndex + 1,
    limit: searchKey ? 1000 : pagination.pageSize,
    user_types: UserTypes.TEACHER,
  });

  useEffect(() => {
    if (queryData) {
      const { items, meta } = queryData.data;

      const data = (items || []).map(({ common_info, extra_info }) => {
        const lecture = extra_info?.teacher;
        return {
          ...common_info,
          ...lecture,
        };
      });

      const normalizedSearchKey = searchKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filteredData = data.filter((item) => {
        const normalizedName = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedEmail = item.email.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedName.includes(normalizedSearchKey) || normalizedEmail.includes(normalizedSearchKey);
      });

      setTableData(filteredData as LectureType[]);
      setTotalRecord(filteredData.length);
    }
  }, [queryData, searchKey]);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-10">
        <div className="w-[250px]">
          <LoadingTableLottie />
        </div>
      </div>
    );
  } else if (error) {
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
      options={{
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: Math.ceil(totalRecord / pagination.pageSize),
      } as TableOptions<LectureType>}
    />
  );
}