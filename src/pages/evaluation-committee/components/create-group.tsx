import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import { useCreateEvaluationMutation } from "@/store/api/v1/endpoints/evaluations";
import { setBreadCrumb } from "@/store/slice/app";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Member, OptionType } from "../type";
import SelectLecture from "./select-lecture";

const CreateEvaluationGroup: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );
  const [createEvaluationGroup, createEvaluationGroupData] = useCreateEvaluationMutation();
  const { isLoading } = createEvaluationGroupData;

  const [members, setMembers] = useState<Member[]>([]);
  const [groupName, setGroupName] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [selectLecturer, setSelectLecturer] = useState<OptionType | null>(null);

  if (!currentSemester) {
    toast({
      title: "Get Current Semester",
      description:
        "Cannot get current semester, please inform Admin to create the current semester.",
      variant: "destructive",
    });

    navigate("/");
  }

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Evaluation Committee", link: "/evaluation-committees" },
        { title: "Create", link: "/evaluation-committees/create" },
      ])
    );
  }, [dispatch]);

  useEffect(() => {
    setFormValid(groupName.trim() === "" || members.length < 2);
  }, [groupName, members]);

  useEffect(() => {
    if (selectLecturer) {
      const { value } = selectLecturer;
      if (members.length < 3) {
        setMembers((prevMembers) => [
          ...prevMembers,
          {
            ...value.common_info,
            teacherId: value.extra_info.teacher?.teacher_id as number,
          },
        ]);
        setSelectLecturer(null);
      } else {
        toast({
          title: "Limit reached",
          description: "You can only add up to 3 lecturers to the group.",
          variant: "destructive",
        });
      }
    }
  }, [selectLecturer]);

  useEffect(() => {
    if (createEvaluationGroupData.isSuccess) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Create Evaluation Group",
        description: "Created the Evaluation Group successfully.",
      });
      navigate(`/evaluation-committees/`);
    }

    if (createEvaluationGroupData.error) {
      toast({
        title: "Create Evaluation Group",
        description:
          "Something went wrong, please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    }
  }, [
    createEvaluationGroupData.data,
    createEvaluationGroupData.error,
    createEvaluationGroupData.isSuccess,
    navigate,
    toast,
  ]);

  const handleRemoveMember = (member: Member) => {
    setMembers((prevMembers) => prevMembers.filter((m) => m.id !== member.id));
  };

  const handleCreateForm = async () => {
    const teacherIds = members.map((member) => member.teacherId);

    await createEvaluationGroup({
      semester_id: currentSemester!.id,
      teacher_ids: teacherIds,
      name: groupName,
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
        <p>Member</p>
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
      <h1 className="font-bold uppercase">Create Evaluation Committee Group</h1>
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
          (At least 2 members are required to create an evaluation group.)
        </p>
        <div className="mt-2 space-y-2">
          {members.map((member) => (
            <MemberItem key={member.teacherId} member={member} />
          ))}
        </div>
      </div>

      {members.length < 3 && (
        <div className="space-y-2">
          <Label htmlFor="newMemberName">Add Lecturer</Label>
          <SelectLecture
            value={selectLecturer}
            onChangeValue={setSelectLecturer}
            selectedMembers={members} 
            existingGroupMembers={[]}          />
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleCreateForm} disabled={formValid}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Create Evaluation Group
        </Button>
      </div>
    </div>
  );
};

export default CreateEvaluationGroup;
