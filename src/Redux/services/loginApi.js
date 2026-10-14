import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONFIG } from "../../common/constant/constant";
import { generateRandomNumber } from "../../Helper/EncDec";


export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({ baseUrl: CONFIG.API_URL }), //customFetchBaseQuery(CONFIG.API_URL),
  endpoints: (builder) => ({
    loginAuth: builder.mutation({
      // onclick and hit api
      query: (loginData) => ({
        url: "auth/login",
        method: "POST",
        body: loginData,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "app-version": "1",
          Authorization: "",
          "aw-api-auth": generateRandomNumber(), 
        },
      }),

    }),
  }),
});

export const { useLoginAuthMutation } = loginApi;
