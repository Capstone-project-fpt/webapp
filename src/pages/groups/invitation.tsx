import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  useAcceptInvitationMutation,
  useGetGroupQuery,
} from "@/store/api/v1/endpoints/groups";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const Invitation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = useParams<{
    groupId: string;
  }>();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { toast } = useToast();

  const { data, error } = useGetGroupQuery({ id: Number(groupId) });
  const [acceptInvitation, { isLoading, isError, isSuccess }] =
    useAcceptInvitationMutation();

  const handleAccept = async () => {
    await acceptInvitation({ group_id: Number(groupId), token: token || "" });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Accept Invitation",
        description:
          "You have successfully accepted the invitation to mentor the group.",
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
    <Card>
      <CardHeader>
        <CardTitle> Invitation Mentor</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          You have been invited to mentor the group
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAccept} disabled={isLoading}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Invitation;
