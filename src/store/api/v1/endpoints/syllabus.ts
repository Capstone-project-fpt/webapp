
import { ListPaginationType, ResponseType } from "@/types";
import { SyllabusType } from "@/types/syllabus";
import { api } from "..";

const SyllabusApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSyllabuses: builder.query<ResponseType<ListPaginationType<SyllabusType>>, { limit?: number; page?: number }>({
      query: ({ limit = 10, page = 1 }) => ({
        url: '/syllabus/',
        params: { limit, page },

      }),
      providesTags: ["Syllabus"],
    }),
    createSyllabus: builder.mutation<void, { code: string, name: string, path: string }>({
      query: (data) => ({
        url: '/syllabus/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Syllabus"],
    }),
    updateSyllabus: builder.mutation<void, { id: number; code: string, name: string, path: string }>({
      query: (data) => ({
        url: `/syllabus/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Syllabus"],
    }),
    getSyllabus: builder.query<ResponseType<SyllabusType>, { id: number }>({
      query: ({ id }) => ({
        url: `/syllabus/${id}`,
      }),
    }),
    deleteSyllabus: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/syllabus/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Syllabus"],
    }),
  }),
});

export const {
  useGetSyllabusesQuery,
  useGetSyllabusQuery,
  useCreateSyllabusMutation,
  useUpdateSyllabusMutation,
  useDeleteSyllabusMutation
} = SyllabusApi;
