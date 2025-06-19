import { clearStorage } from "../../../common/constant/constant";
import { apiSlice } from "../../slice/apiSlice";
import { setToast } from "../../slice/toastSlice";

export const SubAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subAdminList: builder.mutation({
      query: (params) => ({
        url: "wallet/get_sub_admin",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status === 408) {
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
    menuList: builder.query({
      query: (params) => ({
        url: "wallet/menuList",
        method: "GET",
      }),
    }),
    addSubAdmin: builder.mutation({
      query: (params) => ({
        url: "wallet/add_sub_admin",
        method: "post",
        body: params,
      }),
    }),
    changeSubAdminPermissions: builder.mutation({
      query: (params) => ({
        url: "wallet/chnage_sub_admin_permissions",
        method: "post",
        body: params,
      }),
    }),
    deleteSubAdmin: builder.mutation({
      query: (params) => ({
        url: "wallet/delete_sub_admin",
        method: "post",
        body: params,
      }),
    }),
  }),
});

export const {
  useSubAdminListMutation,
  useLazyMenuListQuery,
  useAddSubAdminMutation,
  useChangeSubAdminPermissionsMutation,
  useDeleteSubAdminMutation,
} = SubAdminApiSlice;
