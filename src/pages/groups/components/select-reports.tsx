import EmptyResources from "@/components/common/empty-resource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetCapstoneGroupReportDocumentsQuery } from "@/store/api/v1/endpoints/groups";
import { ReportDocumentType } from "@/types/report-document";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface SelectReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectReports: (reports: string[]) => void;
  groupId: number;
  isLoading?: boolean;
}

const ReportItem: React.FC<{
  report: ReportDocumentType;
  isSelected: boolean;
  onChange: () => void;
}> = ({ report, isSelected, onChange }) => (
  <div className="flex items-center p-4 border rounded-md">
    <Checkbox
      id={`report-${report.id}`}
      checked={isSelected}
      onCheckedChange={onChange}
      className="mr-2"
    />
    <label htmlFor={`report-${report.id}`}>
      {report.name} ({report.file_ids.length}{" "}
      {report.file_ids.length > 1 ? "files" : "file"})
      <Badge variant="secondary" className="ml-2">
        {report.type_report}
      </Badge>
    </label>
  </div>
);

const SelectReportsDialog: React.FC<SelectReportsDialogProps> = ({
  open,
  onOpenChange,
  onSelectReports,
  groupId,
  isLoading,
}) => {
  const { data: groupReports } = useGetCapstoneGroupReportDocumentsQuery({
    capstone_group_id: Number(groupId),
  });

  const reports = groupReports?.data || [];
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedReportIds((prev) =>
      prev.includes(id)
        ? prev.filter((reportId) => reportId !== id)
        : [...prev, id]
    );
  };

  const handleSelectReports = () => {
    const file_ids: string[] = selectedReportIds.flatMap((id) => {
      const report = reports.find((report) => report.id === id);
      return report ? report.file_ids : [];
    });
    onSelectReports(file_ids);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Reports</DialogTitle>
          <DialogDescription>Select reports to submit.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          {reports.length ? (
            reports.map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                isSelected={selectedReportIds.includes(report.id)}
                onChange={() => handleCheckboxChange(report.id)}
              />
            ))
          ) : (
            <EmptyResources
              title="No reports"
              content="Your group has no reports yet. Please submit a report."
            >
              <Link to={`/groups/${groupId}/reports`}>
                <Button>Go to Submit Report</Button>
              </Link>
            </EmptyResources>
          )}
        </div>
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            // disabled={selectedReportIds.length === 0 || isLoading}
            onClick={handleSelectReports}
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectReportsDialog;
