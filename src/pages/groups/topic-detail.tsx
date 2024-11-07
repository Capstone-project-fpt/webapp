import { Content } from "@tiptap/react";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

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
  useReviewTopicMutation,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { CommentType } from "@/types/common";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";

import CommentComposer from "./components/comment-composer";
import UploadTopicDialog from "./components/create-upload-topic-dialog";
import ReviewStatus from "./components/topic-review-status";
import { TopicReviewStatus } from "@/types/group";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ResponseErrorType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SettingCard } from "@/components/custom/setting";

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
  const { data: feedbacksData, refetch: refetchFeedbacks } =
    useGetTopicFeedbacksQuery({
      group_id: parseInt(groupId!),
      topic_id: parseInt(topicId!),
      limit: 100,
    });

  const [createTopicFeedback, createTopicFeedbackData] =
    useCreateTopicFeedbackMutation();
  const [reviewTopic, reviewTopicData] = useReviewTopicMutation();
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
      refetchFeedbacks();
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
  }, [createTopicFeedbackData, refetchFeedbacks, toast]);

  const handleComment = () => {
    createTopicFeedback({
      group_id: parseInt(groupId!),
      topic_id: parseInt(topicId!),
      feedback: feedback as string,
    });
  };

  const [loadingBtn, setLoadingBtn] = useState<TopicReviewStatus>();

  const handleReviewTopic = async (status: TopicReviewStatus) => {
    try {
      setLoadingBtn(status);
      const data = await reviewTopic({
        group_id: parseInt(groupId!),
        topic_id: parseInt(topicId!),
        status_review: status,
      }).unwrap();
      toast({
        title: "Review Topic",
        description: data.data,
      });
    } catch (error) {
      toast({
        title: "Review Topic",
        description: (error as ResponseErrorType).data.error,
        variant: "destructive",
      });
    }
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
            <DateDisplay date={new Date(topic.created_at)} showTime={true} />
            <span>Update date</span>
            <DateDisplay date={new Date(topic.updated_at)} showTime={true} />
          </div>

          <div className="my-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="">Document</h2>
              {/* Can edit when review */}
              {topic.status_review === TopicReviewStatus.Reviewing && (
                <FaRegEdit
                  className="cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
              )}
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
              <TabsTrigger value="review" className="lg:w-[150px] w-full">
                Review
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
            <TabsContent value="review">
              <div className="mt-4">
                {topic.status_review === TopicReviewStatus.Reviewing && (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => {
                        handleReviewTopic(TopicReviewStatus.Approved);
                      }}
                    >
                      {reviewTopicData.isLoading &&
                        loadingBtn === TopicReviewStatus.Approved && (
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReviewTopic(TopicReviewStatus.Rejected);
                      }}
                    >
                      {reviewTopicData.isLoading &&
                        loadingBtn === TopicReviewStatus.Rejected && (
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                      Reject
                    </Button>
                  </>
                )}

                {topic.status_review === TopicReviewStatus.Approved && (
                  <SettingCard title="Approve">
                    <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
                      <span>Approved at</span>
                      <DateDisplay
                        date={new Date(topic.approved_at!)}
                        showTime={true}
                      />
                      <span>By</span>
                      <div>
                        {topic.approved_by && (
                          <div className="flex gap-2 items-center">
                            <Avatar>
                              <AvatarImage
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  topic.approved_by.name
                                )}&size=32`}
                                alt={topic.approved_by.name}
                              />
                              <AvatarFallback>
                                {topic.approved_by.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{topic.approved_by.name}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </SettingCard>
                )}
                {topic.status_review === TopicReviewStatus.Rejected && (
                  <SettingCard title="Reject">
                    <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
                      <span>Rejected at</span>
                      <DateDisplay
                        date={new Date(topic.rejected_at!)}
                        showTime={true}
                      />
                      <span>By</span>
                      {topic.rejected_by && (
                        <div className="flex gap-2 items-center">
                          <Avatar>
                            <AvatarImage
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                topic.rejected_by.name
                              )}&size=32`}
                              alt={topic.rejected_by.name}
                            />
                            <AvatarFallback>
                              {topic.rejected_by.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{topic.rejected_by.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </SettingCard>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default TopicDetail;
