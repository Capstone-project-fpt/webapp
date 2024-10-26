import { PaginationType, ResponseType } from "./utils";

export interface StudentType {
  id?: number;
  code: string;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
  capstone_group_id?: number;
}

export interface LectureType {
  id?: number;
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
    lecture?: LectureType;
  };
}
interface UsersType {
  items: UserItem[];
  meta: {
    current_page: number;
    total: number;
  };
}

export interface GetUsersResponse extends ResponseType<UsersType> {}

export interface UsersPaginationType extends PaginationType {
  user_types?: UserTypes;
  email?: string;
}
