// import { setRequestList } from "../../slice/TransactionDetailSlice";
import { apiSlice } from "../../slice/apiSlice";

export const ChainSwapApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRevenueData: builder.mutation({
      query: (params) => ({
        url: "wallet/revenue",
        method: "Post",
        body: { ...params },
      }),
    }),
    getMarkupFees: builder.query({
      query: (params) => ({
        url: "wallet/swap_fee",
        method: "GET",
        params: { ...params },
        // body: params
      }),
    }),
    setMarkupFees: builder.mutation({
      query: (params) => ({
        url: "wallet/set_swap_fee",
        method: "POST",
        body: { ...params },
        // body: params
      }),
    }),
  }),
});

export const {
  useGetRevenueDataMutation,
  useGetMarkupFeesQuery,
  useSetMarkupFeesMutation,
} = ChainSwapApiSlice;
