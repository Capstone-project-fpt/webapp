import { GetUsersResponse, LectureType, StudentType, UserTypes } from "@/types/accounts";
import { api } from "..";

const adminEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, { limit?: number; page?: number; user_types?: UserTypes, email?: string }>({
      query: ({ limit = 10, page = 1, user_types, email }) => ({
        url: 'admin/users/',
        params: { limit, page, user_types, email },
      }),
      providesTags: ["Account"],
    }),
    deleteUser: builder.mutation({
      query: ({ id }: { id: number }) => ({
        url: `admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),

    //#region Students
    createStudent: builder.mutation({
      query: (body: StudentType) => ({
        url: "admin/students/create-account",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    importStudents: builder.mutation({
      query: (body: FormData) => ({
        url: "admin/students/import-data",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    updateStudent: builder.mutation({
      query: (body) => ({
        url: "admin/students/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    //#endregion

    //#region Lecturers
    createLecture: builder.mutation({
      query: (body: LectureType) => ({
        url: "admin/teachers/create-account",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    importLectures: builder.mutation({
      query: (body: FormData) => ({
        url: "admin/teachers/import-data",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    updateLecture: builder.mutation({
      query: (body: LectureType) => ({
        url: "admin/teachers/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
  })
  // #endregion
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,

  useCreateStudentMutation,
  useImportStudentsMutation,
  useUpdateStudentMutation,
  useDeleteUserMutation,

  useCreateLectureMutation,
  useImportLecturesMutation,
  useUpdateLectureMutation
} = adminEndPoint;
