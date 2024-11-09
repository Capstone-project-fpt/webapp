import DateDisplay from "@/components/common/date";
import FileDownload from "@/components/common/file-download";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell, ActionItem } from "@/components/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  useGetTopicsQuery,
  useSetGroupTopicMutation,
} from "@/store/api/v1/endpoints/groups";
import { ResponseErrorType } from "@/types";
import { GroupStatus, TopicGroup, TopicReviewStatus } from "@/types/group";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UploadTopicDialog from "../components/create-upload-topic-dialog";
import ReviewStatus from "../components/topic-review-status";

const Topics: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const currentGroup = useSelector(
    (state: RootState) => state.resource.currentGroup
  );
  const { toast } = useToast();

  const navigate = useNavigate();
  const { data: topicsData, isLoading } = useGetTopicsQuery({
    group_id: parseInt(groupId!),
  });
  const [setGroupTopicMutation] = useSetGroupTopicMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState<TopicGroup[]>([]);

  useEffect(() => {
    if (topicsData) {
      const { items } = topicsData.data;
      setTopics(items);
    }
  }, [topicsData]);

  const setGroupTopic = async (topicId: number) => {
    try {
      const data = await setGroupTopicMutation({
        group_id: parseInt(groupId!),
        topic_id: topicId,
      }).unwrap();

      toast({
        title: "Set group's topic",
        description: data.message || "Set group's topic successfully",
      });

    } catch (error) {
      toast({
        title: "Set group's topic",
        description:
          (error as ResponseErrorType).data.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
        variant: "destructive",
      });
    }
  };

  const groupTopicStatus = currentGroup?.status;

  return (
    <div className="flex flex-col gap-5">
      <UploadTopicDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        groupId={groupId!}
      />

      <SettingCard title="Group's Topic">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No group's topic</AlertTitle>
          <AlertDescription>
            Your group has not select topics yet. Please submit a topic to
            review and set group's topic.
          </AlertDescription>
        </Alert>
      </SettingCard>
      <SettingCard
        title="Reviewing Topics"
        actions={
          groupTopicStatus === GroupStatus.ReviewingTopic && (
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <FiFilePlus />
              Submit topic
            </Button>
          )
        }
      >
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Submit At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : topics.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Submit At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>{topic.topic}</TableCell>
                  <TableCell>
                    <FileDownload pathFile={topic.document_path} />
                  </TableCell>
                  <TableCell>
                    <DateDisplay
                      date={new Date(topic.created_at)}
                      showTime={true}
                    />
                  </TableCell>
                  <TableCell>
                    <ReviewStatus status={topic.status_review} />
                  </TableCell>
                  <TableCell>
                    <ActionCell
                      items={
                        [
                          groupTopicStatus === GroupStatus.ReviewingTopic &&
                            topic.status_review ===
                              TopicReviewStatus.Approved && {
                              item: "Set group's topic",
                              onClick: () => {
                                setGroupTopic(topic.id);
                              },
                            },
                          {
                            item: "View detail",
                            onClick: () =>
                              navigate(`/groups/${groupId}/topics/${topic.id}`),
                          },
                        ].filter(Boolean) as ActionItem[]
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No submit topic</AlertTitle>
            <AlertDescription>
              Your group has not submitted any topics yet. Please submit a topic
              to start the discussion.
            </AlertDescription>
          </Alert>
        )}
      </SettingCard>
    </div>
  );
};

export default Topics;
