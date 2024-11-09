import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { ActionMeta, SingleValue } from "react-select";
import { useGetGroupsQuery } from "@/store/api/v1/endpoints/groups";
import { GroupType } from "@/types/group";

interface OptionType {
  label: string;
  value: GroupType;
}

interface SelectGroupStudentProps {
  value: OptionType | null;
  onChangeValue: (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  selectedGroup: GroupType[];
  semesterId?: number;
}

const defaultAdditional = { page: 1 };

const SelectGroupStudent: React.FC<SelectGroupStudentProps> = ({
  value,
  onChangeValue,
  selectedGroup,
  semesterId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { data, error } = useGetGroupsQuery({
    limit: 10,
    page: defaultAdditional.page,
    semester_id: semesterId,
  });

  const loadPageOptions = async (
    q: string,
    prevOptions: unknown,
    { page }: { page: number }
  ) => {
    setIsLoading(true);

    try {
      const response = await useGetGroupsQuery({
        group_name: q,
        limit: 10,
        page,
        semester_id: semesterId,
      }).unwrap();

      const options = response.items.map((item: GroupType) => ({
        value: item,
        label: item.name_group,
        disabled: selectedGroup.some((group) => group.id === item.id),
      }));

      return {
        options,
        hasMore: response.meta.current_page * 10 < response.meta.total,
        additional: { page: page + 1 },
      };
    } catch (error) {
      console.error("Error fetching groups:", error);
      return { options: [], hasMore: false, additional: { page: 1 } };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AsyncPaginate
      cacheUniqs={[value]}
      debounceTimeout={300}
      additional={defaultAdditional}
      value={value}
      loadOptions={loadPageOptions}
      onChange={onChangeValue}
      placeholder="Search by group name"
      isOptionDisabled={(option) => option.disabled}
      isLoading={isLoading}
    />
  );
};

export default SelectGroupStudent;
