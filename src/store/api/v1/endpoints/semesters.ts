import { ResponseType } from "@/types";
import { semesterApi } from "@/models/Appointment";

export const {
useGetSemestersQuery, 
useGetSemesterQuery,
useCreateSemestersMutation,
useUpdateSemestersMutation,
useDeleteSemestersMutation
} = semesterApi;
