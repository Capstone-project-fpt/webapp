import { LoadingTableLottie } from "@/components";
import DateDisplay from "@/components/common/date";
import EmptyResources from "@/components/common/empty-resource";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import {
  useFeedbackGroupReviewMutation,
  useGetGroupReviewQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { ResponseErrorType } from "@/types";
import { GroupReview } from "@/types/group";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";
import { Content } from "@tiptap/core";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import CommentComposer from "./components/comment-composer";

interface ReviewHeaderProps {
  review: GroupReview;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ review }) => {
  return (
    <div>
      <div className="text-xl mb-4">{"Review"}</div>
      <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
        <span>Status</span>
        <div></div>
        <span>Create date</span>
        <DateDisplay date={new Date(review.created_at)} showTime={true} />
        <span>Update date</span>
        <DateDisplay date={new Date(review.updated_at)} showTime={true} />
      </div>
    </div>
  );
};

interface DocumentSectionProps {
  review: GroupReview;
  groupId: string;
  reviewId: string;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
  review,
  groupId,
  reviewId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const document_path = "test.docx";
  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="">Report</h2>
        <FaRegEdit
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        {/* <UploadReviewDialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          groupId={groupId}
          reviewId={reviewId}
        /> */}
      </div>
      <div className="flex gap-4">
        <div className="flex items-center border px-5 py-3 rounded-lg max-w-lg">
          <FileIcon className="mr-2" />
          <span className="truncate">{getFileName(document_path)}</span>
          <Button variant={"outline"} className="ml-3" size="sm">
            <a
              href={getUrlFile(document_path)}
              download={getFileName(document_path)}
              className="text-accent underline flex items-center"
              target="_blank"
            >
              Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

interface FeedbackSectionProps {
  groupId: string;
  reviewId: string;
  refetchReview?: () => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  groupId,
  reviewId,
  refetchReview,
}) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Content>("");
  const [feedbackGroupReview] = useFeedbackGroupReviewMutation();

  const handleComment = async () => {
    try {
      await feedbackGroupReview({
        group_id: parseInt(groupId),
        capstone_group_review_id: parseInt(reviewId),
        feedback: feedback as string,
      }).unwrap();

      setFeedback("");
      toast({
        duration: 1000,
        variant: "default",
        title: "Feedback Topic",
        description: "Feedback Topic Successfully.",
      });

      if (refetchReview) {
        refetchReview();
      }
    } catch (error) {
      toast({
        title: `Feedback review`,
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      <EmptyResources
        title="No feedback yet"
        content="The evaluation committee has not given feedback yet."
      />

      <div>
        {/* TODO: Just evaluation committee give feedback */}
        {/* TODO: Hide before review */}
        <CommentComposer
          value={feedback}
          setValue={setFeedback}
          handleComment={handleComment}
        />
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
    refetch,
  } = useGetGroupReviewQuery({
    group_id: Number(groupId),
    capstone_group_review_id: Number(reviewId),
  });
  const review = reviewData?.data;

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

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10 p-5">
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
      <ReviewHeader review={review!} />

      <DocumentSection
        groupId={groupId!}
        review={review!}
        reviewId={reviewId!}
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
            <FeedbackSection
              groupId={groupId!}
              reviewId={reviewId!}
              refetchReview={refetch}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
