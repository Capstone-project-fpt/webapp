import { Item } from "@/store/api/v1/endpoints/admin";

export enum MemberRole {
  LEADER = "leader",
  MEMBER = "member",
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
}

export interface OptionType {
  value: Item;
  label: string;
  disabled: boolean;
}
