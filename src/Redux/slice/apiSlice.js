import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CONFIG, clearStorage } from "../../common/constant/constant";

const baseQuery = fetchBaseQuery({
  baseUrl: CONFIG.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("jwt_token");

    if (token) {
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
      // store the new token
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
    }
  } else if (result?.error?.status === 408) {
    setTimeout(() => {
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
