import { UpsertSemesterType } from "@/types/semester";
import * as yub from "yup";

export const semesterSchema: yub.ObjectSchema<UpsertSemesterType> = yub.object({
  id: yub.number().optional(),
  name: yub.string().required("Name field is required"),
  start_time: yub.date().required("Start time field is required"),
  end_time: yub.date().required("End time field is required"),
});
