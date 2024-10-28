import { SemesterType } from "@/types/semester";
import { api } from "..";
export interface GetSemestersResponse {
  code: number;
  data: {
    items: SemesterType[];
    meta: {
      current_page: number;
      total: number;
    };
  };
  message: boolean;
}

const semesterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query<GetSemestersResponse, { limit?: number; page?: number }>({
      query: ({ limit = 10, page = 1 }) => ({
        url: '/semesters/',
        params: { limit, page },
      }),
      providesTags: ["Semester"],
    }),
    getSemester: builder.query<GetSemestersResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/semesters/${id}`,
      }),
    }),
    createSemesters: builder.mutation<void, {name: string, start_time:string, end_time:string}>({
      query: (data) => ({
        url: '/semesters/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),
    updateSemesters: builder.mutation<void, {id: number, name: string, start_time:string, end_time:string}>({
      query: (data) => ({
        url: `/semesters/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),
    deleteSemesters: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/semesters/${id}`,
        method: 'DELETE',
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
useDeleteSemestersMutation
} = semesterApi;
