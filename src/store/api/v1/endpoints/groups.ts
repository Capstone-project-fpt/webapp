import { ListPaginationType, PaginationType, ResponseType } from "@/types";
import { CreateGroupBody, GroupType, InvitationMentor, MembersType } from "@/types/group";
import { api } from "..";


const groupsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<void, PaginationType>({
      query: ({ limit = 10, page = 1 }) => ({
        url: '/capstone-groups/',
        params: { limit, page },
      }),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation<ResponseType<GroupType>, CreateGroupBody>({
      query: (data) => ({
        url: '/capstone-groups/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    getGroup: builder.query<ResponseType<GroupType>, { id: number }>({
      query: ({ id }) => ({
        url: `/capstone-groups/${id}`,
      }),
    }),
    updateGroup: builder.mutation<void, CreateGroupBody>({
      query: (data) => ({
        url: `/capstone-groups/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),

    inviteMentor: builder.mutation<void, { group_id: number, teacher_id: number, semester_id: number }>({
      query: ({ group_id, teacher_id, semester_id }) => ({
        url: `/capstone-groups/${group_id}/mentors`,
        method: 'POST',
        body: { teacher_id, semester_id },
      }),
      invalidatesTags: ["Group"],
    }),
    acceptInvitation: builder.mutation<void, { group_id: number, token: string }>({
      query: ({ group_id, token }) => ({
        url: `/capstone-groups/${group_id}/mentors/invitation`,
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ["Group"],
    }),

    //#region Topic
    getTopics: builder.query<void, { group_id: number }>({
      query: ({ group_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics`,
      }),
    }),
    createTopic: builder.mutation<void, { group_id: number, document_path: string, topic: string }>({
      query: ({ group_id, document_path, topic }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics`,
        method: 'POST',
        body: { document_path, topic },
      }),
      invalidatesTags: ["Group"],
    }),
    getTopic: builder.query<void, { group_id: number, topic_id: number }>({
      query: ({ group_id, topic_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
      }),
    }),
    updateTopic: builder.mutation<void, { group_id: number, topic_id: number, document_path: string, topic: string }>({
      query: ({ group_id, topic_id, document_path, topic }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
        method: 'PUT',
        body: { document_path, topic },
      }),
    }),
    deleteTopic: builder.mutation<void, { group_id: number, topic_id: number }>({
      query: ({ group_id, topic_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
        method: 'DELETE',
      }),
    }),
    //#endregion
    getMembers: builder.query<ResponseType<MembersType>, { group_id: number }>({
      query: ({ group_id }) => ({
        url: `/capstone-groups/${group_id}/members`,
      }),
    }),

    getInvitationMentors: builder.query<ListPaginationType<InvitationMentor>, PaginationType & { group_id: number }>({
      query: ({ limit = 10, page = 1, group_id }) => ({
        url: `/capstone-groups/${group_id}/mentors/invitations`,
        params: { limit, page },
      }),
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useGetGroupQuery,
  useUpdateGroupMutation,

  useInviteMentorMutation,
  useAcceptInvitationMutation,

  useGetTopicsQuery,
  useCreateTopicMutation,
  useGetTopicQuery,
  useUpdateTopicMutation,
  useDeleteTopicMutation,

  useGetMembersQuery,
  useGetInvitationMentorsQuery
} = groupsApi;
