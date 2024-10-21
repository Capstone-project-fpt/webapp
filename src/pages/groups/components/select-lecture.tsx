import { useLazyGetUsersQuery } from "@/store/api/v1/endpoints/admin";
import { UserTypes } from "@/types/accounts";
import React from "react";
import { ActionMeta, SingleValue } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { OptionType } from "../type";

const defaultAdditional = { page: 1 };

interface SelectLectureProps {
  value: OptionType | null;
  onChangeValue:
    | ((
        newValue: SingleValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
      ) => void)
    | undefined;
}

const SelectLecture: React.FC<SelectLectureProps> = ({
  value,
  onChangeValue,
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
        user_types: UserTypes.TEACHER,
      }).unwrap();

      const options = items.map((item) => ({
        value: item,
        label: item.common_info.email,
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

export default SelectLecture;
