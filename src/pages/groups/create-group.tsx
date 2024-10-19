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
import { Member, MemberRole, OptionType } from "./type";

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

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [formValid, setFormValid] = useState(false);
  const [selectStudent, setSelectStudent] = useState<OptionType | null>(null);

  useEffect(() => {
    setFormValid(groupName.trim() === "" || members.length < 4);
  }, [groupName, members]);

  useEffect(() => {
    if (selectStudent) {
      const { value } = selectStudent;
      setMembers((prevMembers) => [
        ...prevMembers,
        {
          id: value.common_info.id,
          name: value.common_info.name,
          email: value.common_info.email,
          role: MemberRole.MEMBER,
        },
      ]);
      setSelectStudent(null);
    }
  }, [selectStudent]);

  const updateRoleMember = (member: Member, role: MemberRole) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) => (m.id === member.id ? { ...m, role } : m))
    );
  };

  const handleRemoveMember = (member: Member) => {
    setMembers((prevMembers) => prevMembers.filter((m) => m.id !== member.id));
  };

  const createGroup = () => {
    console.log("Create Group");
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1>Create Group</h1>
      <div className="space-y-2">
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          type="text"
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
      </div>

      <div>
        <Label>Members</Label>
        <p className="text-xs text-slate-500">
          (At least 4 members are required to create a group. You can add up to
          5 members.)
        </p>
        <div className="mt-2 space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
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
                  onValueChange={(value) =>
                    updateRoleMember(member, value as MemberRole)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MemberRole.LEADER}>Leader</SelectItem>
                    <SelectItem value={MemberRole.MEMBER}>Member</SelectItem>
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

      {members.length < 5 && (
        <div className="space-y-2">
          <Label htmlFor="newMemberName">Add member</Label>
          <SelectStudent
            value={selectStudent}
            onChangeValue={setSelectStudent}
            selectedMembers={members}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={createGroup} disabled={formValid}>
          Create Group
        </Button>
      </div>
    </div>
  );
};

export default CreateGroup;
