import { LectureType, StudentType, UserType, UserTypes } from "@/types/accounts";
import { api } from "..";

export interface Item {
  common_info: UserType;
  extra_info: {
    student?: StudentType;
    lecture?: LectureType;
  }
}
interface UsersResponse {
  code: number;
  message: boolean;
  data: {
    items: Item[],
    meta: {
      current_page: number;
      total: number;
    }
  }
}

const studentEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, { limit?: number; page?: number; user_types?: UserTypes, email?: string }>({
      query: ({ limit = 10, page = 1, user_types, email }) => ({
        url: 'admin/users/',
        params: { limit, page, user_types, email },
      }),
      providesTags: ["Account"],
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
    deleteStudent: builder.mutation({
      query: ({ id }: { id: number }) => ({
        url: `admin/students/delete/${id}`,
        method: "DELETE",
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
      query: (body: FormData ) => ({
        url: "admin/teachers/import-data",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    updateLecture:builder.mutation({
      query: (body: LectureType) => ({
        url: "admin/teachers/update-account",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    deleteLecture:builder.mutation({
        query: ({ email }: { email: string }) => ({
        url: `admin/students/delete/${email}`,
        method: "DELETE",
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
  useDeleteStudentMutation,

  useCreateLectureMutation,
  useImportLecturesMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
} = studentEndPoint;
