import { LoadingTableLottie } from "@/components";
import EmptyResources from "@/components/common/empty-resource";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import { useGetCapstoneGroupReportDocumentsQuery } from "@/store/api/v1/endpoints/groups";
import { UserTypes } from "@/types/accounts";
import React, { useMemo } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreateUpdateReportDocumentDialog from "../components/create-update-report-document-dialog";
import { Badge } from "@/components/ui/badge";

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

  const navigate = useNavigate();

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

  return (
    <SettingCard
      title="Reports"
      actions={
        false && (
          <Button
            onClick={() => {
              handleOpenCreateUpdateReportDocumentDialog();
            }}
          >
            <FiFilePlus />
            Submit Report
          </Button>
        )
      }
    >
      <CreateUpdateReportDocumentDialog
        open={isCreateUpdateModelOpen}
        onOpenChange={setIsCreateUpdateModelOpen}
        reportDocument={undefined}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData && reportData.length > 0 && (
            <>
              {reportData.map((report) => (
                <TableRow>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.type_report}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {report.mentor_review_status}
                    </Badge>
                  </TableCell>
                  <ActionCell
                    items={[
                      {
                        item: "View details",
                        onClick: () => {
                          navigate(`./${report.id}`);
                        },
                      },
                    ]}
                  ></ActionCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
      {(!reportData || !reportData.length) && (
        <EmptyResources title="Empty Report" content="There is no report " />
      )}
    </SettingCard>
  );
};

export default Reports;
