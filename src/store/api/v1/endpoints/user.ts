import { GetUsersResponse, UsersPaginationType } from "@/types/accounts";
import { api } from "..";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    getUsersByUser: builder.query<GetUsersResponse, UsersPaginationType>({
      query: ({ limit = 10, page = 1, user_types, email }) => ({
        url: '/users/',
        params: { limit, page, user_types, email },
      }),
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery, useGetUserQuery, useLazyGetUsersByUserQuery } = userApi;
