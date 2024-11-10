import { PaginationType, ResponseType } from "./utils";

export interface StudentType {
  student_id: number;
  id?: number; 
  code: string;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
}

export interface LectureType {
  teacher_id: number;
  id?: number; 
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  user_type: UserTypes;
}

export enum UserTypes {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export interface UserItem {
  common_info: UserType;
  extra_info: {
    student?: StudentType;
    teacher?: LectureType;
  };
}
interface UsersType {
  items: UserItem[];
  meta: {
    current_page: number;
    total: number;
  };
}

export interface GetUsersResponse extends ResponseType<UsersType> { }

export interface UsersPaginationType extends PaginationType {
  user_types?: UserTypes;
  email?: string;
}

export interface UpdateStudentPayload {
  id: number;
  student_id?: number;
  code: string;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
}

export interface UpdateLecturePayload {
  id: number;
  teacher_id?: number;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
}