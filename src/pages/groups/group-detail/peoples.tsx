import { LoadingTableLottie } from "@/components";
import SubMajor from "@/components/common/major";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetInvitationMentorsQuery,
  useGetMembersQuery,
} from "@/store/api/v1/endpoints/groups";
import {
  GroupMember,
  GroupMentor,
  InvitationMentor,
  InvitationMentorStatus,
} from "@/types/group";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InviteMentorDialog from "../components/invite-mentor-dialog";

type BadgeVariant = "success" | "info" | "destructive" | "outline";

const InvitingStatus: React.FC<{ status: InvitationMentorStatus | string }> = ({
  status,
}) => {
  let variant: BadgeVariant;
  switch (status) {
    case InvitationMentorStatus.Approve:
      variant = "success";
      break;
    case InvitationMentorStatus.Pending:
      variant = "info";
      break;
    case InvitationMentorStatus.Reject:
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
};

const MentorTable: React.FC<{
  mentor: GroupMentor | null;
  invitationMentors: InvitationMentor[];
}> = ({ mentor, invitationMentors }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {mentor && (
        <TableRow key={mentor.id}>
          <TableCell className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  mentor.name
                )}&size=32`}
                alt={mentor.name}
              />
              <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p>{mentor.name}</p>
            </div>
          </TableCell>
          <TableCell>{mentor.email}</TableCell>
          <TableCell>
            <InvitingStatus status={InvitationMentorStatus.Approve} />
          </TableCell>
          <TableCell>
            <ActionCell
              items={[
                {
                  item: "Send Email",
                  onClick: () => {
                    window.location.href = `mailto:${mentor.email}`;
                  },
                },
              ]}
            />
          </TableCell>
        </TableRow>
      )}
      {(invitationMentors || []).map((invitationMentor) => {
        const { mentor } = invitationMentor;
        return (
          <TableRow key={invitationMentor.id}>
            <TableCell className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    mentor.name
                  )}&size=32`}
                  alt={mentor.name}
                />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p>{mentor.name}</p>
              </div>
            </TableCell>
            <TableCell>{mentor.email}</TableCell>
            <TableCell>
              <InvitingStatus status={invitationMentor.status} />
            </TableCell>
            <TableCell>
              <ActionCell
                items={[
                  {
                    item: "Send Email",
                    onClick: () => {
                      window.location.href = `mailto:${mentor.email}`;
                    },
                  },
                ]}
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

const MemberTable: React.FC<{
  members: GroupMember[];
  leaderId: number | null;
}> = ({ members, leaderId }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Code</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Major</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {members.map((member) => (
        <TableRow key={member.id}>
          <TableCell>{member.code}</TableCell>
          <TableCell className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  member.name
                )}&size=32`}
                alt={member.name}
              />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p>{member.name}</p>
            </div>
          </TableCell>
          <TableCell>{member.email}</TableCell>
          <TableCell>
            <SubMajor id={member.sub_major_id} />
          </TableCell>
          <TableCell>
            <Badge variant="outline" className="capitalize">
              {member.id === leaderId ? "Leader" : "Member"}
            </Badge>
          </TableCell>
          <TableCell>
            <ActionCell
              items={[
                {
                  item: "Send Email",
                  onClick: () => {
                    window.location.href = `mailto:${member.email}`;
                  },
                },
              ]}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const Peoples = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const {
    data: membersData,
    error,
    isLoading,
  } = useGetMembersQuery(
    {
      group_id: parseInt(groupId!),
    },
    { skip: !groupId }
  );

  const { data: invitationMentorsData } = useGetInvitationMentorsQuery(
    {
      group_id: parseInt(groupId!),
    },
    { skip: !groupId }
  );

  const [members, setMembers] = useState<GroupMember[]>([]);
  const [invitationMentors, setInvitationMentors] = useState<
    InvitationMentor[]
  >([]);
  const [mentor, setMentor] = useState<GroupMentor | null>(null);
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (membersData) {
      const { members, mentor, leader_id } = membersData.data;
      setMembers(members);
      setLeaderId(leader_id);
      setMentor(mentor);
    }
    if (invitationMentorsData) {
      const { items } = invitationMentorsData;
      setInvitationMentors(items);
    }
  }, [membersData, invitationMentorsData]);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-10">
        <div className="w-[250px]">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <ErrorBoundaryComponent />
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <InviteMentorDialog
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        groupId={parseInt(groupId!)}
      />
      <SettingCard
        title={`Mentors ${mentor ? "(1)" : ""}`}
        actions={
          <Button onClick={() => setIsInviteModalOpen(true)}>Add Mentor</Button>
        }
      >
        {mentor || (invitationMentors || []).length ? (
          <MentorTable mentor={mentor} invitationMentors={invitationMentors} />
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No mentor yet</AlertTitle>
            <AlertDescription>
              Your group has not mentor yet. Please invite a mentor
            </AlertDescription>
          </Alert>
        )}
      </SettingCard>

      <SettingCard title={`Members (${members.length})`}>
        <MemberTable members={members} leaderId={leaderId} />
      </SettingCard>
    </div>
  );
};

export default Peoples;
