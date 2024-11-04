import { SubMajor } from "@/services/schemas/major";
import { GroupType } from "@/types/group";
import { SemesterType } from "@/types/semester";
import { createSlice } from "@reduxjs/toolkit";

export interface InitialStateType {
  subMajors?: SubMajor[];
  currentGroup: GroupType | null;
  currentSemester: SemesterType | null;
}

const initialState: InitialStateType = {
  subMajors: [],
  currentGroup: null,
  currentSemester: null,
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
    },
    setCurrentSemester: (state: InitialStateType, action) => {
      state.currentSemester = action.payload;
    },
  },
});

export const { setSubMajors, setCurrentGroup, setCurrentSemester } = resourceSlice.actions;
export default resourceSlice.reducer;
