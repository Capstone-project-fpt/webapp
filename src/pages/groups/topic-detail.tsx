import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { FileIcon } from "lucide-react";
import { Content } from "@tiptap/react";

import Comment from "@/components/common/comment";
import DateDisplay from "@/components/common/date";
import EmptyResources from "@/components/common/empty-resource";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import {
  useCreateTopicFeedbackMutation,
  useGetTopicFeedbacksQuery,
  useGetTopicQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { CommentType } from "@/types/common";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";

import CommentComposer from "./components/comment-composer";
import UploadTopicDialog from "./components/create-upload-topic-dialog";
import ReviewStatus from "./components/topic-review-status";

const TopicDetail: React.FC = () => {
  const { groupId, topicId } = useParams<{
    groupId: string;
    topicId?: string;
  }>();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { currentGroup } = useSelector((state: RootState) => state.resource);
  const { data: topicData } = useGetTopicQuery({
    group_id: parseInt(groupId!),
    topic_id: parseInt(topicId!),
  });
  const { data: feedbacksData } = useGetTopicFeedbacksQuery({
    group_id: parseInt(groupId!),
    topic_id: parseInt(topicId!),
  });

  const [createTopicFeedback, createTopicFeedbackData] =
    useCreateTopicFeedbackMutation();
  const [feedbacks, setFeedbacks] = useState<CommentType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<Content>("");

  const topic = topicData?.data;

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        {
          title: `${currentGroup?.name_group || "Group " + groupId}`,
          link: `/groups/${groupId}`,
        },
        { title: "Topics", link: `/groups/${groupId}/topics` },
        {
          title: `${topic?.topic || "Topic " + topicId}`,
          link: `/groups/${groupId}/topics/${topicId}`,
        },
      ])
    );
  }, [currentGroup?.name_group, dispatch, groupId, topic?.topic, topicId]);

  useEffect(() => {
    if (feedbacksData) {
      const feedbacks = feedbacksData.data.items.map((item) => ({
        id: item.id,
        content: item.feedback,
        user: item.approved_by,
        created_at: item.created_at,
      }));
      setFeedbacks(feedbacks);
    }
  }, [feedbacksData]);

  useEffect(() => {
    if (createTopicFeedbackData.isSuccess) {
      setFeedback("");
      toast({
        duration: 1000,
        variant: "default",
        title: "Feedback Topic",
        description: "Feedback Topic Successfully.",
      });
    }

    if (createTopicFeedbackData.isError) {
      const { data } = createTopicFeedbackData.error as {
        data?: { code?: number; error?: string };
      };
      const messageError =
        data?.code === 409
          ? data.error
          : "Something went wrong, please try again. If the problem persists, please contact the administrator.";
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Feedback Topic",
        description: messageError,
      });
    }
  }, [createTopicFeedbackData, toast]);

  const handleComment = () => {
    createTopicFeedback({
      group_id: parseInt(groupId!),
      topic_id: parseInt(topicId!),
      feedback: feedback as string,
    });
  };

  return (
    <>
      {topic && (
        <div>
          <div className="text-xl mb-4">{topic.topic}</div>
          <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
            <span>Status</span>
            <div>
              <ReviewStatus status={topic.status_review} />
            </div>
            <span>Submit date</span>
            <DateDisplay date={new Date(topic.created_at)} />
            <span>Update date</span>
            <DateDisplay date={new Date(topic.updated_at)} />
          </div>

          <div className="my-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="">Document</h2>
              <FaRegEdit
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              <UploadTopicDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                groupId={groupId!}
                topicId={topicId!}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center border px-5 py-3 rounded-lg max-w-lg">
                <FileIcon className="mr-2" />
                <span className="truncate">
                  {getFileName(topic.document_path)}
                </span>
                <Button variant={"outline"} className="ml-3" size="sm">
                  <a
                    href={getUrlFile(topic.document_path)}
                    download={getFileName(topic.document_path)}
                    className="text-accent underline flex items-center"
                    target="_blank"
                  >
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <Separator />
          <Tabs defaultValue="feedbacks" className="mt-2">
            <TabsList>
              <TabsTrigger value="feedbacks" className="lg:w-[150px] w-full">
                Feedbacks
              </TabsTrigger>
              {/* <TabsTrigger value="activities" className="lg:w-[150px] w-full">
                Activities
              </TabsTrigger> */}
              <TabsTrigger value="approval" className="lg:w-[150px] w-full">
                Approval
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feedbacks">
              <div className="mt-4">
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <Comment key={feedback.id} comment={feedback} />
                  ))
                ) : (
                  <EmptyResources
                    title="No feedbacks yet."
                    content="There are no feedbacks for this topic."
                    shape="empty-messages"
                  />
                )}
              </div>
              <div>
                <CommentComposer
                  value={feedback}
                  setValue={setFeedback}
                  handleComment={handleComment}
                  isLoading={createTopicFeedbackData.isLoading}
                />
              </div>
            </TabsContent>
            <TabsContent value="activities">
              <div className="mt-4">
                <EmptyResources
                  title="No activities yet."
                  content="There are no activities for this topic."
                  shape="empty-task"
                />
              </div>
            </TabsContent>
            <TabsContent value="approval">
              <div className="mt-4">
                <EmptyResources
                  title="No approval yet."
                  content="There are no approval for this topic."
                  shape="empty-task"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default TopicDetail;
