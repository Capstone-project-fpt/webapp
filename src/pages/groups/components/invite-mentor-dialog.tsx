import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import SelectLecture from "./select-lecture";
import { OptionType } from "../type";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useInviteMentorMutation } from "@/store/api/v1/endpoints/groups";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
}

const InviteMentorDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  groupId,
}) => {
  const { toast } = useToast();
  const [inviteMentor, { isLoading, isError, isSuccess }] =
    useInviteMentorMutation();
  const [selectLecture, setSelectLecture] = useState<OptionType | null>(null);

  const sendInvite = async () => {
    if (selectLecture) {
      await inviteMentor({
        group_id: groupId,
        semester_id: 1,
        teacher_id: selectLecture.value.common_info.id,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Invite Mentor",
        description: "Invite Mentor Successful.",
      });
      setSelectLecture(null);
      onOpenChange(false);
    }

    if (isError) {
      toast({
        variant: "destructive",
        title: "Invite Mentor",
        description: "Invite Mentor Failed.",
      });
    }
  }, [isError, isSuccess, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Invite Mentor</DialogTitle>
          <div>
            <Label>Mentor</Label>
            <SelectLecture
              value={selectLecture}
              onChangeValue={setSelectLecture}
            />
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={sendInvite} disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Send emails invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMentorDialog;
