import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCapstoneGroupReportDocumentsQuery } from "@/store/api/v1/endpoints/groups";
import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import {
  MentorReviewReportDocumentStatus,
  ReportDocumentType,
} from "@/types/report-document";
import { Button } from "@/components/ui/button";
import { FiFilePlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserItem, UserTypes } from "@/types/accounts";
import { useToast } from "@/hooks/use-toast";
import CreateUpdateReportDocumentDialog from "../components/create-update-report-document-dialog";

const Reports: React.FC = () => {
  const currentUser = useSelector(
    (state: RootState) => state.auth.user as UserItem
  );

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
    if (currentUser.common_info.user_type !== UserTypes.STUDENT) {
      toast({
        title: "Submit Report",
        description: "Only student can submit report",
        variant: "destructive",
        duration: 3000, // 5 seconds
      });

      return;
    }

    setIsCreateUpdateModelOpen(true);
  };

  const categorizedReports = {
    Reviewing: reportData.filter(
      (report) =>
        report.mentor_review_status ===
        MentorReviewReportDocumentStatus.Reviewing
    ),
    Done: reportData.filter(
      (report) =>
        report.mentor_review_status === MentorReviewReportDocumentStatus.Done
    ),
  };

  return (
    <div className="flex flex-row ">
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
        <CreateUpdateReportDocumentDialog
          open={isCreateUpdateModelOpen}
          onOpenChange={setIsCreateUpdateModelOpen}
          reportDocument={undefined}
        />
      </div>
    </div>
  );
};

const CategoryColumn: React.FC<{
  category: string;
  reports: ReportDocumentType[];
}> = ({ category, reports }) => {
  return (
    <div>
      <div className="text-xl">{category}</div>
      {reports.map((report, index) => (
        <ReportCard key={index} report={report} />
      ))}
    </div>
  );
};

const ReportCard: React.FC<{ report: ReportDocumentType }> = ({ report }) => {
  const navigate = useNavigate();

  return (
    <Card
      className={`p-4 cursor-pointer`}
      onClick={() => navigate(`./${report.id}`)}
    >
      <CardHeader>
        <CardTitle>{report.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Type report: {report.type_report}</p>
      </CardContent>
    </Card>
  );
};

export default Reports;
