import { api } from "..";


const groupsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<void, { limit?: number; page?: number }>({
      query: ({ limit = 10, page = 1 }) => ({
        url: '/capstone-groups/',
        params: { limit, page },
      }),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation<void, { major_id: number, semester_id: number, student_ids: number[], name_group: string }>({
      query: (data) => ({
        url: '/capstone-groups/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    getGroup: builder.query<void, { id: number }>({
      query: ({ id }) => ({
        url: `/capstone-groups/${id}`,
      }),
    }),
    updateGroup: builder.mutation<void, { id: number, major_id: number, semester_id: number, student_ids: number[], name_group: string }>({
      query: (data) => ({
        url: `/capstone-groups/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useCreateGroupMutation
} = groupsApi;
