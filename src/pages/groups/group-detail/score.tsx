import { LoadingTableLottie } from "@/components";
import EmptyResources from "@/components/common/empty-resource";
import { SettingCard } from "@/components/custom/setting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFinalizedScoreStudentMutation,
  useGetCapstoneGroupReportDocumentsQuery,
} from "@/store/api/v1/endpoints/groups";
import { MentorReviewReportDocumentStatus } from "@/types/report-document";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Score: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [finalizedScoreStudent, { data: finalScoreData, isLoading, isError }] =
    useFinalizedScoreStudentMutation();
  const { data: reportsData } = useGetCapstoneGroupReportDocumentsQuery(
    {
      capstone_group_id: Number(groupId),
    },
    { skip: !groupId },
  );

  useEffect(() => {
    if (reportsData) {
      const reports = reportsData.data;
      const isFinalized = reports.every(
        (report) =>
          report.mentor_review_status === MentorReviewReportDocumentStatus.Done,
      );
      if (isFinalized) {
        finalizedScoreStudent({ capstone_group_id: Number(groupId) });
      }
    }
  }, [reportsData, finalizedScoreStudent, groupId]);

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <SettingCard title="Final Score">
        <EmptyResources
          title="No final score"
          content="The final score will be calculated after the group finishes the reports."
        />
      </SettingCard>
    );
  }

  return (
    <SettingCard title="Final Score">
      {finalScoreData ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="">Score</TableHead>
              <TableHead className="">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(finalScoreData.data || []).map((studentScore) => (
              <TableRow key={studentScore.student_id}>
                <TableCell className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        studentScore.student.name,
                      )}&size=32`}
                      alt={studentScore.student.name}
                    />
                    <AvatarFallback>
                      {studentScore.student.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{studentScore.student.name}</p>
                    <p className="text-sm ">{studentScore.student.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{studentScore.score ? studentScore.score : "-"}</div>
                </TableCell>
                <TableCell>
                  {studentScore.status === "pass" ? (
                    <Badge variant="success"> Pass</Badge>
                  ) : (
                    <Badge variant="destructive">Fail</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyResources
          title="No final score"
          content="The final score will be calculated after the group finishes the reports."
        />
      )}
    </SettingCard>
  );
};

export default Score;
