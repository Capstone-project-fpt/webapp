import { LoadingTableLottie } from "@/components";
import { DataTable } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetUsersQuery } from "@/store/api/v1/endpoints/user";
import { StudentType, UserTypes } from "@/types/accounts";
import { PaginationState, TableOptions } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";

interface StudentsTableProps {
  searchKey: string;
}

export function StudentsTable({ searchKey }: StudentsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [tableData, setTableData] = useState<StudentType[]>([]);
  const [totalRecord, setTotalRecord] = useState(0);

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetUsersQuery({
    page: searchKey ? 1 : pagination.pageIndex + 1,
    limit: searchKey ? 1000 : pagination.pageSize,
    user_types: UserTypes.STUDENT,
  });

  useEffect(() => {
    if (queryData) {
      const { items, meta } = queryData.data;

      const data = (items || []).map(({ common_info, extra_info }) => {
        const student = extra_info?.student;
        return {
          ...common_info,
          ...student,
        };
      });

      if (searchKey) {
        const normalizedSearchKey = searchKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const filteredData = data.filter((item) => {
          const normalizedName = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const normalizedEmail = item.email.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return normalizedName.includes(normalizedSearchKey) || normalizedEmail.includes(normalizedSearchKey);
        });

        setTableData(filteredData as StudentType[]);
        setTotalRecord(filteredData.length);
      } else {
        setTableData(data as StudentType[]);
        setTotalRecord(meta.total);
      }
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
      } as TableOptions<StudentType>}
    />
  );
}
