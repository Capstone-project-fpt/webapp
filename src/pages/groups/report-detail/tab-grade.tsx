import { LoadingTableLottie } from "@/components";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminUpdateStudentScoreReportDocumentMutation,
  useGetStudentReportDocumentsQuery,
} from "@/store/api/v1/endpoints/groups";
import { GroupMember, StudentReportDocumentScore } from "@/types/group";
import {
  MentorReviewReportDocumentStatus,
  ReportDocumentCategoryType,
  ReportDocumentType,
} from "@/types/report-document";
import { useState } from "react";
import { useParams } from "react-router";
import UpdateScoreDialog from "./update-score-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserItem, UserTypes } from "@/types/accounts";
import { ResponseErrorType } from "@/types";
import EmptyResources from "@/components/common/empty-resource";

interface TabGradePros {
  members: GroupMember[];
  statusReview: MentorReviewReportDocumentStatus;
  report: ReportDocumentType | null;
}

const TabGrade: React.FC<TabGradePros> = ({
  members,
  statusReview,
  report,
}) => {
  const user = useSelector((state: RootState) => state.auth.user)!;
  const { currentGroup } = useSelector((state: RootState) => state.resource);

  const { groupId, reportId } = useParams<{
    groupId: string;
    reportId: string;
  }>();

  const { data, isError, isLoading } = useGetStudentReportDocumentsQuery(
    {
      capstone_group_id: Number(groupId),
      report_id: Number(reportId),
    },
    { skip: statusReview !== MentorReviewReportDocumentStatus.Done }
  );

  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);

  const studentScores = data ? data.data : [];

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
    return <ErrorBoundaryComponent />;
  }

  const isDisableButtonUpdateScore =
    user.extra_info.teacher?.teacher_id !== currentGroup?.mentor_id;

  return (
    <TabsContent value="grade">
      {studentScores.length > 0 &&
      statusReview === MentorReviewReportDocumentStatus.Done ? (
        <div>
          <ReportDocumentScoreTable
            studentScores={studentScores}
            currentUser={user}
          />
          {report?.type_report ===
            ReportDocumentCategoryType.SEVENTH_REPORT && (
            <div>
              <Label>Conclusion: {report.conclusion}</Label>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-3">
          <EmptyResources
            title="No student score"
            content="Mentor after review need to mark score for each student for this report."
          >
            <Button
              variant="outline"
              className="ml-1 w-[100px]"
              onClick={() => setIsOpenModel(true)}
              disabled={isDisableButtonUpdateScore}
            >
              Update Score
            </Button>
          </EmptyResources>

          {isOpenModel && (
            <UpdateScoreDialog
              onOpenChange={setIsOpenModel}
              open={isOpenModel}
              members={members}
              report={report!}
            />
          )}
        </div>
      )}
    </TabsContent>
  );
};

interface ReportDocumentScoreTablePros {
  studentScores: StudentReportDocumentScore[];
  currentUser: UserItem;
}

const ReportDocumentScoreTable: React.FC<ReportDocumentScoreTablePros> = ({
  studentScores,
  currentUser,
}) => {
  const { toast } = useToast();
  const { groupId } = useParams<{
    groupId: string;
  }>();
  const [updateStudentScore] =
    useAdminUpdateStudentScoreReportDocumentMutation();
  const [scoreEditId, setScoreEditId] = useState<number | null>(null);
  const [newScore, setNewScore] = useState<number>(0);

  const handleUpdateScore = async (id: number, newScore: number) => {
    if (newScore < 0 || newScore > 10) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Update student score",
        description: "score need to be in range from 0 to 10",
      });
      return;
    }

    try {
      await updateStudentScore({
        capstone_group_id: Number(groupId),
        score: newScore,
        id,
      }).unwrap();
      toast({ description: "Update score success", variant: "default" });
    } catch (error) {
      toast({
        title: "Update student score",
        description: (error as ResponseErrorType).data.error,
        variant: "destructive",
        duration: 1000,
      });
    }
    handleCancelUpdateScore();
  };

  const handleCancelUpdateScore = () => {
    setNewScore(0);
    setScoreEditId(null);
  };

  const editScore = (studentScore: StudentReportDocumentScore) => {
    setScoreEditId(studentScore.id);
    setNewScore(studentScore.score);
  };

  const isDisableEdit = currentUser.common_info.user_type !== UserTypes.ADMIN;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Score</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {studentScores.map((studentScore: StudentReportDocumentScore) => (
          <TableRow key={studentScore.student_id}>
            <TableCell className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    studentScore.student.name
                  )}&size=32`}
                  alt={studentScore.student.name}
                />
                <AvatarFallback>
                  {studentScore.student.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{studentScore.student.name}</p>
              </div>
            </TableCell>
            <TableCell>
              {scoreEditId === studentScore.id ? (
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                />
              ) : (
                <div>{studentScore.score}</div>
              )}
            </TableCell>
            <TableCell>
              {scoreEditId === studentScore.id ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateScore(studentScore.id, newScore)}
                  >
                    Save
                  </Button>
                  <Button onClick={() => handleCancelUpdateScore}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <ActionCell
                  items={[
                    {
                      item: "Edit",
                      danger: true,
                      onClick: () => {
                        editScore(studentScore);
                      },
                      isDisable: isDisableEdit,
                    },
                  ]}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TabGrade;
