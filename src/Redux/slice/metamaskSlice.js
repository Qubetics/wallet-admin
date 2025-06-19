import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metamask: { address: "", balance: "" },
};

export const metamaskSlice = createSlice({
  initialState,
  name: "metamaskSlice",
  reducers: {
    metamask: (state, action) => {
      state.metamask = action.payload;
    },
  },
});

export default metamaskSlice.reducer;
export const { metamask } = metamaskSlice.actions;
