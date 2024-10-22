export interface StudentType {
  id?: number;
  code: string;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
}

export interface LectureType {
  name: string;
  email: string;
  phone_number: string;
  sub_major_id: number;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  user_type: string;
}

export enum UserTypes {
  STUDENT = "student",
  TEACHER = "teacher",
}
