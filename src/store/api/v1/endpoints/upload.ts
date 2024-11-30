import { ResponseType } from "@/types";
import { api } from "..";

const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generatePresignUrl: builder.mutation<ResponseType<string>, { key: string }>(
      {
        query: (data) => ({
          url: "/uploads/presign-url",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Upload"],
      },
    ),
    generateMultiplePresignUrls: builder.mutation<
      ResponseType<string[]>,
      { key: string[] }
    >({
      query: (data) => ({
        url: "/uploads/presign-urls",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const {
  useGeneratePresignUrlMutation,
  useGenerateMultiplePresignUrlsMutation,
} = uploadApi;
