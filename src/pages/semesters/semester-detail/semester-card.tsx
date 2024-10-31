import React from "react";
import { useGetSemesterQuery } from "@/store/api/v1/endpoints/semesters";
import { SemesterType } from "@/types/semester";
import { DateCell } from "@/components/data-table";

const SemesterCard: React.FC<{ id: number }> = ({ id }) => {
  const { data, isLoading, error } = useGetSemesterQuery({ id });
  const semester: SemesterType | undefined = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading semester details</div>;
  }

  if (!semester) {
    return <div>No semester found with the given ID.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{semester.name}</h2>
      <div>
        <div className="flex items-center">
          Start Date:
          <span>
            <DateCell date={new Date(semester.start_time)}></DateCell>
          </span>
        </div>
        <div className="flex items-center">
          End Date:
          <span>
            <DateCell date={new Date(semester.end_time)}></DateCell>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SemesterCard;
