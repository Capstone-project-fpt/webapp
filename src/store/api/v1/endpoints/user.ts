import { GetUsersResponse, UserTypes } from "@/types/accounts";
import { api } from "..";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    getUsers: builder.query<GetUsersResponse, { limit?: number; page?: number; user_types?: UserTypes, email?: string }>({
      query: ({ limit = 10, page = 1, user_types, email }) => ({
        url: '/users/',
        params: { limit, page, user_types, email },
      }),
      providesTags: ["Account"],
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

export const { useGetMeQuery, useGetUserQuery, useLazyGetUsersQuery } = userApi;
