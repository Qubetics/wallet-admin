import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toast: null,
  timestamp: null
};

export const toastSlice = createSlice({
  initialState,
  name: "toastSlice",
  reducers: {
    logout: (state, action) => {
      state.toast = null;
      state.timestamp = null;
    },
    setToast: (state, action) => {
      const currentTime = Date.now();
      
      // Only update if:
      // 1. No previous toast exists, OR
      // 2. Message is different, OR
      // 3. More than 2 seconds have passed since last toast
      if (
        !state.toast || 
        state.toast.message !== action.payload.message ||
        !state.timestamp ||
        currentTime - state.timestamp > 2000
      ) {
        state.toast = action.payload;
        state.timestamp = currentTime;
      }
    },
    clearToast: (state) => {
      state.toast = null;
      state.timestamp = null;
    }
  },
});

export default toastSlice.reducer;

export const { setToast, clearToast } = toastSlice.actions;
