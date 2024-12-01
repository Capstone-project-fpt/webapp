import { configureStore } from "@reduxjs/toolkit";
import { api as v1 } from "./api/v1";
import authReducer from "./slice/auth";
import appReducer from "./slice/app";
import resourceReducer from "./slice/resource";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    resource: resourceReducer,
    [v1.reducerPath]: v1.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(v1.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
