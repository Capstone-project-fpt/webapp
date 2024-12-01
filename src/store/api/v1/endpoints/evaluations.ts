import { ListPaginationType, ResponseType } from "@/types";
import {
  CreateEvaluationGroup,
  EvaluationType,
  QueryEvaluationsParams,
  UpdateEvaluationGroup,
} from "@/types/evaluation";
import { api } from "..";
import { CreateScheduleType, ScheduleType } from "@/types/schedule";
import { LectureType } from "@/types/accounts";

const evaluationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvaluations: builder.query<
      ResponseType<ListPaginationType<EvaluationType>>,
      QueryEvaluationsParams
    >({
      query: ({ limit = 10, page = 1, semester_id }) => {
        const params: QueryEvaluationsParams = {
          limit,
          page,
        };
        if (semester_id) {
          params.semester_id = semester_id;
        }
        return {
          url: "/evaluation-committees/",
          params,
        };
      },
      providesTags: ["EvaluationCommittee"],
    }),

    createEvaluation: builder.mutation<
      ResponseType<EvaluationType>,
      CreateEvaluationGroup
    >({
      query: (data) => ({
        url: "/evaluation-committees/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EvaluationCommittee"],
    }),
    getEvaluation: builder.query<ResponseType<EvaluationType>, { id: number }>({
      query: ({ id }) => ({
        url: `/evaluation-committees/${id}`,
      }),
      providesTags: ["EvaluationCommittee"],
    }),
    updateEvaluation: builder.mutation<
      ResponseType<string>,
      UpdateEvaluationGroup
    >({
      query: (data) => ({
        url: "/evaluation-committees/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EvaluationCommittee"],
    }),
    deleteEvaluation: builder.mutation<
      ResponseType<EvaluationType>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/evaluation-committees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EvaluationCommittee"],
    }),

    createSchedule: builder.mutation<ResponseType<string>, CreateScheduleType>({
      query: (data) => ({
        url: "/schedule-reviews/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    getSchedules: builder.query<
      ResponseType<ScheduleType[]>,
      {
        evaluation_committee_id: number;
        start_time: string | Date;
        end_time: string | Date;
      }
    >({
      query: ({ evaluation_committee_id, start_time, end_time }) => ({
        url: `/schedule-reviews/`,
        params: {
          evaluation_committee_id,
          start_time,
          end_time,
        },
      }),
    }),

    getListTeachersHaveEvaluationComitteeGroup: builder.query<
      ResponseType<LectureType[]>,
      { semester_id: number }
    >({
      query: ({ semester_id }) => ({
        url: `/evaluation-committees/semesters/${semester_id}/teachers`,
      }),
      providesTags: ["EvaluationCommittee"],
    }),
  }),
});

export const {
  useGetEvaluationsQuery,
  useGetEvaluationQuery,
  useCreateEvaluationMutation,
  useDeleteEvaluationMutation,
  useUpdateEvaluationMutation,
  useCreateScheduleMutation,
  useGetSchedulesQuery,
  useGetListTeachersHaveEvaluationComitteeGroupQuery,
} = evaluationsApi;
