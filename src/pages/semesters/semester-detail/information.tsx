import DateDisplay from "@/components/common/date";
import { SettingCard } from "@/components/custom/setting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetSemesterQuery,
  useGetSemestersWithCountQuery,
} from "@/store/api/v1/endpoints/semesters";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlinePersonSearch } from "react-icons/md";
import { useParams } from "react-router-dom";

const Information = () => {
  const { semesterId } = useParams<{ semesterId: string; tab?: string }>();

  const { data } = useGetSemesterQuery(
    { id: Number(semesterId) },
    { skip: !semesterId },
  );

  const { data: semestersCountData } = useGetSemestersWithCountQuery({
    limit: 100,
    page: 1,
  });

  const semesterCount = (semestersCountData?.data?.items || []).find(
    (s) => s.id === Number(semesterId),
  );

  const semester = data?.data;

  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4">
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
      {semesterCount && (
        <>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex gap-1">
                <HiOutlineUserGroup size={18} />
                Total Capstone Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {semesterCount.total_capstone_groups}
              </p>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex gap-1">
                <MdOutlinePersonSearch size={18} />
                Total Evaluation Committee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {semesterCount.total_evaluation_committees}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Information;
