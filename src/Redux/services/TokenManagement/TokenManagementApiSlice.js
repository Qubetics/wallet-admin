import { apiSlice } from "../../slice/apiSlice";
import { Link } from "react-router-dom";
import { setToast } from "../../slice/toastSlice";
import { clearStorage } from "../../../common/constant/constant";

export const TokenManagementApiSlice = apiSlice.injectEndpoints({
  tagTypes: ["id", "addproject", "data"],

  endpoints: (builder) => ({
    getTokenTableData: builder.mutation({
      query: (params) => ({
        url: "token/tokenList",
        method: "POST",
        body: { ...params },
      }),
      providesTags: ["list", "id", "addproject", "data"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            // alert("Session timeout , please login again");
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    searchToken: builder.mutation({
      query: (data) => ({
        url: `wallet/searchToken`,
        method: "POST",
        body:{...data},
      }),
      /*async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
           
        } catch (error) {
           
          if (error.error.status == 408) { 
            setTimeout(() => {
              localStorage.clear();
              window.location.reload();
            }, 1000);
          }

        }
      },*/
    }),
    NativeTokenList: builder.query({
      query: (params) => ({
        url: `wallet/native_coin_list`,
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            // alert("Session timeout , please login again");
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    addToken: builder.mutation({
      query: (data) => ({
        url: `token/addToken`,
        method: "POST",
        body: { ...data },
      }),
      // invalidatesTags:['list','id','addproject','data']
    }),
    removeToken: builder.mutation({
      query: (params) => ({
        url: "wallet/remove_token",
        method: "post",
        body: { ...params },
      }),
      invalidatesTags: ["id"],
    }),

    addTokenImage: builder.mutation({
      query: (formData) => ({
        url: "token/updateTokenLogo",
        method: "PUT",
        body: formData,
        formData: true
      }),
      // invalidatesTags:['list','id','addproject','data']
    }),
    editTokenImage: builder.mutation({
      query: (data) => ({
        url: "wallet/edit_token",
        method: "POST",
        body: { ...data },
      }),
      // invalidatesTags:['list','id','addproject','data']
    }),
    setEnableSwap: builder.mutation({
      query: (data) => ({
        url: "wallet/add_allow_swap",
        method: "POST",
        body: data,
      }),
      // invalidatesTags:['list','id','addproject','data']
    }),
    editTokenName: builder.mutation({
      query: (data) => ({
        url: "wallet/edit_token_name",
        method: "POST",
        body: { ...data },
      }),
      // invalidatesTags:['list','id','addproject','data']
    }),
    editTokenRank: builder.mutation({
      query: (data) => ({
        url: "wallet/edit_token_rank",
        method: "POST",
        body: { ...data },
      }),
      // invalidatesTags:['list','id','addproject','data']
    }),
    assetsByPolicyId: builder.mutation({
      query: (data) => ({
        url: "wallet/assets_of_ada_by_policy_id",
        method: "POST",
        body: { ...data },
      }),
      // invalidatesTags:['list','id','addproject','data']
    }),
  }),
});

export const {
  useGetTokenTableDataMutation,
  useAddTokenMutation,
  useSearchTokenMutation,
  useRemoveTokenMutation,
  useAddTokenImageMutation,
  useSetEnableSwapMutation,
  useNativeTokenListQuery,
  useEditTokenImageMutation,
  useEditTokenNameMutation,
  useEditTokenRankMutation,
  useAssetsByPolicyIdMutation,
} = TokenManagementApiSlice;
