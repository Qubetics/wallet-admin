import { createSlice } from "@reduxjs/toolkit"

const dashboardDetailsSlice = createSlice({
    name: 'DashboardData',
    initialState: {TokenData:[],DeviceUsers:[]},
    reducers: {
        setNewlyAddedToken: (state, action) => {

         state.TokenData = action.payload
           
        },
        setDeviceUsers: (state, action) => {
           

         state.DeviceUsers = action.payload
           
        },

    },
})

export const { setNewlyAddedToken ,setDeviceUsers} = dashboardDetailsSlice.actions

export default dashboardDetailsSlice.reducer

