import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: { key: "1", value: "Dashboard" },
};

export const sidebarSlice = createSlice({
  initialState,
  name: "sidebarSlice",
  reducers: {
    setKey: (state, action) => {
      state.data = action.payload;
    },
  },
});

export default sidebarSlice.reducer;

export const { logout, setKey } = sidebarSlice.actions;
