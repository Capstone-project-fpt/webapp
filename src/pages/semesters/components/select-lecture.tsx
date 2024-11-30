/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLazyGetUsersByUserQuery } from "@/store/api/v1/endpoints/user";
import { UserTypes } from "@/types/accounts";
import React from "react";
import { ActionMeta, SingleValue } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

import { UserItem, UserType } from "@/types/accounts";

export interface Member extends UserType {
  teacherId: number;
}

export interface OptionType {
  value: UserItem;
  label: string;
  disabled: boolean;
}

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
}

const SelectLecture: React.FC<SelectLectureProps> = ({
  value,
  onChangeValue,
  selectedMembers,
}) => {
  const [getUsers] = useLazyGetUsersByUserQuery();

  const loadPageOptions = async (
    q: string,
    _prevOptions: unknown,
    additional: any
  ) => {
    const { page } = additional;
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

      const disableTeacherIds: number[] = [
        ...selectedMembers.map((t) => t.teacherId),
      ];

      const options = items.map((item) => ({
        value: item,
        label: item.common_info.email,
        disabled: disableTeacherIds.includes(
          item.extra_info.teacher!.teacher_id
        ),
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
