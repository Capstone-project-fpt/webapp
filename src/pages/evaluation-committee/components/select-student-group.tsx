import { RootState } from "@/store";
import { useLazyGetGroupsQuery } from "@/store/api/v1/endpoints/groups";
import { OptionType } from "@/types";
import { GroupType } from "@/types/group";
import React from "react";
import { useSelector } from "react-redux";
import { ActionMeta, SingleValue } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

interface SelectGroupStudentProps {
  selectedGroups: number[];
  value: OptionType<GroupType> | null;
  onChangeValue:
    | ((
        newValue: SingleValue<OptionType<GroupType>>,
        actionMeta: ActionMeta<OptionType<GroupType>>
      ) => void)
    | undefined;
}

const defaultAdditional = { page: 1 };

const SelectGroupStudent: React.FC<SelectGroupStudentProps> = ({
  value,
  onChangeValue,
  selectedGroups = [],
}) => {
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );
  const [getGroups] = useLazyGetGroupsQuery();

  const loadPageOptions = async (
    prevOptions: unknown,
    { page }: { page: number }
  ) => {
    const limit = 10;
    try {
      const {
        data: { items, meta },
      } = await getGroups({
        limit,
        page,
        semester_id: currentSemester?.id,
      }).unwrap();

      const options = items.map((item) => ({
        value: item,
        label: item.name_group,
        disabled: selectedGroups.includes(item.id),
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
      isOptionDisabled={(option) => option.disabled}
    />
  );
};

export default SelectGroupStudent;
