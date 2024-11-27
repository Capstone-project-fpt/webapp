import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GroupMember, UpdateListStudentScore } from "@/types/group";
import {
  ReportDocumentCategoryType,
  ReportDocumentType,
} from "@/types/report-document";
import { useParams } from "react-router";
import { isNil } from "lodash";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useMentorUpdateStudentScoreForReportDocumentMutation } from "@/store/api/v1/endpoints/groups";
import { ResponseErrorType } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UpdateScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: GroupMember[];
  report: ReportDocumentType;
}

const UpdateScoreDialog: React.FC<UpdateScoreDialogProps> = ({
  onOpenChange,
  open,
  members,
  report,
}) => {
  const { toast } = useToast();
  const { groupId } = useParams<{ groupId: string }>();
  const [updateStudentScore] =
    useMentorUpdateStudentScoreForReportDocumentMutation();

  const [scores, setScores] = useState<{ [key: number]: number | null }>({});
  const [conclusion, setConclusion] = useState<string | null>(null);

  const handleScoreChange = (studentId: number, score: number | null) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: score,
    }));
  };

  const handleSave = async () => {
    const studentScores = members.map((m) => ({
      student_id: m.id,
      score: scores[m.id] || null,
    }));

    if (studentScores.some((c) => isNil(c.score))) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Update student score",
        description: "Need to fill score for all student.",
      });
      return;
    }

    if (studentScores.some((c) => c.score! < 0 || c.score! > 10)) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Update student score",
        description: "score need to be in range from 0 to 10",
      });
      return;
    }

    const dataUpdate: UpdateListStudentScore = {
      capstone_group_id: Number(groupId),
      report_document_id: report.id,
      student_score_data: studentScores,
      conclusion,
    };

    try {
      await updateStudentScore(dataUpdate).unwrap();
      toast({
        title: "Update student score",
        description: "Update student score successfully",
        duration: 1000,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update student score",
        description: (error as ResponseErrorType).data.error,
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Update Score</DialogTitle>
          <DialogDescription>
            Update scores for students of this report.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {member.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      value={scores[member.id] ?? ""}
                      onChange={(e) =>
                        handleScoreChange(
                          member.id,
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      placeholder="Enter score"
                      min={0}
                      max={10}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {report.type_report === ReportDocumentCategoryType.SEVENTH_REPORT && (
          <div>
            <Label>Conclusion</Label>
            <Input
              type="text"
              value={conclusion ? conclusion : ""}
              onChange={(e) => setConclusion(e.target.value)}
            />
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateScoreDialog;
