import { LectureType, StudentType } from "@/types/accounts";
import * as yub from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const studentSchema: yub.ObjectSchema<StudentType> = yub.object({
  id: yub.number().required("ID field is required"),
  student_id: yub.number().required("Student ID field is required"),
  code: yub
    .string()
    .matches(
      /^(DE|DA|DS)\d{6}$/,
      "Code must start with DE, DA, or DS followed by 6 digits",
    )
    .required("Code field is required"),
  email: yub
    .string()
    .email("Email is invalid")
    .matches(emailRegex, "Email is invalid")
    .required("Email field is required"),
  name: yub.string().required("Name field is required"),
  phone_number: yub
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone number field is required"),
  sub_major_id: yub.number().required("Sub major field is required"),
});

export const lectureSchema: yub.ObjectSchema<LectureType> = yub.object({
  id: yub.number().required("ID field is required"),
  teacher_id: yub.number().required("Teacher ID field is required"),
  email: yub
    .string()
    .email("Email is invalid")
    .matches(emailRegex, "Email is invalid")
    .required("Email field is required"),
  name: yub.string().required("Name field is required"),
  phone_number: yub
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone number field is required"),
  sub_major_id: yub.number().required("Sub major field is required"),
});
