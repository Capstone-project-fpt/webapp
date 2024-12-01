/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/store";
import { useGetListTeachersHaveEvaluationComitteeGroupQuery } from "@/store/api/v1/endpoints/evaluations";
import { useLazyGetUsersByUserQuery } from "@/store/api/v1/endpoints/user";
import { UserTypes } from "@/types/accounts";
import React from "react";
import { useSelector } from "react-redux";
import { ActionMeta, SingleValue } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { Member, OptionType } from "../type";

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
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );
  const { data: listTeacherHaveEvaluationCommitteeGroup } =
    useGetListTeachersHaveEvaluationComitteeGroupQuery(
      { semester_id: currentSemester?.id || 0 },
      { skip: !currentSemester }
    );
  const [getUsers] = useLazyGetUsersByUserQuery();

  const loadPageOptions = async (search: string, _: any, additional: any) => {
    try {
      const { page } = additional;
      const limit = 10;
      const {
        data: { items, meta },
      } = await getUsers({
        email: search,
        limit,
        page,
        user_types: UserTypes.TEACHER,
      }).unwrap();

      const disableTeacherIds: number[] = [
        ...selectedMembers.map((t) => t.teacherId),
        ...(listTeacherHaveEvaluationCommitteeGroup
          ? listTeacherHaveEvaluationCommitteeGroup.data.map((l) => l.id)
          : []),
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
    } catch (error) {
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
