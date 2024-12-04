import { SemesterType, SemesterWithCountType } from "@/types/semester";
import { api } from "..";
import { ListPaginationType, PaginationType, ResponseType } from "@/types";

const semesterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query<
      ResponseType<ListPaginationType<SemesterType>>,
      PaginationType
    >({
      query: ({ limit = 10, page = 1, order_by = "DESC" }) => ({
        url: "/semesters/",
        params: { limit, page, order_by },
      }),
      providesTags: ["Semester"],
    }),
    getSemester: builder.query<ResponseType<SemesterType>, { id: number }>({
      query: ({ id }) => ({
        url: `/semesters/${id}`,
      }),
    }),
    getCurrentSemester: builder.query<ResponseType<SemesterType>, null>({
      query: () => ({
        url: `/semesters/current`,
      }),
    }),
    createSemesters: builder.mutation<
      void,
      { name: string; start_time: string; end_time: string }
    >({
      query: (data) => ({
        url: "/semesters/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),
    updateSemesters: builder.mutation<
      void,
      { id: number; name: string; start_time: string; end_time: string }
    >({
      query: (data) => ({
        url: `/semesters/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),
    deleteSemesters: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/semesters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Semester"],
    }),

    getSemestersWithCount: builder.query<
      ResponseType<ListPaginationType<SemesterWithCountType>>,
      PaginationType
    >({
      query: ({ limit = 10, page = 1, order_by = "DESC" }) => ({
        url: "/semesters/statistics",
        params: { limit, page, order_by },
      }),
      providesTags: ["Semester"],
    }),
  }),
});

export const {
  useGetSemestersQuery,
  useGetSemesterQuery,
  useGetCurrentSemesterQuery,
  useCreateSemestersMutation,
  useUpdateSemestersMutation,
  useDeleteSemestersMutation,
  useGetSemestersWithCountQuery,
} = semesterApi;
