import { UserItem } from "@/types/accounts";
import { createSlice } from "@reduxjs/toolkit";
import { removeCookie, setCookie } from "typescript-cookie";

export interface InitialStateType {
  token: string;
  user: UserItem | null;
}

const initialState: InitialStateType = {
  token: "",
  user: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveUserInfo: (state: InitialStateType, action) => {
      const { token } = action.payload;
      state.token = token;
      setCookie("token", token);
    },
    removeUserInfo: (state: InitialStateType) => {
      state.token = "";
      state.user = null;
      removeCookie("token");
    },
    setUserInfo: (state: InitialStateType, action) => {
      state.user = action.payload;
    }
  },
});

export const token = (state: InitialStateType) => state.token;
export const userInfo = (state: InitialStateType) => state.user;
export const { saveUserInfo, removeUserInfo, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
