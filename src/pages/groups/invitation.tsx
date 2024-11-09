import { SettingCard } from "@/components/custom/setting";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useAcceptInvitationMutation,
  useGetGroupQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { InvitationMentorStatus } from "@/types/group";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";

const Invitation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { groupId } = useParams<{
    groupId: string;
  }>();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { toast } = useToast();

  const { data: groupData } = useGetGroupQuery({ id: Number(groupId) });
  const group = groupData?.data;
  const [acceptInvitation, { isLoading, isError, isSuccess }] =
    useAcceptInvitationMutation();

  const handleInvitation = async (status: InvitationMentorStatus) => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Accept Invitation",
        description: "Invalid token.",
      });
      return;
    }

    await acceptInvitation({ group_id: Number(groupId), token, status });
  };

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        {
          title: `${group?.name_group || "Group " + groupId}`,
          link: `/groups/${groupId}`,
        },
        {
          title: "Invitation",
          link: `/groups/${groupId}/invitation`,
        },
      ])
    );
  }, [group, dispatch, groupId]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Accept Invitation",
        description: `You have successfully accepted the invitation to mentor the ${
          group?.name_group || "group"
        }.`,
      });
      navigate(`/groups/${groupId}`);
    }

    if (isError) {
      toast({
        variant: "destructive",
        title: "Accept Invitation",
        description:
          "Something went wrong, please try again. If the problem persists, please contact the administrator.",
      });
    }
  }, [groupId, isError, isSuccess, navigate, toast]);

  return (
    <SettingCard
      title="Invitation Mentor"
      actions={
        <>
          <Button
            onClick={() => handleInvitation(InvitationMentorStatus.Reject)}
            disabled={isLoading}
            variant={"destructive"}
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
          <Button
            onClick={() => handleInvitation(InvitationMentorStatus.Approve)}
            disabled={isLoading}
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Accept
          </Button>
        </>
      }
    >
      <p>
        You have been invited to mentor the{" "}
        <strong>{group?.name_group || "group"}</strong>. Do you want to accept
        this invitation?
      </p>
    </SettingCard>
  );
};

export default Invitation;
