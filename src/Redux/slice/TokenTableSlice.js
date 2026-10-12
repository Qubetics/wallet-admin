import { createSlice } from "@reduxjs/toolkit";

const TokenTableSlice = createSlice({
  name: "TokenTableData",
  initialState: {
    data: [],
    nativeTokenList: [],
    assetData: [],
    meta: {},
    swapRequestCount: 0,
  },
  reducers: {
    setTokenTableData: (state, action) => {
      state.data = action.payload?.data;
      state.meta = action.payload?.meta;
    },
    setNativeToken: (state, action) => {
      state.nativeTokenList = action?.payload;
    },
    setTokenSwapRequestCount: (state, action) => {
      state.swapRequestCount = action?.payload;
    },
    setAssetData: (state, action) => {
      state.assetData = action.payload?.data;
    },
  },
});

export const {
  setTokenTableData,
  setNativeToken,
  setTokenSwapRequestCount,
  setAssetData,
} = TokenTableSlice.actions;

export default TokenTableSlice.reducer;

