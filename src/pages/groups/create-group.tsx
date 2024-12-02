/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import { useCreateGroupMutation } from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SelectStudent from "./components/select-student";
import { Member, MemberRole, OptionType } from "./type";
import { UserTypes } from "@/types/accounts";

const CreateGroup: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );
  const [createGroup, createGroupData] = useCreateGroupMutation();
  const { isLoading } = createGroupData;

  const initialMembers: Member[] =
    user && user.extra_info.student
      ? [
          {
            ...user.common_info,
            studentId: user.extra_info.student.student_id,
            role: MemberRole.LEADER,
          },
        ]
      : [];
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const initGroupName = user ? `${user.common_info.name}'s Group` : "";
  const [groupName, setGroupName] = useState(initGroupName);
  const [formValid, setFormValid] = useState(false);
  const [selectStudent, setSelectStudent] = useState<OptionType | null>(null);
  const [_, setCurrentLeader] = useState<Member | null>(
    user && user.extra_info.student
      ? {
          ...user.common_info,
          studentId: user.extra_info.student.student_id,
          role: MemberRole.LEADER,
        }
      : null
  );

  if (!currentSemester) {
    toast({
      title: "Get Current Semester",
      description:
        "Can not get current semester, please inform to Admin to create current semester",
      variant: "destructive",
    });

    navigate("/");
  }

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        { title: "Create", link: "/groups/create" },
      ])
    );
  }, [dispatch]);

  useEffect(() => {
    const numberMembersValid =
      user && user.common_info.user_type === UserTypes.ADMIN ? 3 : 4;
    setFormValid(
      groupName.trim() === "" || members.length < numberMembersValid
    );
  }, [groupName, members, user]);

  useEffect(() => {
    if (selectStudent) {
      const { value } = selectStudent;
      setMembers((prevMembers) => [
        ...prevMembers,
        {
          ...value.common_info,
          studentId: value.extra_info.student?.student_id as number,
          role: MemberRole.MEMBER,
        },
      ]);
      setSelectStudent(null);
    }
  }, [selectStudent]);

  useEffect(() => {
    if (createGroupData.isSuccess) {
      toast({
        duration: 3000,
        variant: "default",
        title: "Create Capstone Group",
        description: "Create Capstone Group Successfully",
      });
      const { data } = createGroupData.data;
      const groupId = data.id;
      navigate(`/groups/${groupId}`);
    }

    if (createGroupData.error) {
      toast({
        title: "Create Capstone Group",
        description:
          "Something went wrong, please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    }
  }, [
    createGroupData.data,
    createGroupData.error,
    createGroupData.isSuccess,
    navigate,
    toast,
  ]);

  const updateRoleMember = (member: Member, role: MemberRole) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        if (m.id === member.id) {
          return { ...m, role };
        }
        if (role === MemberRole.LEADER && m.role === MemberRole.LEADER) {
          return { ...m, role: MemberRole.MEMBER };
        }
        return m;
      })
    );
    if (role === MemberRole.LEADER) {
      setCurrentLeader(member);
    }
  };

  const handleRemoveMember = (member: Member) => {
    setMembers((prevMembers) => prevMembers.filter((m) => m.id !== member.id));
    if (member.role === MemberRole.LEADER) {
      setCurrentLeader(null);
    }
  };

  const handleCreateForm = async () => {
    const studentIds = members.map((member) => member.studentId);

    await createGroup({
      major_id: 1, // TODO: Handle select major instead fix
      semester_id: currentSemester!.id,
      student_ids: studentIds,
      name_group: groupName,
    });
  };

  const MemberItem: React.FC<{ member: Member }> = ({ member }) => (
    <div className="flex items-center justify-between p-2 border rounded-md border-gray-300">
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
          disabled={true}
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
  );

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
            <MemberItem key={member.id} member={member} />
          ))}
        </div>
      </div>

      {members.length <
        (user && user.common_info.user_type === UserTypes.ADMIN ? 6 : 5) && (
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
        <Button onClick={handleCreateForm} disabled={formValid}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Create Group
        </Button>
      </div>
    </div>
  );
};

export default CreateGroup;
