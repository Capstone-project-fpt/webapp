import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../../../store/slice/auth";

const API_VERSION = "v1";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_URL + '/' + API_VERSION,
    prepareHeaders: (headers, { getState }) => {
      const authState = getState().auth;
      const authToken = token(authState);
      headers.set("Content-Type", "application/json");

      if (authToken) {
        headers.set("authorization", `Bearer ${authToken}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Category", "Product", "User", "Topic", "Account", "Group"],
  endpoints: () => ({}),
});
