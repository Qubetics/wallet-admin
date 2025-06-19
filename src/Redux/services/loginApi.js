import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONFIG } from "../../common/constant/constant";
import { generateRandomNumber } from "../../Helper/EncDec";

// const customFetchBaseQuery = (baseUrl) => {
//   return async (args, api, extraOptions) => {
//     const result = await fetchBaseQuery({
//       baseUrl,
//       prepareHeaders: (headers, { getState }) => {
//         // Add custom headers here if needed
//         return headers;
//       },
//       fetchFn: (input, init) => {
//         return fetch(input, { ...init, mode: "no-cors" });
//       },
//     })(args, api, extraOptions);

//     return result;
//   };
// };

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({ baseUrl: CONFIG.API_URL }), //customFetchBaseQuery(CONFIG.API_URL),
  endpoints: (builder) => ({
    // logins: builder.query({
    //   //get data
    //   query: () => "users/hadley/orgs",
    // }),
    loginAuth: builder.mutation({
      // onclick and hit api
      query: (loginData) => ({
        url: "auth/login",
        method: "POST",
        body: loginData,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          // "Authorization": "dfadsfasf",
          Authorization: "",
          "aw-api-auth": generateRandomNumber(), 
        },
      }),
      // transformResponse: (result) => result.data,
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;

      //     dispatch(setToast({ message: "Loggedin successfully" }));
      //     dispatch(setUser(data));
      //     setTimeout(() => {
      //       dispatch(setToast({ message: null }));
      //     }, 2000);
      //   } catch (error) {
      //     console.log("Update login redux error ", error);
      //   }
      // },

      // async onCacheEntryAdded(arg, { dispatch }) {},
    }),
  }),
});

export const { useLoginAuthMutation } = loginApi;
