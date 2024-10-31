import { api } from "@/store/api/v1";
import { SemestersType, SemesterType } from "@/types/semester";
import { z } from "zod";

export interface Appointment {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId: string;
    order: number;
    details:{[key:string]:any};
}

export const updateAppointmentSchema = z.object({
    title: z.string().min(1,{message:"Title is required"}).max(50,{message:"Title is too long"}),
    start: z.date(),
    end: z.date(),
    details: z.record(z.any()).optional(),
});
 

export const createAppointmentSchema = z.object({
    title: z.string()
        .min(1, { message: "Title is required" })
        .max(50, { message: "Title is too long" }),
    start: z.date(),
    end: z.date(),
    resourceId: z.string()
        .min(1, { message: "Resource is required" }),
    order: z.number().optional(),
    details: z.record(z.any()).optional(),
})
.refine((data) => data.end.getTime() >= data.start.getTime(), {
    message: "End date must be after start date",
    path: ["end"], // This helps to focus the error message on the end date field
});
export const semesterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query<ResponseType<SemestersType>, { limit?: number; page?: number; }>({
      query: ({ limit = 10, page = 1 }) => ({
        url: '/semesters/',
        params: { limit, page },
      }),
      providesTags: ["Semester"],
    }),
    getSemester: builder.query<ResponseType<SemesterType>, { id: number; }>({
      query: ({ id }) => ({
        url: `/semesters/${id}`,
      }),
    }),
    createSemesters: builder.mutation<void, { name: string; start_time: string; end_time: string; }>({
      query: (data) => ({
        url: '/semesters/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),
    updateSemesters: builder.mutation<void, { id: number; name: string; start_time: string; end_time: string; }>({
      query: (data) => ({
        url: `/semesters/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),
    deleteSemesters: builder.mutation<void, { id: number; }>({
      query: ({ id }) => ({
        url: `/semesters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Semester"],
    }),
  }),
});
