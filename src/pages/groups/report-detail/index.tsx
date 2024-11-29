import { LoadingTableLottie } from "@/components";
import Comment from "@/components/common/comment";
import DateDisplay from "@/components/common/date";
import EmptyResources from "@/components/common/empty-resource";
import { ActionDialog } from "@/components/custom/action-dialog";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import {
  useCreateReportCommentMutation,
  useDeleteReportCommentMutation,
  useGetCapstoneGroupReportDocumentQuery,
  useGetMembersQuery,
  useGetReportCommentsQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { ResponseErrorType, ResponseType } from "@/types";
import { CommentType } from "@/types/common";
import { ReportComment } from "@/types/group";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";
import { Content } from "@tiptap/core";
import { FileIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import CommentComposer from "../components/comment-composer";
import TabGrade from "./tab-grade";
import CreateUpdateReportDocumentDialog from "../components/create-update-report-document-dialog";

interface DeleteDialogProps {
  comment: CommentType;
  groupId: string;
  reportId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetchComments: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  comment,
  groupId,
  reportId,
  open,
  onOpenChange,
  refetchComments,
}) => {
  const { toast } = useToast();
  const [deleteReportComment, data] = useDeleteReportCommentMutation();

  const handleDelete = async () => {
    try {
      if (comment && comment.id) {
        const deleteData = await deleteReportComment({
          comment_id: comment.id,
          group_id: parseInt(groupId),
          report_id: parseInt(reportId),
        }).unwrap();
        toast({
          duration: 1000,
          title: "Delete Comment Report",
          description: deleteData.data || "Delete comment successfully.",
        });
        onOpenChange(false);
        refetchComments();
      }
    } catch (error) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Delete Comment Report",
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Comment Report"
      danger
      cancelButton
      okButton={{
        label: "Delete",
        onClick: handleDelete,
        isLoading: data.isLoading,
      }}
      confirmText="I understand that this action cannot be undone."
    >
      {`Are you sure you want to delete the comment ?`}
    </ActionDialog>
  );
};

interface CommentSectionProps {
  commentsData: ResponseType<ReportComment[]>;
  groupId: string;
  reportId: string;
  refetchComments: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  commentsData,
  groupId,
  reportId,
  refetchComments,
}) => {
  const { toast } = useToast();
  const [createReportComment, { isLoading }] = useCreateReportCommentMutation();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [comment, setComment] = useState<Content>("");
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>();

  useEffect(() => {
    if (commentsData) {
      const comments = (commentsData.data || []).map((item) => ({
        id: item.id,
        content: item.message,
        user: item.user,
        created_at: item.created_at,
      }));
      setComments(comments);
    }
    console.log(commentsData);
  }, [commentsData]);

  const handleComment = async () => {
    try {
      const createData = await createReportComment({
        group_id: parseInt(groupId),
        report_id: parseInt(reportId),
        message: comment as string,
      }).unwrap();

      setComment("");
      refetchComments();
      toast({
        duration: 1000,
        variant: "default",
        title: "Comment Report",
        description: createData.data || "Comment Topic Successfully.",
      });
    } catch (error) {
      toast({
        title: "Comment Report",
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <DeleteDialog
              comment={comment}
              groupId={groupId}
              reportId={reportId}
              open={deleteCommentId === comment.id}
              onOpenChange={(open) => {
                if (open) {
                  setDeleteCommentId(comment.id);
                } else {
                  setDeleteCommentId(null);
                }
              }}
              refetchComments={refetchComments}
            />
            <Comment
              comment={comment}
              actions={
                <ActionCell
                  items={[
                    {
                      item: "Delete",
                      danger: true,
                      onClick: () => {
                        setDeleteCommentId(comment.id);
                      },
                    },
                  ]}
                />
              }
            />
          </div>
        ))
      ) : (
        <EmptyResources
          title="No comments yet."
          content="There are no comments for this topic."
          shape="empty-messages"
        />
      )}
      <div>
        <CommentComposer
          value={comment}
          setValue={setComment}
          handleComment={handleComment}
          isLoading={{ isLoading }.isLoading}
        />
      </div>
    </div>
  );
};

const ReportDetail: React.FC = () => {
  const { groupId, reportId } = useParams<{
    groupId: string;
    reportId?: string;
  }>();
  const dispatch = useDispatch();
  const { currentGroup } = useSelector((state: RootState) => state.resource);
  const [isOpenModalUpdateReport, setIsOpenModalUpdateReport] = useState(false);

  const { data, isError, isLoading } = useGetCapstoneGroupReportDocumentQuery({
    capstone_group_id: Number(groupId),
    report_id: Number(reportId),
  });

  const { data: memberGroupData } = useGetMembersQuery(
    {
      group_id: Number(groupId),
    },
    { skip: !groupId }
  );

  const memberGroups = useMemo(() => {
    return memberGroupData ? memberGroupData.data.members : [];
  }, [memberGroupData]);

  const reportData = useMemo(() => {
    return data ? data.data : null;
  }, [data]);

  const { data: commentsData, refetch: refetchComments } =
    useGetReportCommentsQuery({
      group_id: parseInt(groupId!),
      report_id: parseInt(reportId!),
    });

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        { title: currentGroup?.name_group, link: `/groups/${groupId}` },
        { title: "Reports", link: `/groups/${groupId}/reports` },
        {
          title: reportData?.name,
          link: `/groups/${groupId}/reports/${reportId}`,
        },
      ])
    );
  }, [dispatch, groupId, reportId, reportData, currentGroup]);

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

  return (
    <div>
      {reportData && (
        <div className="flex justify-between">
          <div>
            <div className="text-xl mb-4">{reportData.name}</div>
            <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
              <span>Status</span>
              <div>
                <Badge variant="outline" className="capitalize">
                  {reportData.mentor_review_status}
                </Badge>
              </div>
              <span>Submit date</span>
              <DateDisplay
                date={new Date(reportData?.created_at)}
                showTime={true}
              />
              <span>Update date</span>
              <DateDisplay
                date={new Date(reportData.updated_at)}
                showTime={true}
              />
            </div>
          </div>
          <div>
            <Button onClick={() => setIsOpenModalUpdateReport(true)}>
              Update Report
            </Button>
            {isOpenModalUpdateReport && (
              <CreateUpdateReportDocumentDialog
                onOpenChange={setIsOpenModalUpdateReport}
                open={isOpenModalUpdateReport}
                key={reportId}
                reportDocument={reportData}
              />
            )}
          </div>
        </div>
      )}

      {/* Attachments */}
      <div className="my-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="">Attachments</h2>
          <FaRegEdit />
        </div>
        <div className="flex gap-4 flex-wrap">
          {reportData?.file_ids.map((file, index) => (
            <div
              key={index}
              className="flex items-center border px-5 py-3 rounded-lg max-w-[512px]"
            >
              <FileIcon className="mr-2" />
              <span className="truncate">{getFileName(file)}</span>
              <Button variant={"outline"} className="ml-3" size="sm">
                <a
                  href={getUrlFile(file)}
                  download={getFileName(file)}
                  className="text-accent underline flex items-center"
                  target="_blank"
                >
                  Download
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      <Tabs defaultValue="comments" className="my-4">
        <TabsList>
          <TabsTrigger value="comments" className="lg:w-[150px] w-full">
            Comments
          </TabsTrigger>
          <TabsTrigger value="grade" className="lg:w-[150px] w-full">
            Grade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments">
          <CommentSection
            commentsData={commentsData!}
            groupId={groupId!}
            reportId={reportId!}
            refetchComments={refetchComments}
          />
        </TabsContent>
        <TabGrade
          members={memberGroups}
          statusReview={reportData!.mentor_review_status}
          report={reportData}
        />
      </Tabs>
    </div>
  );
};

export default ReportDetail;
