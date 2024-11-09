import { UserItem, UserType } from "@/types/accounts";

export interface Member extends UserType {
  teacherId: number;
}

export interface OptionType {
  value: UserItem;
  label: string;
  disabled: boolean;
}
