/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useGetSemestersWithCountQuery } from "@/store/api/v1/endpoints/semesters";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ReportChart() {
  const {
    data: countData,
    error,
    isLoading,
  } = useGetSemestersWithCountQuery({
    limit: 10,
    page: 1,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  const filterLast5Years = (data: any[]) => {
    const currentYear = new Date().getFullYear();
    return data.filter((semester: any) => {
      const semesterYear = new Date(semester.start_time).getFullYear();
      return semesterYear <= currentYear && semesterYear > currentYear - 5;
    });
  };

  useEffect(() => {
    if (countData) {
      const filteredData = filterLast5Years(countData.data.items);
      const formattedData = filteredData.map((semester) => ({
        semester: semester.name,
        capstone: semester.total_capstone_groups,
        evaluations: semester.total_evaluation_committees,
      })).reverse();

      setChartData(formattedData);
    }
  }, [countData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error fetching data</div>;
  }

  const chartConfig = {
    capstone: {
      label: "Capstone Groups",
      color: "#000000",
    },
    evaluations: {
      label: "Evaluation Committee Groups",
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
                name={chartConfig.capstone.label}
                stroke={chartConfig.capstone.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="evaluations"
                type="monotone"
                name={chartConfig.evaluations.label}
                stroke={chartConfig.evaluations.color}
                strokeWidth={2}
                dot={false}
              ></Line>
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
