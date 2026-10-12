import { createSlice } from "@reduxjs/toolkit"

const SubAdminTableSlice = createSlice({
    name: 'subAdmin',
    initialState: {
        data: [],
        meta: {}
    },
    reducers: {
        setListData: (state, action) => {
            state.data = action.payload?.data
            state.meta = action.payload?.meta
        }
    },
})

export const { setListData } = SubAdminTableSlice.actions

export default SubAdminTableSlice.reducer

