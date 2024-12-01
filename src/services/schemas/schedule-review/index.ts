import { CreateScheduleType } from "@/types/schedule";
import * as yub from "yup";

export const createScheduleReviewSchema: yub.ObjectSchema<CreateScheduleType> =
  yub.object({
    title: yub.string().required("Title field is required"),
    type: yub.string().required("Type field is required"),
    description: yub.string().required("Description field is required"),
    start_time: yub.date().required("Start time field is required"),
    end_time: yub.date().required("End time field is required"),
    capstone_group_id: yub
      .number()
      .required("Capstone group field is required"),
    evaluation_committee_id: yub
      .number()
      .required("Evaluation Committee field is required"),
    semester_id: yub.number().required("Semester field is required"),
  });
