import { SettingCard } from "@/components/custom/setting";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import UploadTopicDialog from "../components/upload-topic-dialog";

const About: React.FC = () => {
  const [topics, setTopics] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
