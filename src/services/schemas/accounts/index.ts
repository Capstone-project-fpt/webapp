import { LectureType, StudentType } from "@/types/accounts";
import * as yub from "yup";

export const studentSchema: yub.ObjectSchema<StudentType> = yub.object({
  id: yub.number().required("ID field is required"),
  student_id: yub.number().required("Student ID field is required"),
  code: yub
    .string()
    .matches(
      /^(DE|DA|DS)\d{6}$/,
      "Code must start with DE, DA, or DS followed by 6 digits"
    )
    .required("Code field is required"),
  email: yub
    .string()
    .email("Email is invalid")
    .required("Email field is required"),
  name: yub.string().required("Name field is required"),
  phone_number: yub
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number field is required"),
  sub_major_id: yub.number().required("Sub major field is required"),
});

export const lectureSchema: yub.ObjectSchema<LectureType> = yub.object({
  id: yub.number().required("ID field is required"),
  teacher_id: yub.number().required("Teacher ID field is required"),
  email: yub
    .string()
    .email("Email is invalid")
    .required("Email field is required"),
  name: yub.string().required("Name field is required"),
  phone_number: yub
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number field is required"),
  sub_major_id: yub.number().required("Sub major field is required"),
});
