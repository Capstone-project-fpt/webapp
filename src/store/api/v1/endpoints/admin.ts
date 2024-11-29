import { GetUsersResponse, LectureType, StudentType, UsersPaginationType, UpdateStudentPayload, UpdateLecturePayload, UserTypes, UserType } from "@/types/accounts";
import { api } from "..";
import { ResponseType } from "@/types";

const adminEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, UsersPaginationType>({
      query: ({ limit = 10, page = 1, order_by = 'DESC', user_types, email }) => ({
        url: 'admin/users/',
        params: { limit, page, order_by, user_types, email },
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
      query: (body: FormData) => ({
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
    // #endregion
    // #region Verifier Topic
    getTopicVerifiers: builder.query<ResponseType<UserType[]>, { semester_id: number }>({
      query: ({ semester_id }) => ({
        url: `admin/verifiers-topic/semesters/${semester_id}`,
      }),
      providesTags: ["Account"],
    }),
    assignTopicVerifier: builder.mutation<ResponseType<string>, { semester_id: number; teacher_id: number }>({
      query: ({ semester_id, teacher_id }) => ({
        url: `admin/verifiers-topic/`,
        method: "POST",
        body: { semester_id, teacher_id },
      }),
      invalidatesTags: ["Account"],
    }),
    removeTopicVerifier: builder.mutation<ResponseType<string>, { semester_id: number, teacher_id: number; }>({
      query: ({ semester_id, teacher_id }) => ({
        url: `admin/verifiers-topic/`,
        method: "DELETE",
        body: { semester_id, teacher_id },
      }),
      invalidatesTags: ["Account"],
    }),
    // #endregion
  })
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
  useUpdateLectureMutation,

  useGetTopicVerifiersQuery,
  useAssignTopicVerifierMutation,
  useRemoveTopicVerifierMutation,
} = adminEndPoint;
