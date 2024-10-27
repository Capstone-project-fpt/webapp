import { ResponseType } from "@/types";
import { TopicsType } from "@/types/topic";
import { api } from "..";

const topicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query<ResponseType<TopicsType>, { limit?: number; page?: number }>({
      query: ({ limit = 10, page = 1 }) => ({
        url: '/topic_references/',
        params: { limit, page },
      }),
      providesTags: ["Topic"],
    }),
    adminCreateTopic: builder.mutation<void, { name: string, path: string, teacher_id: number }>({
      query: (data) => ({
        url: '/topic-references/admins/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Topic"],
    }),
    teacherCreateTopic: builder.mutation<void, { name: string, path: string }>({
      query: (data) => ({
        url: '/topic_references/teachers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Topic"],
    }),
    teacherUpdateTopic: builder.mutation<void, { id: number, name: string, path: string }>({
      query: (data) => ({
        url: `/topic_references/teachers/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Topic"],
    }),
    teacherDeleteTopic: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/topic_references/teachers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Topic"],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useAdminCreateTopicMutation,
  useTeacherCreateTopicMutation,
  useTeacherUpdateTopicMutation,
  useTeacherDeleteTopicMutation
} = topicApi;
