import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/store";
import { useGetEvaluationsQuery } from "@/store/api/v1/endpoints/evaluations";
import { useGetGroupsQuery } from "@/store/api/v1/endpoints/groups";
import React from "react";
import { useSelector } from "react-redux";

const ReportStatis: React.FC = () => {

    const currentSemester = useSelector(
        (state: RootState) => state.resource.currentSemester
    );
    const { data: groupData, error: groupError, isLoading: isLoadingGroups } = useGetGroupsQuery({
        limit: 1, page: 1,
        semester_id: currentSemester?.id,
    });

    const { data: evaluationData, error: evaluationError, isLoading: isLoadingEvaluations } = useGetEvaluationsQuery({
        limit: 1, page: 1,
        semester_id: currentSemester?.id,
    });


    const isLoading = isLoadingGroups || isLoadingEvaluations ;
    const error = groupError || evaluationError ;


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error fetching data</div>;
    }

    return (
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Total Capstone Groups</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{groupData?.data?.meta?.total}</p>
                </CardContent>
            </Card>

            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Total Evaluation Commitee </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{evaluationData?.data?.meta?.total}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportStatis;
