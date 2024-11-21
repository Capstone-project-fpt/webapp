import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/store";
import { useGetUsersQuery } from "@/store/api/v1/endpoints/admin";
import { useGetEvaluationsQuery } from "@/store/api/v1/endpoints/evaluations";
import { useGetGroupsQuery } from "@/store/api/v1/endpoints/groups";
import { UserTypes } from "@/types/accounts";
import React from "react";
import { useSelector } from "react-redux";

const ReportStatis: React.FC = () => {

    const currentSemester = useSelector(
        (state: RootState) => state.resource.currentSemester
    );
    const { data: studentData, error: studentError, isLoading: isLoadingStudents } = useGetUsersQuery({
        user_types: UserTypes.STUDENT,
    })
    const { data: groupData, error: groupError, isLoading: isLoadingGroups } = useGetGroupsQuery({
        semester_id: currentSemester?.id,
    });

    const { data: evaluationData, error: evaluationError, isLoading: isLoadingEvaluations } = useGetEvaluationsQuery({

        semester_id: currentSemester?.id,
    });


    const isLoading = isLoadingGroups || isLoadingEvaluations || isLoadingStudents;
    const error = groupError || evaluationError || studentError;


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
                    <CardTitle>Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{studentData?.data?.meta?.total}</p>
                </CardContent>
            </Card>

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
                    <CardTitle>Total Evaluators</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{evaluationData?.data?.meta?.total}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportStatis;
