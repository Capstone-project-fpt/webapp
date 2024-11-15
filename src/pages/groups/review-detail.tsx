import EmptyResources from "@/components/common/empty-resource";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import { setBreadCrumb } from "@/store/slice/app";
import { GroupReview } from "@/types/group";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";
import { Content } from "@tiptap/core";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import CommentComposer from "./components/comment-composer";

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
        <h2 className="">Document</h2>
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
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  groupId,
  reviewId,
}) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Content>("");

  const handleComment = () => {};

  return (
    <div className="mt-4">
      <EmptyResources title="No feedback yet" />

      <div>
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
  console.log(currentGroup);

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
  let review: GroupReview;

  const [newFeedback, setNewFeedback] = useState<string>("");

  return (
    <div>
      <div className=" text-xl ">Review 1</div>
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-4">
          <span>Status:</span>
          <Badge variant="outline">On Progress</Badge>
        </div>
        <div>
          <span>Due date:</span> <span>5 Oct 2024</span>
        </div>
      </div>

      <div>
        <h2 className="mb-2">Description</h2>
        <Alert>
          <AlertDescription>
            This page aims to provide real-time insights into employee
            performance metrics and key business indicators.
          </AlertDescription>
        </Alert>
      </div>

      <DocumentSection
        groupId={groupId!}
        review={review!}
        reviewId={reviewId!}
      />

      <Separator />
      <Tabs defaultValue="feedback" className="my-4">
        <TabsList>
          <TabsTrigger value="feedback" className="lg:w-[150px] w-full">
            Feedbacks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <div className="mt-4">
            <FeedbackSection groupId={groupId!} reviewId={reviewId!} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
