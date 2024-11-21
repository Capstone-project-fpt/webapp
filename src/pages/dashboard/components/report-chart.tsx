
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
} from "@/components/ui/chart"
import { useGetGroupsQuery } from "@/store/api/v1/endpoints/groups"
import { useGetEvaluationsQuery } from "@/store/api/v1/endpoints/evaluations"
import { useGetSemestersQuery } from "@/store/api/v1/endpoints/semesters"

export function ReportChart() {
  const { data: semestersData, error: semestersError, isLoading: semestersLoading } = useGetSemestersQuery({});
  const { data: groupsData, error: groupsError, isLoading: groupsLoading } = useGetGroupsQuery({});
  const { data: evaluationsData, error: evaluationsError, isLoading: evaluationsLoading } = useGetEvaluationsQuery({});

  if (semestersLoading || groupsLoading || evaluationsLoading) {
    return <div>Loading...</div>;
  }

  if (semestersError || groupsError || evaluationsError) {
    return <div className="text-red-500">Error fetching data</div>;
  }

  if (!semestersData || semestersData?.data?.items?.length === 0) {
    return <div>No semesters available.</div>;
  }

  const currentYear = new Date().getFullYear();
  const fiveYearsAgo = currentYear - 4;


  const filteredSemesters = semestersData?.data?.items?.filter((semester) => {
    const semesterYear = parseInt(semester.name.split(" ")[1], 10); 
    return semesterYear >= fiveYearsAgo && semesterYear <= currentYear;
  });


  const chartData = filteredSemesters.map((semester) => {
    const semesterID = semester.id;
    const capstoneCount = groupsData?.data?.items?.filter(group => group.semester_id === semesterID)?.length || 0;
    const evaluationsCount = evaluationsData?.data?.items?.filter(evaluation => evaluation.semester_id === semesterID)?.length || 0;

    return {
      semester: semester.name,
      capstone: capstoneCount,
      evaluations: evaluationsCount,
    };
  }) || [];

  const chartConfig = {
    capstone: {
      label: "Capstone Groups",
      color: "#000000",
    },
    evaluations: {
      label: "Evaluation Groups",
      color: "#FF5733",
    },
  };

  return (
   
        <Card>
      <CardHeader>
        <CardTitle>Capstone and Evaluation Groups by Semester</CardTitle>
        <CardDescription>Data for the last 5 years</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <ChartContainer config={chartConfig}>
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="semester"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="capstone"
                type="monotone"
                stroke={chartConfig.capstone.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="evaluations"
                type="monotone"
                stroke={chartConfig.evaluations.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by this semester <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  
  );
}

export default ReportChart;

