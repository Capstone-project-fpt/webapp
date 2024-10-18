import { useLazyGetUsersQuery } from "@/store/api/v1/endpoints/admin";
import { UserTypes } from "@/types/accounts";
import React, { useState } from "react";

import { AsyncPaginate } from "react-select-async-paginate";

type AdditionalType = {
  page: number;
};

const defaultAdditional: AdditionalType = {
  page: 1,
};

export type OptionType = {
  value: number;
  label: string;
};

const SelectStudent: React.FC = () => {
  const [getUsers] = useLazyGetUsersQuery();

  const loadPageOptions = async (
    q: string,
    prevOptions: unknown,
    { page }: AdditionalType
  ) => {
    const limit = 2;

    const data = await getUsers({
      email: q,
      limit,
      page,
      user_types: UserTypes.STUDENT,
    })
      .unwrap()
      .then((queryData) => {
        const { items, meta } = queryData.data;

        const { current_page, total } = meta;
        const options = items.map((item) => ({
          value: item.common_info.id,
          label: item.common_info.email,
        }));
        return { options, current_page, total };
      })
      .catch(() => {
        // Need to retry the request
        return { options: [], current_page: 0, total: 0 };
      });

    const { options, current_page, total } = data;
    return {
      options: options,
      hasMore: current_page * limit < total,
      additional: {
        page: page + 1,
      },
    };
  };

  const [value, onChange] = useState<OptionType | null>(null);
  return (
    <AsyncPaginate
      debounceTimeout={300}
      additional={defaultAdditional}
      value={value}
      loadOptions={loadPageOptions}
      onChange={onChange}
      placeholder="Search by email"
    />
  );
};

export default SelectStudent;
