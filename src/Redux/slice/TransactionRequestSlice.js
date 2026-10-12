import { createSlice } from "@reduxjs/toolkit"

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

export const { setRequestList, setRequestListMeta, setDefaultTokenList, setDefaultTokenMeta } = transactionRequestSlice.actions

export default transactionRequestSlice.reducer

