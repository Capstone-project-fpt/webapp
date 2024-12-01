import { LoadingTableLottie } from "@/components";
import DateDisplay from "@/components/common/date";
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
import AddMemberDialog from "../components/add-member-dialog";
import DeleteMemberDialog from "../components/delete-member-dialog";
import InviteMentorDialog from "../components/invite-mentor-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserTypes } from "@/types/accounts";

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

const InvitationMentorTable: React.FC<{
  invitationMentors: InvitationMentor[];
}> = ({ invitationMentors }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Invited At</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {(invitationMentors || []).map((invitationMentor) => {
        const { mentor } = invitationMentor;
        return (
          <TableRow key={invitationMentor.id}>
            <TableCell className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    mentor.name,
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
              <DateDisplay
                date={new Date(invitationMentor.created_at)}
                showTime={true}
              />
            </TableCell>
            <TableCell>
              <InvitingStatus
                status={
                  Date.now() <= new Date(invitationMentor.expired_at).getTime()
                    ? invitationMentor.status
                    : "Expired"
                }
              />
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

const MentorTable: React.FC<{
  mentor: GroupMentor | null;
}> = ({ mentor }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
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
                  mentor.name,
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
    </TableBody>
  </Table>
);

const MemberTable: React.FC<{
  members: GroupMember[];
  leaderId: number | null;
  groupId: number;
}> = ({ members, leaderId, groupId }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user)!;

  const handleDelete = () => {
    setSelectedMemberId(null);
  };

  return (
    <>
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
                      member.name,
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
                    {
                      item: "Remove",
                      danger: true,
                      onClick: () => {
                        setSelectedMemberId(member.id);
                        setDeleteDialogOpen(true);
                      },
                      isHide:
                        currentUser.common_info.user_type !== UserTypes.ADMIN,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedMemberId && (
        <DeleteMemberDialog
          groupId={groupId}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          memberId={selectedMemberId}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

const Peoples = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const currentUser = useSelector((state: RootState) => state.auth.user)!;

  const {
    data: membersData,
    error,
    isLoading,
  } = useGetMembersQuery(
    {
      group_id: parseInt(groupId!),
    },
    { skip: !groupId },
  );

  const { data: invitationMentorsData } = useGetInvitationMentorsQuery(
    {
      group_id: parseInt(groupId!),
    },
    { skip: !groupId },
  );

  const [members, setMembers] = useState<GroupMember[]>([]);
  const [invitationMentors, setInvitationMentors] = useState<
    InvitationMentor[]
  >([]);
  const [mentor, setMentor] = useState<GroupMentor | null>(null);
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    if (membersData) {
      const { members, mentor, leader_id } = membersData.data;
      setMembers(members);
      setLeaderId(leader_id);
      setMentor(mentor);
    }
    if (invitationMentorsData) {
      const { items } = invitationMentorsData.data;
      setInvitationMentors(items);
    }
  }, [membersData, invitationMentorsData]);

  const handleAddMember = () => {
    // Logic to refresh the member list after adding a new member.
    // E.g., re-fetch members or update state directly if available
  };

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
          !mentor && (
            <Button onClick={() => setIsInviteModalOpen(true)}>
              Invite Mentor
            </Button>
          )
        }
      >
        {mentor || (invitationMentors || []).length ? (
          mentor ? (
            <MentorTable mentor={mentor} />
          ) : (
            <InvitationMentorTable invitationMentors={invitationMentors} />
          )
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
        <MemberTable
          members={members}
          leaderId={leaderId}
          groupId={parseInt(groupId!)}
        />
        {currentUser.common_info.user_type === UserTypes.ADMIN && (
          <>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setAddDialogOpen(true)}>Add Member</Button>
            </div>
            <AddMemberDialog
              groupId={parseInt(groupId!)}
              open={isAddDialogOpen}
              onOpenChange={setAddDialogOpen}
              onAddMember={handleAddMember}
              selectedMembers={members}
            />
          </>
        )}
      </SettingCard>
    </div>
  );
};

export default Peoples;
