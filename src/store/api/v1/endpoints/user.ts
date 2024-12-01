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
        url: "/users/",
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
    getUsers: builder.query<GetUsersResponse, UsersPaginationType>({
      query: ({
        limit = 10,
        page = 1,
        order_by = "DESC",
        user_types,
        email,
      }) => ({
        url: "users/",
        params: { limit, page, order_by, user_types, email },
      }),
      providesTags: ["User", "Account"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUserQuery,
  useLazyGetUsersByUserQuery,
  useLazyGetMeQuery,
  useGetUsersQuery,
} = userApi;
