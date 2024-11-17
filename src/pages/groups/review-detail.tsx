import { LoadingTableLottie } from "@/components";
import Comment from "@/components/common/comment";
import DateDisplay from "@/components/common/date";
import EmptyResources from "@/components/common/empty-resource";
import { ActionDialog } from "@/components/custom/action-dialog";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getDuration } from "@/lib/schedule-review";
import { RootState } from "@/store";
import {
  useFeedbackGroupReviewMutation,
  useGetGroupReviewQuery,
  useGetGroupScheduleReviewQuery,
  useUpdateReportsGroupReviewMutation,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { ResponseErrorType } from "@/types";
import { GroupReview } from "@/types/group";
import { ScheduleType } from "@/types/schedule";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";
import { Content } from "@tiptap/core";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import CommentComposer from "./components/comment-composer";
import SelectReportsDialog from "./components/select-reports";

interface ReviewHeaderProps {
  review: GroupReview;
  reviewSchedule: ScheduleType;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  review,
  reviewSchedule,
}) => {
  return (
    <div>
      <div className=" mb-4">
        <div className="text-xl">{reviewSchedule.title}</div>
        <span>{reviewSchedule.description}</span>
      </div>

      <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
        <span>Status</span>
        <div>TODO STATUS</div>
        <span>Due</span>
        <DateDisplay
          date={new Date(reviewSchedule.start_time)}
          showTime={true}
        />
        <span>Review Time</span>
        <DateDisplay
          date={new Date(reviewSchedule.start_time)}
          showTime={true}
        />
        <span>Duration</span>
        <span>
          {getDuration({
            startTime: reviewSchedule.start_time,
            endTime: reviewSchedule.end_time,
          })}
        </span>
        <span>Link Meeting</span>
        <a
          href={reviewSchedule.link_meeting}
          target="_blank"
          rel="noopener noreferrer"
        >
          {reviewSchedule.link_meeting}
        </a>
      </div>
    </div>
  );
};

interface DocumentSectionProps {
  review: GroupReview;
  reviewSchedule: ScheduleType;
  refetchReview?: () => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
  review,
  reviewSchedule,
  refetchReview,
}) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateReports, updateReportsData] =
    useUpdateReportsGroupReviewMutation();
  const handleSelectReports = async (reports: string[]) => {
    try {
      const { data } = await updateReports({
        group_id: review.capstone_group_id,
        capstone_group_review_id: review.id,
        report_files: reports,
      }).unwrap();

      if (refetchReview) {
        refetchReview();
      }

      toast({
        title: `Select reports`,
        description: data || "Select reports successfully.",
      });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: `Select reports`,
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="">Reports</h2>
        {new Date() < new Date(reviewSchedule.start_time) && (
          <FaRegEdit
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
        )}

        <SelectReportsDialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          groupId={review.capstone_group_id}
          onSelectReports={handleSelectReports}
          isLoading={updateReportsData.isLoading}
        />
      </div>
      <div className="flex gap-4">
        {review.report_files.map((report, index) => (
          <div
            key={index}
            className="flex items-center border px-5 py-3 rounded-lg max-w-lg"
          >
            <FileIcon className="mr-2" />
            <span className="truncate">{getFileName(report)}</span>
            <Button variant={"outline"} className="ml-3" size="sm">
              <a
                href={getUrlFile(report)}
                download={getFileName(report)}
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
  );
};

interface FeedbackSectionProps {
  review: GroupReview;
  refetchReview?: () => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  review,
  refetchReview,
}) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Content>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [feedbackGroupReview, feedbackGroupReviewData] =
    useFeedbackGroupReviewMutation();

  const handleComment = async (isDelete = false) => {
    try {
      const commentData = await feedbackGroupReview({
        group_id: review.capstone_group_id,
        capstone_group_review_id: review.id,
        feedback: feedback as string,
      }).unwrap();

      setFeedback("");
      toast({
        duration: 1000,
        variant: "default",
        title: `${isDelete ? "Delete feedback review" : "isDelete"}`,
        description: commentData.data || "Feedback review Successfully.",
      });

      if (refetchReview) {
        refetchReview();
      }
    } catch (error) {
      toast({
        title: `${isDelete ? "Delete feedback review" : "isDelete"}`,
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      {review.feedback ? (
        <>
          <ActionDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            title="Delete feedback"
            danger
            cancelButton
            okButton={{
              label: "Delete",
              onClick: async () => {
                handleComment(true);
              },
              isLoading: feedbackGroupReviewData.isLoading,
            }}
            confirmText="I understand that this action cannot be undone."
          >
            {`Are you sure you want to delete the feedback ?`}
          </ActionDialog>
          <Comment
            comment={{
              content: review.feedback,
              created_at: review.updated_at,
            }}
            actions={
              <ActionCell
                items={[
                  {
                    item: "Delete",
                    danger: true,
                    onClick: () => {
                      setFeedback("");
                      setIsDeleteOpen(true);
                    },
                  },
                ]}
              />
            }
          />
        </>
      ) : (
        <EmptyResources
          title="No feedback yet"
          content="The evaluation committee has not given feedback yet."
        />
      )}

      <div>
        {!review.feedback && (
          <CommentComposer
            value={feedback}
            setValue={setFeedback}
            handleComment={() => {
              handleComment();
            }}
            isLoading={feedbackGroupReviewData.isLoading}
          />
        )}
      </div>
    </div>
  );
};

const ReportDetail: React.FC = () => {
  const { groupId, reviewId } = useParams<{
    groupId: string;
    reviewId?: string;
  }>();
  const dispatch = useDispatch();
  const { currentGroup } = useSelector((state: RootState) => state.resource);

  const {
    data: reviewData,
    isLoading,
    isError,
    refetch: refetchReview,
  } = useGetGroupReviewQuery({
    group_id: Number(groupId),
    capstone_group_review_id: Number(reviewId),
  });

  const {
    data: reviewScheduleData,
    isLoading: isLoadingSchedule,
    isError: isErrorSchedule,
  } = useGetGroupScheduleReviewQuery(
    {
      schedule_review_id: reviewData?.data.schedule_review_id || 0,
    },
    { skip: !reviewData }
  );

  const review = reviewData?.data;
  const reviewSchedule = reviewScheduleData?.data;

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        {
          title: `${currentGroup?.name_group || "Group " + groupId}`,
          link: `/groups/${groupId}`,
        },
        { title: "Reviews", link: `/groups/${groupId}/reviews` },
        {
          title: `${"Review " + reviewId}`,
          link: `/groups/${groupId}/reviews/${reviewId}`, //TODO: Replace Report Name with actual report name
        },
      ])
    );
  }, [dispatch, groupId, reviewId, currentGroup]);

  if (isLoading || isLoadingSchedule) {
    return (
      <div className=" flex justify-center pt-10 p-5">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (isError || isErrorSchedule) {
    return <ErrorBoundaryComponent />;
  }

  if (!review || !reviewSchedule) {
    return <EmptyResources title="No review found" />;
  }

  return (
    <div>
      <ReviewHeader review={review} reviewSchedule={reviewSchedule} />

      <DocumentSection
        review={review}
        reviewSchedule={reviewSchedule}
        refetchReview={refetchReview}
      />

      <Separator />
      <Tabs defaultValue="feedback" className="my-4">
        <TabsList>
          <TabsTrigger value="feedback" className="lg:w-[150px] w-full">
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <div className="mt-4">
            <FeedbackSection review={review} refetchReview={refetchReview} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
