import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { useMentorUpdateStudentScoreForReportDocumentMutation } from "@/store/api/v1/endpoints/groups";
import { ResponseErrorType } from "@/types";
import { GroupMember, UpdateListStudentScore } from "@/types/group";
import {
  ReportDocumentCategoryType,
  ReportDocumentType,
} from "@/types/report-document";
import { ReloadIcon } from "@radix-ui/react-icons";
import { isNil } from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router";

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
  const [updateStudentScore, { isLoading }] =
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
        duration: 3000,
        variant: "destructive",
        title: "Update student score",
        description: "Need to fill score for all student.",
      });
      return;
    }

    if (studentScores.some((c) => c.score! < 0 || c.score! > 10)) {
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Update student score",
        description: "Score need to be in range from 0 to 10",
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
        duration: 3000,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update student score",
        description: (error as ResponseErrorType).data.error,
        variant: "destructive",
        duration: 3000,
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
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            member.name,
                          )}&size=32`}
                          alt={member.name}
                        />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{member.name}</p>
                        <p className="text-sm">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      value={scores[member.id] ?? ""}
                      onChange={(e) =>
                        handleScoreChange(
                          member.id,
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      placeholder="Enter score"
                      min={0}
                      max={10}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {report.type_report === ReportDocumentCategoryType.SEVENTH_REPORT && (
          <div>
            <Label>Conclusion</Label>
            <Input
              type="text"
              value={conclusion ? conclusion : ""}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Enter conclusion"
            />
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateScoreDialog;
