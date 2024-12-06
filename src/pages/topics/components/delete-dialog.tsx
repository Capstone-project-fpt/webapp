import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTeacherDeleteTopicMutation } from "@/store/api/v1/endpoints/topics";
import { ResponseErrorType } from "@/types";
import { TopicType } from "@/types/topic";
import React from "react";

const DeleteDialog: React.FC<{
  topic: TopicType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ topic, open, onOpenChange }) => {
  const { toast } = useToast();
  const [deleteTopicMutation, data] = useTeacherDeleteTopicMutation();

  const handleDelete = async () => {
    try {
      await deleteTopicMutation({ id: topic.id }).unwrap();
      toast({
        duration: 3000,
        title: "Delete topic",
        description: "Delete topic successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Delete topic",
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete topic"
      danger
      cancelButton
      okButton={{
        label: "Delete topic",
        onClick: handleDelete,
        isLoading: data.isLoading,
      }}
      confirmText="I understand that this action cannot be undone and all the topic members will be also removed from the topic."
    >
      {`Are you sure you want to delete the topic "${topic.name}" with ID ${topic.id}?`}
    </ActionDialog>
  );
};

export default DeleteDialog;
