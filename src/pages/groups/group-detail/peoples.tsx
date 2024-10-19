import SubMajor from "@/components/common/major";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useParams } from "react-router-dom";

const Peoples = () => {
  const { groupId } = useParams<{ groupId: string }>();
  console.log(groupId);
  const mentors = [
    {
      id: 1,
      name: "John Doe",
      email: "John@gmail.com",
    },
    {
      id: 2,
      name: "Jane Foe",
      email: "John@gmail.com",
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
  return (
    <div className="mt-4 flex flex-col gap-4">
      <SettingCard
        title="Mentors"
        actions={
          <Button onClick={() => console.log("Add Mentor")}>Add Mentor</Button>
        }
      >
        <Table>
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
                  <ActionCell
                    items={[
                      {
                        item: "Edit",
                        onClick: () => console.log("Edit"),
                      },
                      "-",
                      {
                        item: "Delete",
                        danger: true,
                        onClick: () => console.log("Delete"),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingCard>

      <SettingCard
        title="Members"
        actions={
          <Button onClick={() => console.log("Add Mentor")}>Add Member</Button>
        }
      >
        <Table>
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
                        item: "Edit",
                        onClick: () => console.log("Edit"),
                      },
                      "-",
                      {
                        item: "Delete",
                        danger: true,
                        onClick: () => console.log("Delete"),
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
