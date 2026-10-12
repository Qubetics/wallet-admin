import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONFIG } from "../../common/constant/constant";
import { generateRandomNumber } from "../../Helper/EncDec";

//       baseUrl,
//         // Add custom headers here if needed

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({ baseUrl: CONFIG.API_URL }), //customFetchBaseQuery(CONFIG.API_URL),
  endpoints: (builder) => ({
    //   //get data
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
          // "Authorization": "dfadsfasf",
          Authorization: "",
          "aw-api-auth": generateRandomNumber(), 
        },
      }),

    }),
  }),
});

export const { useLoginAuthMutation } = loginApi;
