import { createSlice } from "@reduxjs/toolkit"
// import{decrypt} from "../../Helper/EncDec"

const transactionRequestSlice = createSlice({
    name: 'TransactionRequest',
    initialState: { requestList: [], requestListMeta: {}, defaultTokenList: [], defaultTokenMeta: {} },
    reducers: {
        setRequestList: (state, action) => {
            state.requestList = action?.payload
        },
        setRequestListMeta: (state, action) => {
            state.requestListMeta = action?.payload
        },
        setDefaultTokenList: (state, action) => {
            state.defaultTokenList = action?.payload
        },
        setDefaultTokenMeta: (state, action) => {
            state.defaultTokenMeta = action?.payload
        }
    },
})

// export const { setCredentials, logOut } = transactionDetailSlice.actions
export const { setRequestList, setRequestListMeta, setDefaultTokenList, setDefaultTokenMeta } = transactionRequestSlice.actions

export default transactionRequestSlice.reducer

// export const selectCurrentUser = (state) => console.log(state,'=============stateuser')
// export const selectCurrentToken = (state) => state?.auth?.token