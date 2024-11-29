import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import { useGetCapstoneGroupReportDocumentsQuery } from "@/store/api/v1/endpoints/groups";
import { UserTypes } from "@/types/accounts";
import {
  MentorReviewReportDocumentStatus,
  ReportDocumentType,
} from "@/types/report-document";
import React, { useMemo } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreateUpdateReportDocumentDialog from "../components/create-update-report-document-dialog";
import { Label } from "@/components/ui/label";
import EmptyResources from "@/components/common/empty-resource";

const Reports: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { groupId } = useParams<{ groupId: string }>();
  const { toast } = useToast();
  const [isCreateUpdateModelOpen, setIsCreateUpdateModelOpen] =
    React.useState(false);

  const { data, isError, isLoading } = useGetCapstoneGroupReportDocumentsQuery({
    capstone_group_id: Number(groupId),
  });

  const reportData = useMemo(() => {
    return data ? data.data : [];
  }, [data]);

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

  const handleOpenCreateUpdateReportDocumentDialog = () => {
    if (
      currentUser &&
      currentUser.common_info.user_type !== UserTypes.STUDENT
    ) {
      toast({
        title: "Submit Report",
        description: "Only member in the group can submit report",
        variant: "destructive",
      });

      return;
    }

    setIsCreateUpdateModelOpen(true);
  };

  const categorizedReports = {
    Reviewing: (reportData || []).filter(
      (report) =>
        report.mentor_review_status ===
        MentorReviewReportDocumentStatus.Reviewing
    ),
    Done: (reportData || []).filter(
      (report) =>
        report.mentor_review_status === MentorReviewReportDocumentStatus.Done
    ),
  };

  return (
    <div className="flex flex-row w-full">
      <CreateUpdateReportDocumentDialog
        open={isCreateUpdateModelOpen}
        onOpenChange={setIsCreateUpdateModelOpen}
        reportDocument={undefined}
      />
      {!reportData || reportData.length === 0 ? (
        <div className="w-full">
          <EmptyResources
            title="Your group has no report yet"
            content="Submit your report to your mentor for review and feedback"
          >
            <Button
              onClick={() => {
                handleOpenCreateUpdateReportDocumentDialog();
              }}
            >
              <FiFilePlus />
              Submit Report
            </Button>
          </EmptyResources>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-4/5">
            {Object.entries(categorizedReports).map(([category, reports]) => (
              <CategoryColumn
                key={category}
                category={category}
                reports={reports}
              />
            ))}
          </div>
          <div className="w-1/5 flex">
            <Button
              onClick={() => {
                handleOpenCreateUpdateReportDocumentDialog();
              }}
            >
              <FiFilePlus />
              Submit Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const CategoryColumn: React.FC<{
  category: string;
  reports: ReportDocumentType[];
}> = ({ category, reports }) => {
  return (
    <div>
      <Label className="text-xl">{category}</Label>
      <div className="flex flex-col gap-2">
        {reports.map((report, index) => (
          <ReportCard key={index} report={report} />
        ))}
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ report: ReportDocumentType }> = ({ report }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 w-full border rounded-lg cursor-pointer"
      onClick={() => navigate(`./${report.id}`)}
    >
      <Label className="text-xl">{report.name}</Label>
      <p>Type report: {report.type_report}</p>
    </div>
  );
};

export default Reports;
