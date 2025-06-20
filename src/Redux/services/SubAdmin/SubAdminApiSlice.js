import { apiSlice } from "../../slice/apiSlice";

export const SubAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    menuList: builder.query({
      query: (params) => ({
        url: "wallet/menuList",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyMenuListQuery,
} = SubAdminApiSlice;
