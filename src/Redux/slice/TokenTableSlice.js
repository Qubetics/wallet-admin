import { createSlice } from "@reduxjs/toolkit";
// import{decrypt} from "../../Helper/EncDec"

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
      //  console.log(action.payload,'============>>>act')
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

// export const { setCredentials, logOut } = TokenTableSlice.actions
export const {
  setTokenTableData,
  setNativeToken,
  setTokenSwapRequestCount,
  setAssetData,
} = TokenTableSlice.actions;

export default TokenTableSlice.reducer;

// export const selectCurrentUser = (state) => console.log(state,'=============stateuser')
// export const selectCurrentToken = (state) => state?.auth?.token
