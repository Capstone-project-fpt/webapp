
import { SyllabusesType, SyllabusType } from "@/types/syllabus";
import { api } from "..";
import { ResponseType } from "@/types";

const SyllabusApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSyllabuses: builder.query<ResponseType<SyllabusesType>, { limit? :number ; page? :number}> ({
            query: ({limit = 10, page =1 }) => ({
                url:'/syllabus/',
                params:{limit,page},

            }),
            providesTags: ["Syllabus"],
        }),
        
        getSyllabus: builder.query<ResponseType<SyllabusType>, { id: number }>({
            query: ({ id }) => ({
              url: `/syllabus/${id}`,
            }),
          }),
        createSyllabus: builder.mutation<void, {code: string, name: string, path:string }>({
            query: (data) => ({
              url: '/Syllabus/',
              method: 'POST',
              body: data,
            }),
            invalidatesTags: ["Syllabus"],
          }),
          updateSyllabus: builder.mutation<void, {id: number; code: string, name: string, path:string}>({
            query: (data) => ({
              url: `/syllabus/`,
              method: 'PUT',
              body: data,
            }),
            invalidatesTags: ["Syllabus"],
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

