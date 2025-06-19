import { createSlice } from "@reduxjs/toolkit";
// import{decrypt} from "../../Helper/EncDec"

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

// export const { setCredentials, logOut } = RevenueTableSlice.actions
export const { setRevenueTableData } = RevenueTableSlice.actions;

export default RevenueTableSlice.reducer;

// export const selectCurrentUser = (state) => console.log(state,'=============stateuser')
// export const selectCurrentToken = (state) => state?.auth?.token
