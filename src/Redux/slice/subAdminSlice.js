import { createSlice } from "@reduxjs/toolkit"


const SubAdminTableSlice = createSlice({
    name: 'subAdmin',
    initialState: {
        data: [],
        meta: {}
    },
    reducers: {
        setListData: (state, action) => {
            //  console.log(action.payload,'============>>>act')
            state.data = action.payload?.data
            state.meta = action.payload?.meta
        }
    },
})

// export const { setCredentials, logOut } = TokenTableSlice.actions
export const { setListData } = SubAdminTableSlice.actions

export default SubAdminTableSlice.reducer

// export const selectCurrentUser = (state) => console.log(state,'=============stateuser')
// export const selectCurrentToken = (state) => state?.auth?.token