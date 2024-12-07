import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createScheduleReviewSchema } from "@/services/schemas/schedule-review";
import { RootState } from "@/store";
import {
  useGetEvaluationQuery,
  useUpdateScheduleMutation,
} from "@/store/api/v1/endpoints/evaluations";
import { OptionType, ResponseErrorType } from "@/types";
import { GroupType } from "@/types/group";
import { CreateScheduleType, ScheduleType } from "@/types/schedule";
import { ReloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ErrorMessage, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SelectStudentGroup from "./select-student-group";

const SCHEDULE_REVIEWS = [
  { title: "Review1", description: "Review lần 1", type: "first_review" },
  { title: "Review2", description: "Review lần 2", type: "second_review" },
  { title: "Review3", description: "Review lần 3", type: "third_review" },
];

interface UpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ScheduleType;
  refetchSchedules: () => void;
}

const UpdateScheduleDialog: React.FC<UpdateDialogProps> = ({
  open,
  onOpenChange,
  schedule,
  refetchSchedules,
}) => {
  const [updateScheduleReview] = useUpdateScheduleMutation();
  const { toast } = useToast();
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester,
  );
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const { data: evaluationData } = useGetEvaluationQuery(
    { id: Number(evaluationId) },
    { skip: !evaluationId },
  );

  const [selectGroup, setSelectGroup] = useState<OptionType<GroupType> | null>({
    value: schedule.capstone_group,
    label: schedule.capstone_group.name_group,
    disabled: false,
  });

  const initialValues: CreateScheduleType & { id: number } = {
    id: schedule.id,
    title: schedule.title,
    description: schedule.description,
    start_time: new Date(schedule.start_time),
    type: schedule.type,
    end_time: new Date(schedule.end_time),
    capstone_group_id: schedule.capstone_group.id,
    evaluation_committee_id: schedule.evaluation_committee.id,
    semester_id: schedule.capstone_group.semester_id,
  };

  const handleSubmit = async (
    values: CreateScheduleType,
    action: FormikHelpers<CreateScheduleType>,
  ) => {
    if (values.start_time > values.end_time) {
      action.setFieldError(
        "end_time",
        "End time must be greater than start time",
      );
      return;
    }

    if (!values.capstone_group_id) {
      action.setFieldError("capstone_group_id", "Capstone group is required");
      return;
    }

    if (!values.evaluation_committee_id) {
      action.setFieldError(
        "evaluation_committee_id",
        "Evaluation committee is required",
      );
      return;
    }

    if (!values.semester_id) {
      toast({
        title: "Update Schedule",
        description: "The current semester is not available. Please try again",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await updateScheduleReview({
        ...values,
        id: schedule.id,
      }).unwrap();
      toast({
        title: "Update Schedule",
        description: response.data || "Update schedule successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update Schedule",
        description:
          (error as ResponseErrorType)?.data?.error ||
          "Something went wrong, please try again. If the problem persists, please contact the administrator",
        variant: "destructive",
      });
    }
    refetchSchedules();
  };

  useEffect(() => {
    if (selectGroup) {
      const form = formikRef.current;
      if (form) {
        form.setFieldValue("capstone_group_id", selectGroup.value.id);
      }
    }
  }, [selectGroup]);

  useEffect(() => {
    if (evaluationData && evaluationData.data) {
      const form = formikRef.current;
      if (form) {
        form.setFieldValue("evaluation_committee_id", evaluationData.data.id);
      }
    }
  }, [evaluationData]);

  useEffect(() => {
    if (currentSemester) {
      const form = formikRef.current;
      if (form) {
        form.setFieldValue("semester_id", currentSemester.id);
      }
    }
  }, [currentSemester]);

  // Create a ref to store Formik instance
  const formikRef = React.useRef<FormikProps<CreateScheduleType>>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Schedule</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={createScheduleReviewSchema}
          onSubmit={handleSubmit}
          innerRef={formikRef}
        >
          {({
            values,
            handleBlur,
            handleChange,
            setFieldValue,
            isSubmitting,
          }) => {
            return (
              <Form className=" flex flex-col gap-3 ">
                <div className=" flex flex-col gap-2 ">
                  <Label htmlFor="title">Review Title</Label>
                  <Select
                    name="title"
                    value={values.title}
                    onValueChange={(value) => {
                      const selectedReview = SCHEDULE_REVIEWS.find(
                        (item) => item.title === value,
                      );
                      if (selectedReview) {
                        setFieldValue("title", selectedReview.title);
                        setFieldValue(
                          "description",
                          selectedReview.description,
                        );
                        setFieldValue("type", selectedReview.type);
                      }
                    }}
                    disabled={true}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select review title" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHEDULE_REVIEWS.map((item, index) => (
                        <SelectItem key={index} value={item.title}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="title"
                    component={"div"}
                    className=" text-sm text-danger "
                  />
                </div>

                <div className=" flex flex-col gap-2 ">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="description"
                    component={"div"}
                    className=" text-sm text-danger "
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluation_committee_id">
                      Evaluation Committee Group
                    </Label>
                    <Input
                      id="evaluation_committee_id"
                      name="evaluation_committee_id"
                      value={evaluationData?.data.name}
                      disabled
                    />
                    <ErrorMessage
                      name="evaluation_committee_id"
                      component="div"
                      className="text-sm text-danger"
                    />
                  </div>
                  <div>
                    <Label>Student Group</Label>
                    <SelectStudentGroup
                      value={selectGroup}
                      onChangeValue={setSelectGroup}
                      selectedGroups={(
                        evaluationData?.data.assign_groups || []
                      ).map((group) => group.id)}
                      isSwapDisabled={true}
                      disabled={true}
                    />
                    <ErrorMessage
                      name="capstone_group_id"
                      component="div"
                      className="text-sm text-danger"
                    />
                  </div>
                </div>
                <div>
                  <Label>Start Time</Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !values.start_time && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {values.start_time ? (
                            format(new Date(values.start_time), "PPP HH:mm:ss")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          fromDate={new Date()}
                          toDate={new Date(currentSemester?.end_time || "")}
                          selected={new Date(values.start_time)}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = new Date(values.start_time);
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              setFieldValue("start_time", date);
                              setFieldValue(
                                "end_time",
                                new Date(date.getTime() + 60 * 60 * 1000),
                              );
                            }
                          }}
                          initialFocus
                        />
                        <div className="border-t border-border p-3">
                          <TimePicker
                            date={new Date(values.start_time)}
                            setDate={(date) => {
                              if (date) {
                                setFieldValue("start_time", date);
                              }
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <ErrorMessage
                    name="start_time"
                    component="div"
                    className="text-sm text-danger"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !values.end_time && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {values.end_time ? (
                            format(new Date(values.end_time), "PPP HH:mm:ss")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          fromDate={new Date(values.start_time || "")}
                          toDate={new Date(currentSemester?.end_time || "")}
                          selected={new Date(values.end_time)}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = new Date(values.end_time);
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              setFieldValue("end_time", date);
                            }
                          }}
                          initialFocus
                        />
                        <div className="border-t border-border p-3">
                          <TimePicker
                            date={new Date(values.end_time)}
                            setDate={(date) => {
                              if (date) {
                                setFieldValue("end_time", date);
                              }
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <ErrorMessage
                    name="end_time"
                    component="div"
                    className="text-sm text-danger"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className=" w-full "
                >
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateScheduleDialog;
