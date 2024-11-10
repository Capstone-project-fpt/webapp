import { GetUsersResponse, LectureType, StudentType, UsersPaginationType, UpdateStudentPayload, UpdateLecturePayload } from "@/types/accounts";
import { api } from "..";

const adminEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, UsersPaginationType>({
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
      query: (body: UpdateStudentPayload) => {
        const payload = {
          email: body.email,
          name: body.name,
          phone_number: body.phone_number,
          sub_major_id: body.sub_major_id,
          code: body.code,
        };

        return {
          url: `admin/users/${body.id}`,
          method: "PUT",
          body: payload,
        };
      },
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
    updateLecture: builder.mutation({
      query: (body: UpdateLecturePayload) => {
        const payload = {
          email: body.email,
          name: body.name,
          phone_number: body.phone_number,
          sub_major_id: body.sub_major_id,
        };

        return {
          url: `admin/users/${body.id}`,
          method: "PUT",
          body: payload,
        };
      },
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
