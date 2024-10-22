import { SettingCard } from "@/components/custom/setting";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import React from "react";
import { FiFilePlus } from "react-icons/fi";

const About: React.FC = () => {
  return (
    <>
      <SettingCard
        title="Topics"
        actions={
          <Button>
            <FiFilePlus />
            Submit topic
          </Button>
        }
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No submit topic</AlertTitle>
          <AlertDescription>
            Your group has not submitted any topics yet. Please submit a topic
            to start the discussion.
          </AlertDescription>
        </Alert>
      </SettingCard>
    </>
  );
};

export default About;
