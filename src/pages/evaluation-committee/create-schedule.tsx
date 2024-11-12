import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OptionType } from "@/types";
import { GroupType } from "@/types/group";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvaluationQuery } from "@/store/api/v1/endpoints/evaluations";
import SelectStudentGroup from "./components/select-student-group";


const ReviewArr = [
  { title: "Review1", desc: "Review lần 1" },
  { title: "Review2", desc: "Review lần 2" },
  { title: "Review3", desc: "Review lần 3" },
];

const CreateReviewSchedule = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();
  const { data: evaluationData, isLoading, error } = useGetEvaluationQuery(
    { id: Number(evaluationId) },
    { skip: !evaluationId }
  );

  const { register, handleSubmit, setValue } = useForm();
  const [selectGroup, setSelectGroup] = useState<OptionType<GroupType> | null>(null);
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [evaluationGroup, setEvaluationGroup] = useState<string>("");

  const handleReviewChange = (value: string) => {
    const selectedReview = ReviewArr.find((item) => item.title === value);
    if (selectedReview) {
      setReviewTitle(selectedReview.title);
      setValue("description", selectedReview.desc);
    }
  };

  useEffect(() => {
    if (evaluationData) {
      setEvaluationGroup(evaluationData.data.name);
    }
  }, [evaluationData]);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      reviewTitle,
      studentGroup: selectGroup,
      startTime,
    };
    navigate(`/evaluation-committees/${evaluationId}/`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading evaluation data</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Review Schedule</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Label htmlFor="reviewTitle">Review Title</Label>
          <Select onValueChange={handleReviewChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select review title" />
            </SelectTrigger>
            <SelectContent>
              {ReviewArr.map((item, index) => (
                <SelectItem key={index} value={item.title}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="evaluationGroup">Evaluation Committee Group</Label>
            <Input
              id="evaluationGroup"
              value={evaluationGroup}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="studentGroup">Student Group</Label>
            <SelectStudentGroup
              value={selectGroup}
              onChangeValue={setSelectGroup}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="datetime-local"
              value={startTime}
              {...register("start_time", { required: true, onChange: (e) => setStartTime(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="datetime-local"
              {...register("end_time", {
                required: true,
                validate: (value) =>
                  value > startTime || "End time must be after start time",
              })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={6}
            placeholder="Enter description here..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateReviewSchedule;
