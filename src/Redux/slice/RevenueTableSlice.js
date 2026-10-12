import { createSlice } from "@reduxjs/toolkit";

const RevenueTableSlice = createSlice({
  name: "RevenueTableData",
  initialState: { data: [], meta: {}, revenue: [], fiat_currency_data: [] },
  reducers: {
    setRevenueTableData: (state, action) => {
      state[`data`] = action.payload?.data;
      state[`meta`] = action.payload?.meta;
      state[`revenue`] = action.payload?.total_amount;
      state[`fiat_currency_data`] = action.payload?.fiat_currency_data;
    },
  },
});

export const { setRevenueTableData } = RevenueTableSlice.actions;

export default RevenueTableSlice.reducer;

