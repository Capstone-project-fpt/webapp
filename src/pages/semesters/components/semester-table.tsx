import { LoadingTableLottie } from "@/components";
import { DataTable } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetSemestersQuery } from "@/store/api/v1/endpoints/semesters";
import { SemesterType } from "@/types/semester";
import { PaginationState, TableOptions } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";

interface SemesterTableProps {
  searchKey: string;
}

export const SemesterTable: React.FC<SemesterTableProps> = ({ searchKey }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filteredData, setFilteredData] = useState<SemesterType[]>([]);
  const [totalRecord, setTotalRecord] = useState(0);

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetSemestersQuery({
    page: searchKey ? 1 : pagination.pageIndex + 1,
    limit: searchKey ? 1000 : pagination.pageSize,
  });

  useEffect(() => {
    if (queryData) {
      const allData = queryData.data.items;
      if (searchKey) {
        const normalizedSearchKey = searchKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const filtered = allData.filter((item) => {
          const normalizedName = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

          return (
            normalizedName.includes(normalizedSearchKey)
          );
        });
        setFilteredData(filtered);
        setTotalRecord(filtered.length);
      } else {
        setFilteredData(allData);
        setTotalRecord(queryData.data.meta.total);
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
  }

  if (error) {
    return (
      <div className="h-full">
        <ErrorBoundaryComponent />;
      </div>
    );
  }

  return (
    <DataTable
      data={filteredData}
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
};
