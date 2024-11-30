import { RootState } from "@/store";
import { useGetListStudentsHaveCapstoneGroupQuery } from "@/store/api/v1/endpoints/groups";
import { useLazyGetUsersByUserQuery } from "@/store/api/v1/endpoints/user";
import { UserTypes } from "@/types/accounts";
import React from "react";
import { useSelector } from "react-redux";
import { ActionMeta, SingleValue } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { Member, OptionType } from "../type";

const defaultAdditional = { page: 1 };

interface SelectStudentProps {
  value: OptionType | null;
  onChangeValue:
    | ((
        newValue: SingleValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
      ) => void)
    | undefined;
  selectedMembers: Member[];
}

const SelectStudent: React.FC<SelectStudentProps> = ({
  value,
  onChangeValue,
  selectedMembers,
}) => {
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );
  const { data: listStudentsHaveCapstoneGroup } =
    useGetListStudentsHaveCapstoneGroupQuery(
      { semester_id: currentSemester?.id || 0 },
      { skip: !currentSemester }
    );

  console.log(listStudentsHaveCapstoneGroup);
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
        user_types: UserTypes.STUDENT,
      }).unwrap();

      const disableStudentIds: number[] = [
        ...selectedMembers.map((s) => s.studentId),
        ...(listStudentsHaveCapstoneGroup
          ? listStudentsHaveCapstoneGroup.data.map((l) => l.id)
          : []),
      ];

      const options = items.map((item) => ({
        value: item,
        label: item.common_info.email,
        disabled: disableStudentIds.includes(
          item.extra_info.student!.student_id
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
