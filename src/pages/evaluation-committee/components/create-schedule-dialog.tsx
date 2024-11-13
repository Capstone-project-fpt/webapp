import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  useCreateScheduleMutation,
  useGetEvaluationQuery,
} from "@/store/api/v1/endpoints/evaluations";
import { OptionType } from "@/types";
import { GroupType } from "@/types/group";
import { CreateScheduleType } from "@/types/schedule";
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

const CreateScheduleDialog: React.FC = () => {
  const [createScheduleReview] = useCreateScheduleMutation();
  const { toast } = useToast();
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const { data: evaluationData } = useGetEvaluationQuery(
    { id: Number(evaluationId) },
    { skip: !evaluationId }
  );

  const [isOpened, setIsOpened] = useState(false);
  const [selectGroup, setSelectGroup] = useState<OptionType<GroupType> | null>(
    null
  );

  const initialValues: CreateScheduleType = {
    title: "",
    description: "",
    start_time: new Date(),
    type: "",
    end_time: new Date(new Date().getTime() + 30 * 60 * 1000),
    capstone_group_id: 0,
    evaluation_committee_id: evaluationData?.data.id || 0,
    semester_id: currentSemester?.id || 0,
  };

  const handleSubmit = async (
    values: CreateScheduleType,
    action: FormikHelpers<CreateScheduleType>
  ) => {
    if (values.start_time > values.end_time) {
      action.setFieldError(
        "end_time",
        "End time must be greater than start time"
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
        "Evaluation committee is required"
      );
      return;
    }

    if (!values.semester_id) {
      toast({
        title: "Create Schedule",
        description: "Something went wrong",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await createScheduleReview(values).unwrap();
      if (response.data) {
        toast({
          title: "Create Schedule",
          description: response.data || "Create schedule successfully",
        });
        setIsOpened(false);
      }
    } catch (error) {
      toast({
        title: "Create Schedule",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
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
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Schedule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
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
                        (item) => item.title === value
                      );
                      if (selectedReview) {
                        setFieldValue("title", selectedReview.title);
                        setFieldValue(
                          "description",
                          selectedReview.description
                        );
                        setFieldValue("type", selectedReview.type);
                      }
                    }}
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
                            !values.start_time && "text-muted-foreground"
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
                          selected={new Date(values.start_time)}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = new Date(values.start_time);
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              setFieldValue("start_time", date);
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
                            !values.end_time && "text-muted-foreground"
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
                  Create
                </Button>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheduleDialog;
