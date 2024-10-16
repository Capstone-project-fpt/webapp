import { ActionDialog } from "@/components/custom/action-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteTopicMutation } from "@/store/api/v1/endpoints/topics";
import { TopicType } from "@/types/topic";
import React from "react";

const DeleteDialog: React.FC<{
  topic: TopicType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ topic, open, onOpenChange }) => {
  const { toast } = useToast();
  const [deleteTopicMutation, data] = useDeleteTopicMutation();

  const handleDelete = async () => {
    await deleteTopicMutation({ id: topic.id });
    if (data.isSuccess) {
      toast({
        duration: 1000,
        title: "Delete topic",
        description: "Delete topic successfully.",
      });
      onOpenChange(false);
    }

    if (data.isError) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Delete topic",
        description:
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
      okButton={{ label: "Delete topic", onClick: handleDelete }}
      confirmText="I understand that this action cannot be undone and all the topic members will be also removed from the topic."
    >
      {`Are you sure you want to delete the topic "${topic.name}" with ID ${topic.id}?`}
    </ActionDialog>
  );
};

export default DeleteDialog;
