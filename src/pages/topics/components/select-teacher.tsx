import { ActionMeta, SingleValue } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { OptionType, Teacher } from "../type";
import { useLazyGetUsersByUserQuery } from "@/store/api/v1/endpoints/user";
import { UserTypes } from "@/types/accounts";
import { isNil } from "@/utils/lodash";

const defaultAdditional = { page: 1 };

interface SelectTeacherProps {
  value: OptionType | null;
  onChangeValue:
    | ((
        newValue: SingleValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
      ) => void)
    | undefined;
  teacher?: Teacher;
}

const SelectTeacher: React.FC<SelectTeacherProps> = ({
  value,
  onChangeValue,
  teacher,
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

      const options = items.map((item) => ({
        value: item,
        label: item.common_info.email,
        disabled: !isNil(teacher),
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
      cacheUniqs={[teacher]}
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

export default SelectTeacher;
