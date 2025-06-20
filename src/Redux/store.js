import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { combineReducers } from "@reduxjs/toolkit";
import { loginApi } from "./services/loginApi";
import storage from "redux-persist/lib/storage";
import TransactionDataReducer from "./slice/TransactionDetailSlice";
import getTokenTableDataReducer from "./slice/TokenTableSlice";
import TransactionRequestReducer from "./slice/TransactionRequestSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userReducer from "./slice/userSlice";
import sidebarReducer from "./slice/sidebarSlice";
import toastReducer from "./slice/toastSlice";
import dashboardDetailsSliceReducer from "./slice/DashboardDetailsSlice";
import AnnouncementReducer from "./slice/announcementSlice";

import { apiSlice } from "./slice/apiSlice";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["userState"],
};

const combinedReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,

  toastState: toastReducer,
  userState: userReducer,
  sidebarState: sidebarReducer,
  TransactionData: TransactionDataReducer,
  TokenTableData: getTokenTableDataReducer,
  TransactionList: TransactionRequestReducer,
  DashboardList: dashboardDetailsSliceReducer,
  Announcement: AnnouncementReducer,
});
export const rootReducers = (state, action) => {
  if (action.type === "userSlice/logout") {
    state = undefined;
  }
  return combinedReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "userSlice/logout",
        ],
      },
    }).concat(loginApi.middleware, apiSlice.middleware),
});
setupListeners(store.dispatch);
let persistor = persistStore(store);
export { store, persistor };
