import { apiSlice } from "../../slice/apiSlice";

export const CommissionSettingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
     getCommisionDetials: builder.query({
      query: (params) => ({
        url: `commission/getCommissionDetails`,
        method: "GET",
        body: params,
      }),
    }),
    updateCommisionDetials: builder.mutation({
        query: (params) => ({
          url: `commission/updateCommissionDetails`,
          method: "POST",
          body: params,
        }),
      }),
  }),
});

export const {
  useGetCommisionDetialsQuery,
  useUpdateCommisionDetialsMutation,
} = CommissionSettingApiSlice;
