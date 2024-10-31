import FileDownload from "@/components/common/file-download";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell, DateCell } from "@/components/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTopicsQuery } from "@/store/api/v1/endpoints/groups";
import { TopicGroup } from "@/types/group";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import ReviewStatus from "../components/topic-review-status";
import UploadTopicDialog from "../components/upload-topic-dialog";

const Topics: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { data: topicsData } = useGetTopicsQuery({
    group_id: parseInt(groupId!),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState<TopicGroup[]>([]);

  useEffect(() => {
    if (topicsData) {
      const { items } = topicsData.data;
      setTopics(items);
    }
  }, [topicsData]);

  return (
    <>
      <UploadTopicDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        groupId={groupId!}
      />

      <SettingCard
        title="Topics"
        actions={
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <FiFilePlus />
            Submit topic
          </Button>
        }
      >
        {topics.length > 0 ? (
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
                    <DateCell date={new Date(topic.created_at)} />
                  </TableCell>
                  <TableCell>
                    <ReviewStatus status={topic.status_review} />
                  </TableCell>
                  <TableCell>
                    <ActionCell
                      items={[
                        {
                          item: "View detail",
                          onClick: () => navigate(`./topics/${topic.id}`),
                        },
                      ]}
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
    </>
  );
};

export default Topics;
