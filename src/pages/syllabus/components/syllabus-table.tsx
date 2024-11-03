// import { LoadingTableLottie } from "@/components";
// import { DataTable } from "@/components/data-table";
// import ErrorBoundaryComponent from "@/components/error/error-boundary";
// import { useGetSyllabusesQuery } from "@/store/api/v1/endpoints/syllabus";
// import { SyllabusType } from "@/types/syllabus";
// import { PaginationState, TableOptions } from "@tanstack/react-table";
// import { useMemo, useState } from "react";
// import { columns } from "./columns";

// export function SyllabusTable() {
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const {
//     data: queryData,
//     isLoading,
//     error,
//   } = useGetSyllabusesQuery({
//     page: pagination.pageIndex + 1,
//     limit: pagination.pageSize,
//   });

//   const tableData = useMemo(() => {
//     return queryData ? queryData.data.items : [];
//   }, [queryData]);

//   const totalRecord = useMemo(() => {
//     return queryData ? queryData.data.meta.total : 0;
//   }, [queryData]);

//   if (isLoading) {
//     return (
//       <div className=" flex justify-center pt-10">
//         <div className=" w-[250px] ">
//           <LoadingTableLottie />
//         </div>
//       </div>
//     );
//   } else {
//     if (error) {
//       return (
//         <div className="h-full">
//           <ErrorBoundaryComponent />;
//         </div>
//       );
//     }
//     return (
//       <DataTable
//         data={tableData}
//         columns={columns}
//         state={{ pagination }}
//         options={
//           {
//             onPaginationChange: setPagination,
//             manualPagination: true,
//             pageCount: Math.ceil(totalRecord / pagination.pageSize),
//           } as TableOptions<SyllabusType>
//         }
//       />
//     );
//   }
// }

//Đoạn dưới này test data
import { DataTable } from "@/components/data-table";
import { SyllabusType } from "@/types/syllabus";
import { PaginationState, TableOptions } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { columns } from "./columns";

const fakeSyllabuses: SyllabusType[] = [
  {
    id: 1,
    name: "Mathematics 101",
    code: "MATH101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 2,
    name: "Physics 101",
    code: "PHYS101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 3,
    name: "Chemistry 101",
    code: "CHEM101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 4,
    name: "Biology 101",
    code: "BIO101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 5,
    name: "History 101",
    code: "HIST101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 6,
    name: "Geography 101",
    code: "GEO101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 7,
    name: "Literature 101",
    code: "LIT101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 8,
    name: "Computer Science 101",
    code: "CS101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 9,
    name: "Economics 101",
    code: "ECO101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
  {
    id: 10,
    name: "Philosophy 101",
    code: "PHIL101",
    path: "https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=10297",
  },
];

export function SyllabusTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return fakeSyllabuses.slice(start, end);
  }, [pagination]);

  const totalRecord = useMemo(() => {
    return fakeSyllabuses.length;
  }, []);

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
        } as TableOptions<SyllabusType>
      }
    />
  );
}
