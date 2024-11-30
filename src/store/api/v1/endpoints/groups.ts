import { ListPaginationType, PaginationType, ResponseType } from "@/types";
import { StudentType } from "@/types/accounts";
import {
  CreateGroupBody,
  GroupReview,
  GroupType,
  InvitationMentor,
  InvitationMentorStatus,
  MembersType,
  MentorAndListMembersCapstoneGroup,
  QueryGroupsParams,
  ReportComment,
  StudentReportDocumentScore,
  TopicGroup,
  TopicGroupFeedback,
  TopicReviewStatus,
  UpdateListStudentScore,
} from "@/types/group";
import { ScheduleType } from "@/types/schedule";
import { api } from "..";
import {
  CreateReportDocumentBody,
  ReportDocumentType,
  UpdateReportDocumentBody,
} from "@/types/report-document";

const groupsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<
      ResponseType<ListPaginationType<GroupType>>,
      QueryGroupsParams
    >({
      query: ({ limit = 10, page = 1, semester_id, status }) => {
        const params: QueryGroupsParams = {
          limit,
          page,
        };

        if (semester_id) {
          params.semester_id = semester_id;
        }

        if (status) {
          params.status = status;
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
      ResponseType<string>,
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
      providesTags: ["Topic"],
    }),
    updateTopic: builder.mutation<
      void,
      {
        group_id: number;
        topic_id: number;
        document_path: string;
        topic: string;
      }
    >({
      query: ({ group_id, topic_id, document_path, topic }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
        method: "PUT",
        body: { document_path, topic },
      }),
      invalidatesTags: ["Topic"],
    }),
    deleteTopic: builder.mutation<void, { group_id: number; topic_id: number }>(
      {
        query: ({ group_id, topic_id }) => ({
          url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Topic"],
      },
    ),
    setGroupTopic: builder.mutation<
      ResponseType<string>,
      { group_id: number; topic_id: number }
    >({
      query: ({ group_id, topic_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}`,
        method: "POST",
      }),
      invalidatesTags: ["Topic"],
    }),
    reviewTopic: builder.mutation<
      ResponseType<string>,
      { group_id: number; topic_id: number; status_review: TopicReviewStatus }
    >({
      query: ({ group_id, topic_id, status_review }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/teacher-reviews/`,
        method: "PUT",
        body: { status_review },
      }),
      invalidatesTags: ["Topic"],
    }),
    getTopicFeedbacks: builder.query<
      ResponseType<ListPaginationType<TopicGroupFeedback>>,
      PaginationType & { group_id: number; topic_id: number }
    >({
      query: ({ group_id, topic_id, limit = 10, page = 1 }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/feedbacks/`,
        params: { limit, page },
      }),
      providesTags: ["Topic"],
    }),
    createTopicFeedback: builder.mutation<
      ResponseType<string>,
      { group_id: number; topic_id: number; feedback: string }
    >({
      query: ({ group_id, topic_id, feedback }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/feedbacks/`,
        method: "POST",
        body: { feedback },
      }),
      invalidatesTags: ["Topic"],
    }),
    deleteTopicFeedback: builder.mutation<
      ResponseType<string>,
      { group_id: number; topic_id: number; feedback_id: number }
    >({
      query: ({ group_id, topic_id, feedback_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-topics/${topic_id}/feedbacks/${feedback_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Topic"],
    }),
    //#endregion
    //#region Members
    getMembers: builder.query<ResponseType<MembersType>, { group_id: number }>({
      query: ({ group_id }) => ({
        url: `/capstone-groups/${group_id}/members`,
      }),
      providesTags: ["Group"],
    }),
    updateMembers: builder.mutation<
      ResponseType<MembersType>,
      { group_id: number; student_ids: number[] }
    >({
      query: ({ group_id, student_ids }) => ({
        url: `/capstone-groups/${group_id}/members`,
        method: "PUT",
        body: { student_ids },
      }),
      invalidatesTags: ["Group"],
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
      { group_id: number; token: string; status: InvitationMentorStatus }
    >({
      query: ({ group_id, token, status }) => ({
        url: `/capstone-groups/${group_id}/mentors/invitations`,
        method: "POST",
        body: { token, status },
      }),
      invalidatesTags: ["Group"],
    }),
    //#endregion

    //#region Review
    getGroupReviews: builder.query<
      ResponseType<GroupReview[]>,
      { group_id: number }
    >({
      query: ({ group_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-reviews/`,
      }),
    }),
    updateReportsGroupReview: builder.mutation<
      ResponseType<string>,
      {
        group_id: number;
        capstone_group_review_id: number;
        report_files: string[];
      }
    >({
      query: ({ group_id, capstone_group_review_id, report_files }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-reviews/`,
        method: "PATCH",
        body: { capstone_group_review_id, report_files },
      }),
    }),
    feedbackGroupReview: builder.mutation<
      ResponseType<string>,
      { group_id: number; capstone_group_review_id: number; feedback: string }
    >({
      query: ({ group_id, capstone_group_review_id, feedback }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-reviews/feedback`,
        method: "PATCH",
        body: { capstone_group_review_id, feedback },
      }),
    }),
    getGroupReview: builder.query<
      ResponseType<GroupReview>,
      { group_id: number; capstone_group_review_id: number }
    >({
      query: ({ group_id, capstone_group_review_id }) => ({
        url: `/capstone-groups/${group_id}/capstone-group-reviews/${capstone_group_review_id}`,
      }),
    }),

    getGroupScheduleReviews: builder.query<
      ResponseType<ScheduleType[]>,
      {
        capstone_group_id: number;
        start_time: string | Date;
        end_time: string | Date;
      }
    >({
      query: ({ capstone_group_id, start_time, end_time }) => ({
        url: `/schedule-reviews/`,
        params: { capstone_group_id, start_time, end_time },
      }),
    }),
    getGroupScheduleReview: builder.query<
      ResponseType<ScheduleType>,
      { schedule_review_id: number }
    >({
      query: ({ schedule_review_id }) => ({
        url: `/schedule-reviews/${schedule_review_id}`,
      }),
    }),
    //#endregion
    getListStudentsHaveCapstoneGroup: builder.query<
      ResponseType<StudentType[]>,
      { semester_id: number }
    >({
      query: ({ semester_id }) => ({
        url: `/capstone-groups/semesters/${semester_id}/students`,
      }),
      providesTags: ["Group"],
    }),
    //#region Report Document
    getCapstoneGroupReportDocuments: builder.query<
      ResponseType<ReportDocumentType[]>,
      { capstone_group_id: number }
    >({
      query: ({ capstone_group_id }) => ({
        url: `/capstone-groups/${capstone_group_id}/report-documents/`,
      }),
      providesTags: ["Group"],
    }),
    getCapstoneGroupReportDocument: builder.query<
      ResponseType<ReportDocumentType>,
      { capstone_group_id: number; report_id: number }
    >({
      query: ({ capstone_group_id, report_id }) => ({
        url: `/capstone-groups/${capstone_group_id}/report-documents/${report_id}`,
      }),
      providesTags: ["Group"],
    }),
    createReportDocument: builder.mutation<
      ResponseType<string>,
      CreateReportDocumentBody
    >({
      query: (data) => ({
        url: `/capstone-groups/${data.capstone_group_id}/report-documents/`,
        method: "POST",
        body: {
          file_ids: data.file_ids,
          name: data.name,
          type_report: data.type_report,
        },
      }),
      invalidatesTags: ["Group"],
    }),
    updateReportDocument: builder.mutation<
      ResponseType<string>,
      UpdateReportDocumentBody
    >({
      query: (data) => ({
        url: `/capstone-groups/${data.capstone_group_id}/report-documents/`,
        method: "PUT",
        body: {
          file_ids: data.file_ids,
          name: data.name,
          id: data.id,
        },
      }),
      invalidatesTags: ["Group"],
    }),
    getStudentReportDocuments: builder.query<
      ResponseType<StudentReportDocumentScore[]>,
      { capstone_group_id: number; report_id: number }
    >({
      query: ({ capstone_group_id, report_id }) => ({
        url: `/capstone-groups/${capstone_group_id}/report-documents/scores/${report_id}`,
      }),
      providesTags: ["Group"],
    }),
    mentorUpdateStudentScoreForReportDocument: builder.mutation<
      ResponseType<string>,
      UpdateListStudentScore
    >({
      query: (data) => ({
        url: `/capstone-groups/${data.capstone_group_id}/report-documents/scores`,
        method: "PUT",
        body: {
          report_document_id: data.report_document_id,
          student_score_data: data.student_score_data,
          conclusion: data.conclusion,
        },
      }),
      invalidatesTags: ["Group"],
    }),
    adminUpdateStudentScoreReportDocument: builder.mutation<
      ResponseType<string>,
      { id: number; score: number; capstone_group_id: number }
    >({
      query: (data) => ({
        url: `/capstone-groups/${data.capstone_group_id}/report-documents/scores`,
        method: "PATCH",
        body: {
          id: data.id,
          score: data.score,
        },
      }),
      invalidatesTags: ["Group"],
    }),
    getReportComments: builder.query<
      ResponseType<ReportComment[]>,
      { group_id: number; report_id: number }
    >({
      query: ({ group_id, report_id }) => ({
        url: `/capstone-groups/${group_id}/report-documents/${report_id}/comments/`,
      }),
    }),
    createReportComment: builder.mutation<
      ResponseType<string>,
      { group_id: number; report_id: number; message: string }
    >({
      query: ({ group_id, report_id, message }) => ({
        url: `/capstone-groups/${group_id}/report-documents/${report_id}/comments/`,
        method: "POST",
        body: { message },
      }),
    }),
    deleteReportComment: builder.mutation<
      ResponseType<string>,
      { group_id: number; report_id: number; comment_id: number }
    >({
      query: ({ group_id, report_id, comment_id }) => ({
        url: `/capstone-groups/${group_id}/report-documents/${report_id}/comments/`,
        method: "DELETE",
        body: {
          id: comment_id,
        },
      }),
    }),

    getCurrentGroupsSemester: builder.query<
      ResponseType<GroupType[]>,
      { semester_id: number }
    >({
      query: ({ semester_id }) => {
        return {
          url: "/capstone-groups/current-semester",
          params: { semester_id },
        };
      },
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
  useUpdateMembersMutation,
  useGetInvitationMentorsQuery,

  useGetGroupReviewsQuery,
  useGetGroupReviewQuery,
  useUpdateReportsGroupReviewMutation,
  useGetGroupScheduleReviewsQuery,
  useGetGroupScheduleReviewQuery,

  useFeedbackGroupReviewMutation,

  useGetListStudentsHaveCapstoneGroupQuery,

  useGetCapstoneGroupReportDocumentsQuery,
  useGetCapstoneGroupReportDocumentQuery,
  useLazyGetCapstoneGroupReportDocumentsQuery,
  useCreateReportDocumentMutation,
  useUpdateReportDocumentMutation,
  useGetStudentReportDocumentsQuery,

  useGetReportCommentsQuery,
  useCreateReportCommentMutation,
  useDeleteReportCommentMutation,

  useMentorUpdateStudentScoreForReportDocumentMutation,
  useAdminUpdateStudentScoreReportDocumentMutation,

  useGetCurrentGroupsSemesterQuery,
} = groupsApi;
