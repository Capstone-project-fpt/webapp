import { SubMajor } from "@/services/schemas/major";
import { GroupType } from "@/types/group";
import { createSlice } from "@reduxjs/toolkit";

export interface InitialStateType {
  subMajors?: SubMajor[];
  currentGroup: GroupType | null;
}

const initialState: InitialStateType = {
  subMajors: [],
  currentGroup: null,
};

export const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setSubMajors: (state: InitialStateType, action) => {
      state.subMajors = action.payload;
    },
    setCurrentGroup: (state: InitialStateType, action) => {
      state.currentGroup = action.payload;
    }
  },
});

export const { setSubMajors, setCurrentGroup } = resourceSlice.actions;
export default resourceSlice.reducer;
