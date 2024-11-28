import DateDisplay from "@/components/common/date";
import { SettingCard } from "@/components/custom/setting";
import { useGetSemesterQuery } from "@/store/api/v1/endpoints/semesters";
import React from "react";
import { useParams } from "react-router-dom";

const Information = () => {
  const { semesterId, tab } = useParams<{ semesterId: string; tab?: string }>();

  const { data, error } = useGetSemesterQuery(
    { id: Number(semesterId) },
    { skip: !semesterId }
  );

  const semester = data?.data;

  return (
    <div>
      <div className="flex-none w-1/4">
        {semester ? (
          <SettingCard title={`${semester.name}`}>
            <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
              <span>Start date</span>
              <DateDisplay
                date={new Date(semester.start_time)}
                format="MMM DD, YYYY"
              />
              <span>End date</span>
              <DateDisplay
                date={new Date(semester.end_time)}
                format="MMM DD, YYYY"
              />
            </div>
          </SettingCard>
        ) : null}
      </div>
    </div>
  );
};

export default Information;
