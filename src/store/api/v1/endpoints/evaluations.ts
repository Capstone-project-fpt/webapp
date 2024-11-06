import { ListPaginationType, ResponseType } from "@/types";
import { CreateEvaluationGroup, EvaluationType, QueryEvaluationsParams } from "@/types/evaluation";
import { api } from "..";

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
                };
            },
            providesTags: ["EvaluationCommittee"],
        }),

        createEvaluation: builder.mutation<ResponseType<EvaluationType>, CreateEvaluationGroup>({
            query: (data) => ({
                url: "/evaluation-commitees/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["EvaluationCommittee"],
        }),
        getEvaluation: builder.query<ResponseType<EvaluationType>, { id: number }>({
            query: (id) => ({
                url: `/evaluation-committees/${id}`,
            }),
        }),
        updateEvaluation: builder.mutation<void, CreateEvaluationGroup>({
            query: (data) => ({
                url: "/evaluation-committees/",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["EvaluationCommittee"],
        }),
        deleteEvaluation: builder.mutation<ResponseType<EvaluationType>, { id: number }>({
            query: (id) => ({
                url: `/evaluation-committees/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["EvaluationCommittee"],
        }),
    })
});
export const {
    useGetEvaluationsQuery,
    useGetEvaluationQuery,
    useCreateEvaluationMutation,
    useDeleteEvaluationMutation,
    useUpdateEvaluationMutation,
} = evaluationsApi



