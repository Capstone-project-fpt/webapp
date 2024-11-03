import { ResponseType } from "@/types";
import { SemestersType, SemesterType } from "@/types/semester";
import { api } from "..";
import { PaginationType, ResponseType } from "@/types";

const semesterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query<ResponseType<SemestersType>, PaginationType>({
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
  }),
});

export const {
  useGetSemestersQuery,
  useGetSemesterQuery,
  useCreateSemestersMutation,
  useUpdateSemestersMutation,
  useDeleteSemestersMutation,
} = semesterApi;
