import { ListPaginationType, PaginationType, ResponseType } from "@/types";
import {
  CreateGroupBody,
  GroupType,
  InvitationMentor,
  InvitationMentorStatus,
  MembersType,
  MentorAndListMembersCapstoneGroup,
  QueryGroupsParams,
  TopicGroup,
  TopicGroupFeedback,
  TopicReviewStatus,
} from "@/types/group";
import { api } from "..";

const groupsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<
      ResponseType<ListPaginationType<GroupType>>,
      QueryGroupsParams
    >({
      query: ({ limit = 10, page = 1, semester_id }) => {
        const params: QueryGroupsParams = {
          limit,
          page,
        };

        if (semester_id) {
          params.semester_id = semester_id;
        }

        return {
          url: "/capstone-groups/",
          params,
        };
      },
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation<ResponseType<GroupType>, CreateGroupBody>({
      query: (data) => ({
        url: "/capstone-groups/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    getGroup: builder.query<ResponseType<GroupType>, { id: number }>({
      query: ({ id }) => ({
        url: `/capstone-groups/${id}`,
      }),
    }),
    getMentorAndListMembersGroup: builder.query<
      ResponseType<MentorAndListMembersCapstoneGroup>,
      { capstone_group_id: number }
    >({
      query: ({ capstone_group_id }) => ({
        url: `/capstone-groups/${capstone_group_id}/members`,
      }),
    }),
    updateGroup: builder.mutation<void, CreateGroupBody>({
      query: (data) => ({
        url: `/capstone-groups/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),

    //#region Topic
    getTopics: builder.query<
      ResponseType<ListPaginationType<TopicGroup>>,
      PaginationType & { group_id: number }
    >({
      query: ({ group_id, limit = 10, page = 1, order_by = "DESC" }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/`,
        params: { limit, page, order_by },
        providesTags: ["Topic"],
      }),
    }),
    createTopic: builder.mutation<
      void,
      { group_id: number; document_path: string; topic: string }
    >({
      query: ({ group_id, document_path, topic }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/`,
        method: "POST",
        body: { document_path, topic },
      }),
      invalidatesTags: ["Topic"],
    }),
    getTopic: builder.query<
      ResponseType<TopicGroup>,
      { group_id: number; topic_id: number }
    >({
      query: ({ group_id, topic_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
      }),
    }),
    updateTopic: builder.mutation<void, { group_id: number, topic_id: number, document_path: string, topic: string }>({
      query: ({ group_id, topic_id, document_path, topic }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
        method: "PUT",
        body: { document_path, topic },
      }),
    }),
    deleteTopic: builder.mutation<void, { group_id: number, topic_id: number }>({
      query: ({ group_id, topic_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
        method: 'DELETE',
      }),
    }),
    setGroupTopic: builder.mutation<ResponseType<string>, { group_id: number, topic_id: number }>({
      query: ({ group_id, topic_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
        method: 'POST',
      }),
    }),
    reviewTopic: builder.mutation<ResponseType<string>, { group_id: number, topic_id: number, status_review: TopicReviewStatus }>({
      query: ({ group_id, topic_id, status_review }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/teacher-reviews/`,
        method: 'PUT',
        body: { status_review },
      }),
    }),
    getTopicFeedbacks: builder.query<ResponseType<ListPaginationType<TopicGroupFeedback>>, PaginationType & { group_id: number, topic_id: number }>({
      query: ({ group_id, topic_id, limit = 10, page = 1 }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/feedbacks/`,
        params: { limit, page },
      }),
    }),
    createTopicFeedback: builder.mutation<void, { group_id: number, topic_id: number, feedback: string }>({
      query: ({ group_id, topic_id, feedback }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/feedbacks/`,
        method: 'POST',
        body: { feedback },
      }),
    }),
    deleteTopicFeedback: builder.mutation<void, { group_id: number, topic_id: number, feedback_id: number }>({
      query: ({ group_id, topic_id, feedback_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/feedbacks/${feedback_id}`,
        method: 'DELETE',
      }),
    }),
    //#endregion
    //#region Members
    getMembers: builder.query<ResponseType<MembersType>, { group_id: number }>({
      query: ({ group_id }) => ({
        url: `/capstone-groups/${group_id}/members`,
      }),
      providesTags: ["Group"],
    }),

    getInvitationMentors: builder.query<
      ResponseType<ListPaginationType<InvitationMentor>>,
      PaginationType & { group_id: number }
    >({
      query: ({ limit = 10, page = 1, group_id }) => ({
        url: `/capstone-groups/${group_id}/mentors/invitations`,
        params: { limit, page },
      }),
      providesTags: ["Group"],
    }),

    inviteMentor: builder.mutation<
      ResponseType<string>,
      { group_id: number; teacher_id: number; semester_id: number }
    >({
      query: ({ group_id, teacher_id, semester_id }) => ({
        url: `/capstone-groups/${group_id}/mentors`,
        method: "POST",
        body: { teacher_id, semester_id },
      }),
      invalidatesTags: ["Group"],
    }),
    acceptInvitation: builder.mutation<
      ResponseType<string>,
      { group_id: number; token: string, status: InvitationMentorStatus }
    >({
      query: ({ group_id, token, status }) => ({
        url: `/capstone-groups/${group_id}/mentors/invitation`,
        method: "POST",
        body: { token, status },
      }),
      invalidatesTags: ["Group"],
    }),
    //#endregion
  }),
});

export const {
  useGetGroupsQuery,
  useLazyGetGroupsQuery,

  useCreateGroupMutation,
  useGetGroupQuery,
  useGetMentorAndListMembersGroupQuery,
  useLazyGetMentorAndListMembersGroupQuery,
  useUpdateGroupMutation,

  useInviteMentorMutation,
  useAcceptInvitationMutation,

  useGetTopicsQuery,
  useCreateTopicMutation,
  useGetTopicQuery,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useSetGroupTopicMutation,

  useReviewTopicMutation,
  useGetTopicFeedbacksQuery,
  useCreateTopicFeedbackMutation,
  useDeleteTopicFeedbackMutation,

  useGetMembersQuery,
  useGetInvitationMentorsQuery,
} = groupsApi;
