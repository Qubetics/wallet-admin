import { createSlice } from "@reduxjs/toolkit";

const transactionDetailSlice = createSlice({
  name: "TransactionData",
  initialState: { data: [], meta: [], listData: [] },
  reducers: {
    setTransactionData: (state, action) => {
      state.data = action?.payload?.data;
    },
    setTransactionListData: (state, action) => {
      state.listData = action?.payload?.data;
      state.meta = action?.payload?.meta;
    },

  },
});

export const { setTransactionData, setTransactionListData } = transactionDetailSlice.actions;

export default transactionDetailSlice.reducer;

