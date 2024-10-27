import { DateCell } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store";
import {
  useGetTopicFeedbacksQuery,
  useGetTopicQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Comment from "./components/comment";
import ReviewStatus from "./components/topic-review-status";

interface Attachment {
  id: number;
  name: string;
  size: string;
  downloadLink: string;
}

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

  const [reviews, setReviews] = useState([]);

  const attachments: Attachment[] = [
    {
      id: 1,
      name: "Design brief.pdf",
      size: "1.5 MB",
      downloadLink: "#",
    },
    {
      id: 2,
      name: "Craftboard logo.ai",
      size: "2.5 MB",
      downloadLink: "#",
    },
  ];
  return (
    <>
      {topic && (
        <div>
          <div className=" text-xl ">{topic.topic}</div>
          <div className="flex flex-col mb-6">
            <div className="flex items-center gap-4">
              <span>Status:</span>
              <ReviewStatus status={topic.status_review} />
            </div>
            <div className="flex items-center gap-4">
              <span>Submit date:</span>
              <DateCell date={new Date(topic.created_at)} />
            </div>
          </div>

          <div className="my-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="">Attachments</h2>
              <FaRegEdit />
            </div>
            <div className="flex gap-4">
              {attachments.map((file) => (
                <Card key={file.id}>
                  <CardHeader>
                    <FaRegTrashAlt className="ml-auto" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <div>
                        <FileIcon className="mr-2" />
                        <div>
                          <p>{file.name}</p>
                        </div>
                      </div>
                      <Button size="sm">Download</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div className="mt-4">
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
            <Comment />
          </div>
        </div>
      )}
    </>
  );
};

export default TopicDetail;
