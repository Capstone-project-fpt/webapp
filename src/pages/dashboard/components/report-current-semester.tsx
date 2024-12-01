/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/store";
import { useGetSemestersWithCountQuery } from "@/store/api/v1/endpoints/semesters";
import { useSelector } from "react-redux";

const ReportStatis: React.FC = () => {

    const currentSemester = useSelector(
        (state: RootState) => state.resource.currentSemester
    );
    const { data: countData, error, isLoading } = useGetSemestersWithCountQuery({
        limit: 10,
        page: 1,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error fetching data</div>;
    }

    const currentData = countData?.data?.items?.find(
        (semester) => semester.id === currentSemester?.id
    );

    const capstoneGroups = (currentData as any)?.total_capstone_groups;
    const evaluationCommittees = (currentData as any)?.total_evaluation_committees;

    return (
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Total Capstone Groups</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{capstoneGroups}</p>
                </CardContent>
            </Card>

            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Total Evaluation Commitee </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{evaluationCommittees}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportStatis;
