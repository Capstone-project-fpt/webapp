import SubMajor from "@/components/common/major";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
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
import { useState } from "react";
import { useParams } from "react-router-dom";
import InviteMentorDialog from "../components/invite-mentor-dialog";

enum InvitingStatusEnum {
  ACTIVE = "active",
  INVITED = "invited",
  REJECTED = "rejected",
}

type BadgeVariant = "success" | "info" | "destructive" | "outline";

const InvitingStatus: React.FC<{ status: InvitingStatusEnum }> = ({
  status,
}) => {
  let variant: BadgeVariant;
  switch (status) {
    case InvitingStatusEnum.ACTIVE:
      variant = "success";
      break;
    case InvitingStatusEnum.INVITED:
      variant = "info";
      break;
    case InvitingStatusEnum.REJECTED:
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

const Peoples = () => {
  const { groupId } = useParams<{ groupId: string }>();
  console.log(groupId);
  const mentors: {
    id: number;
    name: string;
    email: string;
    status: InvitingStatusEnum;
    metadata?: Record<string, string>;
  }[] = [
    {
      id: 1,
      name: "John Doe",
      email: "John@gmail.com",
      status: InvitingStatusEnum.ACTIVE,
    },
    {
      id: 2,
      name: "Jane Foe",
      email: "John@gmail.com",
      status: InvitingStatusEnum.INVITED,
    },
    {
      id: 3,
      name: "Jane Foe",
      email: "John@gmail.com",
      status: InvitingStatusEnum.REJECTED,
      metadata: {
        reason: "Enrolled in another group",
      },
    },
  ];

  const members = [
    {
      id: 1,
      name: "John Doe",
      email: "John@gmail.com",
      role: "leader",
      code: "DE160221",
      sub_major: 1,
    },
    {
      id: 2,
      name: "Jane Foe",
      email: "John@gmail.com",
      role: "member",
      code: "DE160221",
      sub_major: 1,
    },
  ];
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <InviteMentorDialog
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        groupId={parseInt(groupId!)}
      />
      <SettingCard
        title={`Mentors (${
          mentors.filter(
            (mentor) => mentor.status === InvitingStatusEnum.ACTIVE
          ).length
        })`}
        actions={
          <Button onClick={() => setIsInviteModalOpen(true)}>Add Mentor</Button>
        }
      >
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
            {mentors.map((mentor) => (
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
                  <InvitingStatus status={mentor.status}></InvitingStatus>
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
            ))}
          </TableBody>
        </Table>
      </SettingCard>

      <SettingCard title={`Members (${members.length})`}>
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
                  <SubMajor id={member.sub_major}></SubMajor>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {member.role}
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
                        item: "Change role",
                        onClick: () => console.log("Change role"),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingCard>
    </div>
  );
};

export default Peoples;
