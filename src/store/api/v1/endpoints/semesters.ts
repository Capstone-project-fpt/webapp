<<<<<<< HEAD
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
=======
import { SemestersType, SemesterType } from "@/types/semester";
import { api } from "..";
import { ResponseType } from "@/types";

const semesterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query<ResponseType<SemestersType>, { limit?: number; page?: number }>({
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
      query: ({ limit = 10, page = 1 }) => ({
        url: '/semesters/',
        params: { limit, page },
      }),
      providesTags: ["Semester"],
    }),
<<<<<<< HEAD
    getSemester: builder.query<GetSemestersResponse, { id: number }>({
=======
    getSemester: builder.query<ResponseType<SemesterType>, { id: number }>({
>>>>>>> 952d2e8bedc3f2fdab7d0c072c261c41575605d4
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
