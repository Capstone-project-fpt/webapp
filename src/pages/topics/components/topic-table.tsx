import { LoadingTableLottie } from "@/components";
import { DataTable } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetTopicReferencesQuery } from "@/store/api/v1/endpoints/topics";
import { TopicType } from "@/types/topic";
import { PaginationState, TableOptions } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./columns";
import React from "react";
import { UserTypes } from "@/types/accounts";

interface TopicTableProps {
  currentUserType: UserTypes;
  searchKey: string;
}

export const TopicTable: React.FC<TopicTableProps> = ({ currentUserType, searchKey }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filteredData, setFilteredData] = useState<TopicType[]>([]);
  const [totalRecord, setTotalRecord] = useState(0);

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetTopicReferencesQuery({
    page: searchKey ? 1 : pagination.pageIndex + 1,
    limit: searchKey ? 1000 : pagination.pageSize,
  });

  // const tableData = useMemo(() => {
  //   return queryData ? queryData.data.items : [];
  // }, [queryData]);

  useEffect(() => {
    if (queryData) {
      const allData = queryData.data.items;
      if (searchKey) {
        const normalizedSearchKey = searchKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const filtered = allData.filter((item) => {
          const normalizedName = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const normalizedPath = item.teacher.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return (
            normalizedName.includes(normalizedSearchKey) ||
            normalizedPath.includes(normalizedSearchKey)
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
  } else if (error) {
    return (
      <div className="h-full">
        <ErrorBoundaryComponent />;
      </div>
    );
  }

  return (
    <DataTable
      data={filteredData}
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
};
