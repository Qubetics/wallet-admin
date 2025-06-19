import { createSlice } from "@reduxjs/toolkit";
// import{decrypt} from "../../Helper/EncDec"

const transactionDetailSlice = createSlice({
  name: "TransactionData",
  initialState: { data: [], meta: [], listData: [] },
  reducers: {
    setTransactionData: (state, action) => {
      state.data = action?.payload?.data;
    },
    setTransactionListData: (state, action) => {
      console.log('action >>', action);
      state.listData = action?.payload?.data;
      state.meta = action?.payload?.meta;
    },

    // setRequestList:(state,action)=>{

    // state.requestList=action.payload
    // }
  },
});

// export const { setCredentials, logOut } = transactionDetailSlice.actions
export const { setTransactionData, setTransactionListData } = transactionDetailSlice.actions;

export default transactionDetailSlice.reducer;

// export const selectCurrentUser = (state) => console.log(state,'=============stateuser')
// export const selectCurrentToken = (state) => state?.auth?.token
