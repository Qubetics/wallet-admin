import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CONFIG, clearStorage } from "../../common/constant/constant";
import { generateRandomNumber } from "../../Helper/EncDec";

const baseQuery = fetchBaseQuery({
  baseUrl: CONFIG.API_URL,
  prepareHeaders: (headers, { getState }) => {
    // const token = getState()?.userState?.user?.token;
    const token = localStorage.getItem("jwt_token");
    console.log("token",token)

    
    const randomNumber = generateRandomNumber();

    headers.set("aw-api-auth", randomNumber);
    headers.set("app-version", "1")
    if (token) {
      // headers.set("authorization", `Bearer ${token}`)
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Authorization", `${token}`);
    } else {
      headers.set("Authorization", "");
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // const user = api.getState().auth.user
      // store the new token
      // api.dispatch(setCredentials({ ...refreshResult.data, user }))
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // api.dispatch(logOut())
    }
  } else if (result?.error?.status === 408) {
    // alert("Session timeout , please login again");
    // dispatch(
    //   setToast({
    //     message: "Session timeout , please login again",
    //     status: false,
    //   })
    // );
    setTimeout(() => {
      // localStorage.clear();
      clearStorage();
      window.location.reload();
    }, 1000);
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: [],
});
