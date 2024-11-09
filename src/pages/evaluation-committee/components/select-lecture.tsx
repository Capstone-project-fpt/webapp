import { UserTypes } from "@/types/accounts";
import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { Member, OptionType } from "../type";
import { ActionMeta, SingleValue } from "react-select";
import { useLazyGetUsersByUserQuery } from "@/store/api/v1/endpoints/user";

const defaultAdditional = { page: 1 };

interface SelectLectureProps {
  value: OptionType | null;
  onChangeValue:
  | ((
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void)
  | undefined;
  selectedMembers: Member[]; 
  existingGroupMembers: number[]; 
}

const SelectLecture: React.FC<SelectLectureProps> = ({
  value,
  onChangeValue,
  selectedMembers,
  existingGroupMembers,
}) => {
  const [getUsers] = useLazyGetUsersByUserQuery();

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

      const options = items.map((item) => {
        const teacherId = item.extra_info.teacher?.teacher_id;
        const isDisabled =
          teacherId !== undefined &&
          (existingGroupMembers.includes(teacherId) ||
            selectedMembers.some((m) => m.teacherId === teacherId));

        return {
          value: item,
          label: item.common_info.email,
          disabled: isDisabled,
        };
      });

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
