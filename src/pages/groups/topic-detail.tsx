import Comment from "@/components/common/comment";
import { DateCell } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store";
import {
  useGetTopicFeedbacksQuery,
  useGetTopicQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { CommentType } from "@/types/common";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import CommentComposer from "./components/comment-composer";
import UploadTopicDialog from "./components/create-upload-topic-dialog";
import ReviewStatus from "./components/topic-review-status";

const TopicDetail: React.FC = () => {
  const { groupId, topicId } = useParams<{
    groupId: string;
    topicId?: string;
  }>();

  const { currentGroup } = useSelector((state: RootState) => state.resource);
  const { data: topicData } = useGetTopicQuery({
    group_id: parseInt(groupId!),
    topic_id: parseInt(topicId!),
  });

  const { data: feedbacksData } = useGetTopicFeedbacksQuery({
    group_id: parseInt(groupId!),
    topic_id: parseInt(topicId!),
  });

  const topic = topicData?.data;

  const dispatch = useDispatch();
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

  const [feedbacks, setFeedbacks] = useState<CommentType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (feedbacksData) {
      const feedbacks = feedbacksData.data.items.map((item) => {
        return {
          id: item.id,
          content: item.feedback,
          user: item.approved_by,
          created_at: item.created_at,
        };
      });
      setFeedbacks(feedbacks);
    }
  }, [feedbacksData]);

  return (
    <>
      {topic && (
        <div>
          <div className="text-xl">{topic.topic}</div>
          <div className="flex flex-col mb-6">
            <div className="flex items-center gap-4">
              <span>Status:</span>
              <ReviewStatus status={topic.status_review} />
            </div>
            <div className="flex items-center gap-4">
              <span>Submit date:</span>
              <DateCell date={new Date(topic.created_at)} />
            </div>
            <div className="flex items-center gap-4">
              <span>Update date:</span>
              <DateCell date={new Date(topic.updated_at)} />
            </div>
          </div>

          <div className="my-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="">Document</h2>
              <FaRegEdit
                className="cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                }}
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
                <span className="truncate">{getFileName(topic.document_path)}</span>
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

          {/* <div className="mt-4">
            {reviews.map((review) => (
              <Card key={review.id} className="mb-4 p-4">
                <div className="flex gap-1 items-center mb-2">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        review.author
                      )}&size=32`}
                      alt={review.author}
                    />
                    <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{review.author}</span>
                </div>
                <p>{review.message}</p>
                <p className="text-sm ">{review.timeAgo}</p>
              </Card>
            ))}
          </div>
          <div>
            <CommentComposer />
          </div> */}

          <Tabs defaultValue="feedbacks" className="my-4">
            <TabsList>
              <TabsTrigger value="feedbacks" className="lg:w-[150px] w-full">
                Feedbacks
              </TabsTrigger>
              <TabsTrigger value="activities" className="lg:w-[150px] w-full">
                Activities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feedbacks">
              <div className="mt-4">
                {feedbacks.map((feedback) => (
                  <Comment key={feedback.id} comment={feedback} />
                ))}
              </div>
              <div>
                <CommentComposer />
              </div>
            </TabsContent>
            <TabsContent value="activities">
              <div className="mt-4">
                <p>No activities yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default TopicDetail;
