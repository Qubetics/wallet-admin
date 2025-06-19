import { createSlice } from "@reduxjs/toolkit"
// import{decrypt} from "../../Helper/EncDec"

const AppSettingSlice = createSlice({
    initialState: { TokenData: [], DeviceUsers: [] },
    reducers: {
        setNewlyAddedToken: (state, action) => {

            state.TokenData = action.payload

        },
        setDeviceUsers: (state, action) => {


            state.DeviceUsers = action.payload

        },

        // setRequestList:(state,action)=>{

        // state.requestList=action.payload
        // }
    },
})

// export const { setCredentials, logOut } = AppSettingSlice.actions
export const { setNewlyAddedToken, setDeviceUsers } = AppSettingSlice.actions

export default AppSettingSlice.reducer

// export const selectCurrentUser = (state) => console.log(state,'=============stateuser')
// export const selectCurrentToken = (state) => state?.auth?.token