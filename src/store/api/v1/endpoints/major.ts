import { SubMajor } from "@/services/schemas/major";
import { PaginationType, ResponseType } from "@/types";
import { api } from "..";

interface SubMajorData {
  items: SubMajor[];
  meta: {
    current_page: number;
    total: number;
  };
}

const majorEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubMajors: builder.query<ResponseType<SubMajorData>, PaginationType>({
      query: ({ limit = 100, page = 1 }) => ({
        url: '/sub-majors/',
        params: { limit, page },
      }),
    }),
  }),
});

export const {
  useGetSubMajorsQuery
} = majorEndPoint;
