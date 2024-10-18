import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import SelectStudent from "./components/select-student";

enum MemberRole {
  LEADER = "leader",
  MEMBER = "member",
}

interface Member {
  name: string;
  email: string;
  role: MemberRole;
}

const CreateGroup: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        { title: "Create", link: "/groups/create" },
      ])
    );
  }, [dispatch]);

  const [groupName, setTeamName] = useState("");
  const [members, setMembers] = useState<Member[]>([
    {
      name: "Frankie Sullivan",
      email: "frankie@untitledui.com",
      role: MemberRole.LEADER,
    },
    {
      name: "Amélie Laurent",
      email: "amelie@untitledui.com",
      role: MemberRole.MEMBER,
    },
    {
      name: "Katie Moss",
      email: "katie@untitledui.com",
      role: MemberRole.MEMBER,
    },
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [formValid, setFormValid] = useState(false);

  const handleAddMember = () => {
    if (newMemberName && newMemberEmail && members.length < 5) {
      setMembers([
        ...members,
        {
          name: newMemberName,
          email: newMemberEmail,
          role: MemberRole.MEMBER,
        },
      ]);
      setNewMemberName("");
      setNewMemberEmail("");
    }
  };

  const updateRoleMember = (member: Member, role: string) => {
    if (role === MemberRole.LEADER) {
      const newMembers = members.map((m) => {
        if (m === member) {
          return { ...m, role: MemberRole.LEADER };
        }

        return { ...m, role: MemberRole.MEMBER };
      });

      setMembers(newMembers);
    }
  };

  const handleRemoveMember = (member: Member) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.email !== member.email));
    }
  };

  const createGroup = () => {
    console.log("Create Group");
  };

  useEffect(() => {
    setFormValid(groupName.trim() === "" || members.length < 4);
  }, [groupName, members]);

  return (
    <>
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <h1>Create Group</h1>
        {/* Group Name */}
        <div className="space-y-2">
          <Label htmlFor="groupName">Group Name</Label>
          <Input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter group name"
          />
        </div>

        {/* Members List */}
        <div>
          <Label>Members</Label>
          <p className="text-xs text-slate-500">
            (At least 4 members are required to create a group. You can add up
            to 5 members.)
          </p>
          <div className="mt-2 space-y-2">
            {members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-md border-gray-300"
              >
                <div className="flex items-center space-x-2">
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
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={member.role}
                    onValueChange={(value) => updateRoleMember(member, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leader">Leader</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveMember(member)}
                  >
                    <FaRegTrashAlt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Members */}
        {members.length < 5 && (
          <div className="space-y-2">
            <Label htmlFor="newMemberName">Add member</Label>
            {/* <div className="flex items-center space-x-2">
              <Input
                type="text"
                id="newMemberName"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
              />
              <Input
                type="email"
                id="newMemberEmail"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <Button onClick={handleAddMember}>Add</Button>
            </div> */}
            <SelectStudent />
          </div>
        )}
        {/* Create Group Button */}
        <div className="flex justify-end">
          <Button onClick={createGroup} disabled={formValid}>
            Create Group
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateGroup;
