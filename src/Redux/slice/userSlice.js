import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  ipData: {},
  authentication: {},
  loginResponseData: {},
  menus: [],
  twoFactorAuth: false,
  google2fa_status: false
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    logout: (state, action) => {
      state.user = null;
      state.twoFactorAuth = false;
      state.google2fa_status = false;
      action.payload?.navigate("/");
    },
    setUser: (state, action) => {
      state.user = action?.payload;
      // Update 2FA status based on user data
      state.google2fa_status = action?.payload?.google2fa_status === 1;
      state.twoFactorAuth = action?.payload?.google2fa_status === 1;
    },
    setAuthentication: (state, action) => {
      state.authentication = action?.payload?.data;
    },
    setLoginResponseData: (state, action) => {
      state.loginResponseData = action?.payload;
    },
    set2FaStatus: (state, action) => {
      state.twoFactorAuth = action?.payload;
      state.google2fa_status = action?.payload;
    },
    setIpAddress: (state, action) => {
      state.ipData = action?.payload;
    },
    setMenus: (state, action) => {
      state.menus = action?.payload;
    },
  },
});

export default userSlice.reducer;

export const {
  logout,
  setUser,
  setAuthentication,
  setLoginResponseData,
  set2FaStatus,
  setIpAddress,
  setMenus,
} = userSlice?.actions;
