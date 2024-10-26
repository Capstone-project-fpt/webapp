import { UserItem } from "@/types/accounts";

export interface Teacher extends UserItem {}

export interface OptionType {
  value: UserItem;
  label: string;
  disabled: boolean;
}
