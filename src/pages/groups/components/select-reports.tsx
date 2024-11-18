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
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

interface SelectReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectReports: (reports: string[]) => void;
  groupId: number;
  isLoading?: boolean;
}

const SelectReportsDialog: React.FC<SelectReportsDialogProps> = ({
  open,
  onOpenChange,
  onSelectReports,
  groupId,
  isLoading,
}) => {
  console.log(
    "TODO: [src/pages/groups/components/select-reports.tsx] Fetch reports from API",
    groupId
  );

  const reports = [
    {
      id: 1,
      name: "Report 1",
      file: "report1.pdf",
    },
    {
      id: 2,
      name: "Report 2",
      file: "report2.pdf",
    },
    {
      id: 3,
      name: "Report 3",
      file: "report3.pdf",
    },
  ];

  const [selectReports, setSelectReports] = useState<string[]>([]);

  const handleCheckboxChange = (file: string) => {
    setSelectReports((prevSelectedReports) =>
      prevSelectedReports.includes(file)
        ? prevSelectedReports.filter((report) => report !== file)
        : [...prevSelectedReports, file]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Reports</DialogTitle>
          <DialogDescription>Select reports to submit.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center p-4 border rounded-md"
            >
              <Checkbox
                id={`report-${report.id}`}
                checked={selectReports.includes(report.file)}
                onCheckedChange={() => handleCheckboxChange(report.file)}
                className="mr-2"
              />
              <label htmlFor={`report-${report.id}`}>{report.name}</label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            disabled={selectReports.length === 0 || isLoading}
            onClick={() => onSelectReports(selectReports)}
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
