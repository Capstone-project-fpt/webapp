import { SettingCard } from "@/components/custom/setting";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import UploadTopicDialog from "../components/upload-topic-dialog";
import { useParams } from "react-router-dom";
import { useGetTopicsQuery } from "@/store/api/v1/endpoints/groups";
import { TopicGroup } from "@/types/group";

const About: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
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
      <UploadTopicDialog open={isModalOpen} onOpenChange={setIsModalOpen} />

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
          <div>Topics</div>
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

export default About;
