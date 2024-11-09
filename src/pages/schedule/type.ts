import { UserItem, UserType } from "@/types/accounts";

export enum MemberRole {
  LEADER = "leader",
  MEMBER = "member",
}

export interface Member extends UserType {
  role?: MemberRole;
  studentId: number;
}

export interface OptionType {
  value: UserItem;
  label: string;
  disabled: boolean;
}
