import { useLazyGetUsersQuery } from "@/store/api/v1/endpoints/admin";
import { UserTypes } from "@/types/accounts";
import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { Member, OptionType } from "../type";
import { ActionMeta, SingleValue } from "react-select";

const defaultAdditional = { page: 1 };

interface SelectStudentProps {
  value: OptionType | null;
  onChangeValue: ((newValue: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void) | undefined;
  selectedMembers: Member[];
}

const SelectStudent: React.FC<SelectStudentProps> = ({
  value,
  onChangeValue,
  selectedMembers,
}) => {
  const [getUsers] = useLazyGetUsersQuery();

  const loadPageOptions = async (
    q: string,
    prevOptions: unknown,
    { page }: { page: number }
  ) => {
    const limit = 10;
    try {
      const {
        data: { items, meta },
      } = await getUsers({
        email: q,
        limit,
        page,
        user_types: UserTypes.STUDENT,
      }).unwrap();

      const options = items.map((item) => ({
        value: item,
        label: item.common_info.email,
        disabled: selectedMembers.some((m) => m.id === item.common_info.id),
      }));

      return {
        options,
        hasMore: meta.current_page * limit < meta.total,
        additional: { page: page + 1 },
      };
    } catch {
      return { options: [], hasMore: false, additional: { page: 1 } };
    }
  };

  return (
    <AsyncPaginate
      cacheUniqs={[selectedMembers]}
      debounceTimeout={300}
      additional={defaultAdditional}
      value={value}
      loadOptions={loadPageOptions}
      onChange={onChangeValue}
      placeholder="Search by email"
      isOptionDisabled={(option) => option.disabled}
    />
  );
};

export default SelectStudent;
